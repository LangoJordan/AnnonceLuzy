<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use App\Models\Category;
use App\Services\ViewTrackingService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class AdShowController extends Controller
{
    /**
     * Display a specific ad with all details
     */
    public function show($id)
    {
        $ad = Ad::with([
            'user:id,name,email,user_type,status,phone,country_id,city_id,address',
            'user.profile:id,user_id,photo,description,slogan,address',
            'user.country:id,name,code',
            'user.city:id,name,code,region,country_id',
            'space:id,agency_id,name,email,phone,address,country_id,city_id,merchant_code',
            'space.country:id,name,code',
            'space.city:id,name,code,region,country_id',
            'country:id,name,code',
            'city:id,name,code,region,country_id',
            'category:id,name,slug',
            'subcategory:id,name,slug,category_id',
            'features:id,ad_id,label,photo',
            'boosts' => function ($q) {
                $q->where('end_date', '>', now())
                  ->where('active', 1)
                  ->with('boost:id,label,priority_level');
            },
        ])->where('status', 'valid')
          ->findOrFail($id);

        // Track view using the service
        ViewTrackingService::trackView($ad, true);

        // Get user's subscription info if they're an agency
        $agencySubscription = null;
        if ($ad->user && $ad->user->subscriptions) {
            $agencySubscription = $ad->user->subscriptions()
                ->wherePivot('status', true)
                ->where('user_subscriptions.end_date', '>', now())
                ->first();
        }

        // Determine tier badge
        $tierBadge = null;
        $tierLabel = null;
        $tierColor = null;

        $activeBoost = $ad->boosts->first();
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

        // Collect all ad photos (main + facets)
        $allPhotos = [];
        if ($ad->main_photo) {
            $allPhotos[] = [
                'photo' => $ad->main_photo,
                'label' => 'Photo principale',
            ];
        }
        if ($ad->features && count($ad->features) > 0) {
            foreach ($ad->features as $feature) {
                $allPhotos[] = [
                    'photo' => $feature->photo,
                    'label' => $feature->label,
                ];
            }
        }

        // Transform ad data for frontend
        $transformedAd = [
            'id' => $ad->id,
            'title' => $ad->title,
            'description' => $ad->description,
            'contact_email' => $ad->contact_email,
            'contact_phone' => $ad->contact_phone,
            'price' => $ad->price,
            'price_description' => $ad->price_description ?? 'fixe',
            'category' => $ad->category?->name,
            'category_id' => $ad->category_id,
            'subcategory' => $ad->subcategory?->name,
            'subcategory_id' => $ad->subcategory_id,
            'address' => $ad->address,
            'city' => $ad->city?->name,
            'city_id' => $ad->city_id,
            'country' => $ad->country?->name,
            'country_id' => $ad->country_id,
            'main_photo' => $ad->main_photo,
            'photos' => $allPhotos,
            'views_count' => $ad->views_count,
            'created_at' => $ad->created_at->format('Y-m-d'),
            'tier_badge' => $tierBadge,
            'tier_label' => $tierLabel,
            'tier_color' => $tierColor,
            'has_boost' => $activeBoost !== null,
            'subscription_end_date' => $agencySubscription?->pivot?->end_date ? (is_string($agencySubscription->pivot->end_date) ? Carbon::parse($agencySubscription->pivot->end_date)->format('Y-m-d') : $agencySubscription->pivot->end_date->format('Y-m-d')) : null,
        ];

        // Get agency details
        $agencyData = null;
        if ($ad->user) {
            $agencyData = [
                'id' => $ad->user->id,
                'name' => $ad->user->name,
                'email' => $ad->user->email,
                'phone' => $ad->user->phone ?? '',
                'address' => $ad->user->address ?? '',
                'country' => $ad->user->country?->name,
                'city' => $ad->user->city?->name,
                'user_type' => $ad->user->user_type,
                'status' => $ad->user->status,
                'profile' => $ad->user->profile ? [
                    'photo' => $ad->user->profile->photo,
                    'description' => $ad->user->profile->description,
                    'slogan' => $ad->user->profile->slogan,
                    'address' => $ad->user->profile->address,
                ] : null,
                'space' => $ad->space ? [
                    'id' => $ad->space->id,
                    'name' => $ad->space->name,
                    'email' => $ad->space->email,
                    'phone' => $ad->space->phone,
                    'address' => $ad->space->address,
                    'country' => $ad->space->country?->name,
                    'city' => $ad->space->city?->name,
                    'merchant_code' => $ad->space->merchant_code ?? 'XXXXX-XXXXX-XXXXX',
                ] : null,
            ];
        }

        // Get related ads from same category
        $relatedAds = Ad::with(['city', 'category', 'user:id,name'])
            ->where('status', 'valid')
            ->where('id', '!=', $id)
            ->where('category_id', $ad->category_id)
            ->limit(3)
            ->get()
            ->map(function ($relAd) {
                $relBoost = $relAd->boosts()
                    ->where('end_date', '>', now())
                    ->where('active', 1)
                    ->first();

                return [
                    'id' => $relAd->id,
                    'title' => $relAd->title,
                    'price' => $relAd->price,
                    'city' => $relAd->city?->name,
                    'address' => $relAd->address,
                    'main_photo' => $relAd->main_photo,
                    'views_count' => $relAd->views_count,
                    'tier_badge' => $relBoost ? 'boost' : null,
                    'tier_label' => $relBoost ? 'Boost Premium' : null,
                ];
            })
            ->toArray();

        // Check if current user has favorited this ad
        $isFavorite = false;
        if (Auth::check()) {
            $isFavorite = $ad->favorites()
                ->where('user_id', Auth::id())
                ->exists();
        }

        return Inertia::render('Ads/Show', [
            'ad' => $transformedAd,
            'agency' => $agencyData,
            'relatedAds' => $relatedAds,
            'isFavorite' => $isFavorite,
            'user' => Auth::user(),
        ]);
    }
}
