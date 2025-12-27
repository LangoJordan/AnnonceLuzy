<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class SearchController extends Controller
{
    /**
     * Display home page with featured ads and categories
     */
    public function home(Request $request)
    {
        // Fetch all active categories with subcategories
        $categories = Category::with('subcategories')
            ->orderBy('name')
            ->get()
            ->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                    'description' => $cat->description,
                    'href' => '/ads?category_id=' . $cat->id,
                    'subcategories' => $cat->subcategories->map(function ($sub) {
                        return [
                            'id' => $sub->id,
                            'name' => $sub->name,
                            'slug' => $sub->slug,
                        ];
                    })->toArray(),
                ];
            })
            ->toArray();

        // Fetch featured ads (first 8 with prioritization)
        $featuredAds = Ad::with([
            'category:id,name',
            'city:id,name,country_id',
            'country:id,name',
            'user:id,name',
            'boosts' => function ($q) {
                $q->where('end_date', '>', now())
                  ->where('active', 1)
                  ->with('boost:id,label,priority_level');
            },
            'user.subscriptions' => function ($q) {
                $q->where('status', true)
                  ->where('end_date', '>', now());
            },
        ])
        ->where('status', 'valid')
        ->select([
            'ads.*',
            DB::raw('
                CASE
                    WHEN EXISTS (
                        SELECT 1 FROM ad_boosts
                        WHERE ad_boosts.ad_id = ads.id
                        AND ad_boosts.end_date > NOW()
                        AND ad_boosts.active = 1
                    ) THEN 1
                    WHEN EXISTS (
                        SELECT 1 FROM user_subscriptions
                        WHERE user_subscriptions.user_id = ads.user_id
                        AND user_subscriptions.status = 1
                        AND user_subscriptions.end_date > NOW()
                    ) THEN 2
                    ELSE 3
                END AS priority_tier
            '),
            DB::raw('
                COALESCE((
                    SELECT MAX(boosts.priority_level) FROM ad_boosts
                    INNER JOIN boosts ON ad_boosts.boost_id = boosts.id
                    WHERE ad_boosts.ad_id = ads.id
                    AND ad_boosts.end_date > NOW()
                    AND ad_boosts.active = 1
                ), 0) AS boost_priority_level
            '),
            DB::raw('
                COALESCE((
                    SELECT MAX(subscriptions.amount) FROM user_subscriptions
                    INNER JOIN subscriptions ON user_subscriptions.subscription_id = subscriptions.id
                    WHERE user_subscriptions.user_id = ads.user_id
                    AND user_subscriptions.status = 1
                    AND user_subscriptions.end_date > NOW()
                ), 0) AS subscription_price
            '),
        ])
        ->orderByRaw('
            CASE WHEN priority_tier = 1 THEN 0
                 WHEN priority_tier = 2 THEN 1
                 ELSE 2
            END ASC
        ')
        ->orderByRaw('
            CASE WHEN priority_tier = 1 THEN boost_priority_level
                 WHEN priority_tier = 2 THEN subscription_price
                 ELSE 0
            END DESC
        ')
        ->orderBy('ads.views_count', 'DESC')
        ->orderBy('ads.created_at', 'DESC')
        ->limit(8)
        ->get()
        ->map(function ($ad) {
            $activeBoost = $ad->boosts->first();
            $agencySubscription = $ad->user?->subscriptions->first();

            $tierBadge = null;
            $tierLabel = null;
            $tierColor = null;

            if ($activeBoost) {
                $tierBadge = 'boost';
                $tierLabel = $activeBoost->boost?->label ?? 'Boost Premium';
                $tierColor = 'amber';
            } elseif ($agencySubscription) {
                $tierBadge = 'subscription';
                $subscriptionAmount = $agencySubscription->amount ?? 0;
                $tierLabel = match(true) {
                    $subscriptionAmount <= 50 => 'Agence Certifiée',
                    $subscriptionAmount <= 100 => 'Agence Premium',
                    $subscriptionAmount >= 200 => 'Agence Elite',
                    default => 'Agence Partenaire',
                };
                $tierColor = match(true) {
                    $subscriptionAmount >= 200 => 'purple',
                    $subscriptionAmount >= 100 => 'blue',
                    default => 'cyan',
                };
            }

            return [
                'id' => $ad->id,
                'title' => $ad->title,
                'price' => $ad->price,
                'location' => $ad->city?->name ?? '',
                'address' => $ad->address,
                'city' => $ad->city?->name,
                'country' => $ad->country?->name,
                'main_photo' => $ad->main_photo,
                'views_count' => $ad->views_count,
                'tier_badge' => $tierBadge,
                'tier_label' => $tierLabel,
                'tier_color' => $tierColor,
            ];
        })
        ->toArray();

        // Fetch countries for location filter
        $countries = \App\Models\Country::where('is_active', true)
            ->orderBy('name')
            ->select('id', 'name')
            ->get()
            ->toArray();

        // Fetch all cities for location filter
        $cities = \App\Models\City::where('is_active', true)
            ->orderBy('name')
            ->select('id', 'name', 'country_id')
            ->get()
            ->toArray();

        return Inertia::render('Home', [
            'categories' => $categories,
            'featuredAds' => $featuredAds,
            'countries' => $countries,
            'cities' => $cities,
            'user' => auth()->user(),
        ]);
    }

    /**
     * Search ads with advanced prioritization
     *
     * Priority Tiers:
     * 1. Active boosted ads (sorted by boost priority, then views)
     * 2. Ads from agencies with active subscriptions (sorted by subscription price, then views)
     * 3. Valid ads without boost/expired boost (sorted by views)
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'q' => 'nullable|string|max:255',
            'category_id' => 'nullable|integer|exists:categories,id',
            'subcategory_id' => 'nullable|integer|exists:subcategories,id',
            'country_id' => 'nullable|integer|exists:countries,id',
            'city_id' => 'nullable|integer|exists:cities,id',
            'address' => 'nullable|string|max:255',
            'sort' => 'nullable|in:relevance,price_asc,price_desc,newest,most_viewed',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $searchQuery = $validated['q'] ?? '';
        $categoryId = $validated['category_id'] ?? null;
        $subcategoryId = $validated['subcategory_id'] ?? null;
        $countryId = $validated['country_id'] ?? null;
        $cityId = $validated['city_id'] ?? null;
        $address = $validated['address'] ?? null;
        $sortBy = $validated['sort'] ?? 'relevance';
        $perPage = $validated['per_page'] ?? 20;

        // Build the base query with all necessary relationships
        $query = Ad::query()
            ->with([
                'category',
                'subcategory',
                'country',
                'city',
                'space',
                'user',
                'user.subscriptions' => function ($q) {
                    $q->where('status', true)
                        ->where('end_date', '>', now());
                },
                'boosts' => function ($q) {
                    $q->where('end_date', '>', now());
                },
            ])
            ->where('ads.status', 'valid');

        // Apply text search filter
        if (!empty($searchQuery)) {
            $query = $this->applyTextSearch($query, $searchQuery);
        }

        // Apply category filter
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        // Apply subcategory filter
        if ($subcategoryId) {
            $query->where('subcategory_id', $subcategoryId);
        }

        // Apply country filter
        if ($countryId) {
            $query->where('country_id', $countryId);
        }

        // Apply city filter
        if ($cityId) {
            $query->where('city_id', $cityId);
        }

        // Apply address filter
        if (!empty($address)) {
            $query->where('address', 'LIKE', '%' . str_replace('%', '\%', $address) . '%');
        }

        // Clone query for total count before pagination
        $totalCount = $query->count();

        // Apply prioritization and sorting
        $query = $this->applyPrioritization($query, $sortBy);

        // Paginate results
        $ads = $query->paginate($perPage);

        // Transform results to include tier information
        $transformedAds = $ads->map(function ($ad) {
            return $this->transformAdForResponse($ad);
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $transformedAds,
                'meta' => [
                    'total' => $totalCount,
                    'per_page' => $perPage,
                    'current_page' => $ads->currentPage(),
                    'total_pages' => $ads->lastPage(),
                    'has_more' => $ads->hasMorePages(),
                ],
                'filters' => [
                    'query' => $searchQuery,
                    'category_id' => $categoryId,
                    'subcategory_id' => $subcategoryId,
                    'country_id' => $countryId,
                    'city_id' => $cityId,
                    'address' => $address,
                    'sort' => $sortBy,
                ],
            ]);
        }

        // For web requests, return Inertia response
        $categories = Category::with('subcategories')
            ->orderBy('name')
            ->get();

        // Fetch countries and cities for filter dropdown
        $countries = \App\Models\Country::where('is_active', true)
            ->orderBy('name')
            ->get();

        // Fetch cities for the selected country, or all cities if no country is selected
        $cities = $cityId || $countryId
            ? \App\Models\City::where('is_active', true)
                ->when($countryId, function ($q) use ($countryId) {
                    $q->where('country_id', $countryId);
                })
                ->orderBy('name')
                ->get()
            : collect([]);

        return Inertia::render('Ads', [
            'ads' => $transformedAds,
            'pagination' => [
                'total' => $totalCount,
                'per_page' => $perPage,
                'current_page' => $ads->currentPage(),
                'total_pages' => $ads->lastPage(),
                'has_more' => $ads->hasMorePages(),
            ],
            'filters' => [
                'query' => $searchQuery,
                'category_id' => $categoryId,
                'subcategory_id' => $subcategoryId,
                'country_id' => $countryId,
                'city_id' => $cityId,
                'address' => $address,
                'sort' => $sortBy,
            ],
            'categories' => $categories,
            'countries' => $countries,
            'cities' => $cities,
        ]);
    }

    /**
     * Apply text-based search with fuzzy matching
     * Searches in title, description, category, and subcategory
     * Supports partial word matching for flexible search
     */
    private function applyTextSearch(Builder $query, string $searchQuery): Builder
    {
        // Split search query into terms for better matching
        $terms = array_filter(explode(' ', trim($searchQuery)));

        if (empty($terms)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($terms) {
            // For each term, search across multiple fields
            foreach ($terms as $term) {
                // Sanitize search term to prevent SQL injection
                $safeTerm = '%' . str_replace('%', '\%', $term) . '%';

                // Create a group for this term (OR logic within term, AND logic between terms)
                $q->where(function (Builder $subQ) use ($safeTerm) {
                    // Search in title (highest priority)
                    $subQ->where('ads.title', 'LIKE', $safeTerm)
                        // Search in description
                        ->orWhere('ads.description', 'LIKE', $safeTerm)
                        // Search in category name
                        ->orWhereHas('category', function (Builder $catQ) use ($safeTerm) {
                            $catQ->where('name', 'LIKE', $safeTerm);
                        })
                        // Search in subcategory name
                        ->orWhereHas('subcategory', function (Builder $subcatQ) use ($safeTerm) {
                            $subcatQ->where('name', 'LIKE', $safeTerm);
                        });
                });
            }
        });
    }

    /**
     * Apply prioritization logic with database query optimization
     *
     * Tier 1: Active boosted ads (highest priority, sorted by boost priority level DESC, then views DESC)
     * Tier 2: Ads from active subscription agencies (sorted by subscription amount DESC, then views DESC)
     * Tier 3: Valid ads without boost or expired boost (sorted by views DESC, then created_at DESC)
     *
     * Each tier is ordered internally by views count to ensure engagement matters at every level
     */
    private function applyPrioritization(Builder $query, string $sortBy): Builder
    {
        // Apply custom sorting based on sortBy parameter, but maintain tier prioritization
        return $query->select([
            'ads.*',
            DB::raw('
                CASE
                    WHEN EXISTS (
                        SELECT 1 FROM ad_boosts
                        WHERE ad_boosts.ad_id = ads.id
                        AND ad_boosts.end_date > NOW()
                        AND ad_boosts.active = 1
                    ) THEN 1
                    WHEN EXISTS (
                        SELECT 1 FROM user_subscriptions
                        WHERE user_subscriptions.user_id = ads.user_id
                        AND user_subscriptions.status = 1
                        AND user_subscriptions.end_date > NOW()
                    ) THEN 2
                    ELSE 3
                END AS priority_tier
            '),
            DB::raw('
                COALESCE((
                    SELECT MAX(boosts.priority_level) FROM ad_boosts
                    INNER JOIN boosts ON ad_boosts.boost_id = boosts.id
                    WHERE ad_boosts.ad_id = ads.id
                    AND ad_boosts.end_date > NOW()
                    AND ad_boosts.active = 1
                ), 0) AS boost_priority_level
            '),
            DB::raw('
                COALESCE((
                    SELECT MAX(subscriptions.amount) FROM user_subscriptions
                    INNER JOIN subscriptions ON user_subscriptions.subscription_id = subscriptions.id
                    WHERE user_subscriptions.user_id = ads.user_id
                    AND user_subscriptions.status = 1
                    AND user_subscriptions.end_date > NOW()
                ), 0) AS subscription_price
            '),
        ])
        // Primary sort: by tier (1 = boosted, 2 = subscription, 3 = others)
        ->orderByRaw('
            CASE WHEN priority_tier = 1 THEN 0
                 WHEN priority_tier = 2 THEN 1
                 ELSE 2
            END ASC
        ')
        // Secondary sort within tier 1: by boost priority level DESC
        // Secondary sort within tier 2: by subscription price DESC
        ->orderByRaw('
            CASE WHEN priority_tier = 1 THEN boost_priority_level
                 WHEN priority_tier = 2 THEN subscription_price
                 ELSE 0
            END DESC
        ')
        // Tertiary sort within each tier: by views count DESC (engagement metric)
        ->orderBy('ads.views_count', 'DESC')
        // Quaternary sort: by creation date DESC (newest first within same view count)
        ->orderBy('ads.created_at', 'DESC');
    }

    /**
     * Transform ad data for response with tier information
     */
    private function transformAdForResponse(Ad $ad): array
    {
        // Check for active boost (using AdBoost relation with active flag)
        $activeBoost = $ad->boosts()
            ->where('end_date', '>', now())
            ->where('active', true)
            ->first();

        $hasActiveBoost = $activeBoost !== null;

        // Get agency subscription info
        $agencySubscription = $ad->user?->subscriptions()
            ->where('status', true)
            ->where('end_date', '>', now())
            ->first();

        // Get active boost details if available
        $boostDetails = null;
        if ($hasActiveBoost) {
            $boostDetails = $activeBoost->load('boost');
            $boostDetails = [
                'priority_level' => $boostDetails->boost?->priority_level ?? 0,
                'boost_label' => $boostDetails->boost?->label ?? 'Premium Boost',
                'end_date' => $boostDetails->end_date->format('Y-m-d'),
            ];
        }

        // Determine tier badge based on actual conditions
        $tierBadge = null;
        $tierLabel = null;
        $tierColor = null;

        if ($hasActiveBoost) {
            $tierBadge = 'boost';
            $tierLabel = $boostDetails['boost_label'] ?? 'Boost Premium';
            $tierColor = 'amber';
        } elseif ($agencySubscription) {
            $tierBadge = 'subscription';
            // Use the amount field from subscription relationship
            $subscriptionAmount = $agencySubscription->amount ?? 0;
            $tierLabel = match(true) {
                $subscriptionAmount <= 50 => 'Agence Certifiée',
                $subscriptionAmount <= 100 => 'Agence Premium',
                $subscriptionAmount >= 200 => 'Agence Elite',
                default => 'Agence Partenaire',
            };
            $tierColor = match(true) {
                $subscriptionAmount >= 200 => 'purple',
                $subscriptionAmount >= 100 => 'blue',
                default => 'cyan',
            };
        }

        return [
            'id' => $ad->id,
            'title' => $ad->title,
            'description' => $ad->description,
            'category' => $ad->category?->name,
            'subcategory' => $ad->subcategory?->name,
            'price' => $ad->price,
            'price_description' => $ad->price_description ?? 'fixe',
            'location' => $ad->city?->name ?? '',
            'address' => $ad->address ?? '',
            'country' => $ad->country?->name ?? '',
            'country_id' => $ad->country_id,
            'city' => $ad->city?->name ?? '',
            'city_id' => $ad->city_id,
            'agency_space_name' => $ad->space?->name ?? '',
            'agency_space_id' => $ad->space_id,
            'agency_space_address' => $ad->space?->address ?? '',
            'main_photo' => $ad->main_photo,
            'views_count' => $ad->views_count,
            'agency_name' => $ad->user?->name,
            'tier_badge' => $tierBadge,
            'tier_label' => $tierLabel,
            'tier_color' => $tierColor,
            'has_boost' => $hasActiveBoost,
            'boost_details' => $boostDetails,
            'subscription_amount' => $agencySubscription?->amount ?? 0,
            'subscription_end_date' => $agencySubscription?->end_date ? (is_string($agencySubscription->end_date) ? Carbon::parse($agencySubscription->end_date)->format('Y-m-d') : $agencySubscription->end_date->format('Y-m-d')) : null,
            'created_at' => $ad->created_at->format('Y-m-d'),
        ];
    }

    /**
     * Get popular/trending searches for suggestions
     * Can be cached for performance
     */
    public function getPopularSearches(): JsonResponse
    {
        // This would typically come from a search_logs table
        // For now, return popular categories and common terms
        $popularCategories = Category::withCount('ads')
            ->orderBy('ads_count', 'DESC')
            ->limit(5)
            ->get(['id', 'name', 'ads_count']);

        return response()->json([
            'searches' => [
                'Développeur React',
                'Appartement Paris',
                'Formation JavaScript',
                'Consultant SEO',
            ],
            'categories' => $popularCategories,
        ]);
    }

    /**
     * Get search suggestions based on partial input
     */
    public function getSuggestions(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json(['suggestions' => []]);
        }

        // Sanitize input
        $safeTerm = '%' . str_replace('%', '\%', $query) . '%';

        $suggestions = Ad::where('ads.status', 'valid')
            ->where(function (Builder $q) use ($safeTerm) {
                $q->where('ads.title', 'LIKE', $safeTerm)
                  ->orWhere('ads.description', 'LIKE', $safeTerm);
            })
            ->select('ads.title')
            ->distinct()
            ->limit(10)
            ->get()
            ->pluck('title');

        return response()->json([
            'suggestions' => $suggestions,
        ]);
    }
}
