<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use App\Models\AdBoost;
use App\Models\AdFeature;
use App\Models\AgencySpace;
use App\Models\User;
use App\Models\View;
use App\Models\Country;
use App\Models\City;
use App\Models\Favorite;
use App\Models\Contact;
use App\Models\Transaction;
use App\Models\Subscription;
use App\Models\UserSubscription;
use App\Models\EmployeePosition;
use App\Models\Boost;
use App\Models\Profile;
use App\Models\Category;
use App\Services\QuotaService;
use App\Models\Subcategory;
use App\Http\Traits\WithAgencyContext;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Psy\Readline\Hoa\Console;

use function Laravel\Prompts\alert;

class AgencyDashboardController extends Controller
{
    use WithAgencyContext;
    /**
     * Get the current agency context based on user type and session
     * For agencies: returns the user themselves
     * For employees: returns the selected agency from session
     */
    protected function getAgencyContext()
    {
        $user = Auth::user();

        if ($user->user_type === 'agency') {
            return $user;
        }

        // For employees, get the selected agency from session
        $selectedAgencyId = session('selected_agency_id');
        if (!$selectedAgencyId) {
            return null;
        }

        // Verify user has access to this agency
        $agency = User::where('id', $selectedAgencyId)
            ->whereHas('agencySpaces.employeePositions', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->first();

        return $agency;
    }

    /**
     * Add selected agency data to Inertia render
     */
    private function withAgencyData(array $data): array
    {
        $agencyContextData = $this->getSelectedAgencyData();
        return array_merge($data, [
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Display agency dashboard with real data
     * Also visible to employees assigned to agency spaces
     */
    public function index(): Response
    {
        $user = Auth::user();

        if (!$user) {
            return Inertia::render('Agency/Dashboard', [
                'user' => null,
                'agency' => [],
                'recentAds' => [],
                'commercials' => [],
                'paymentHistory' => [],
            ]);
        }

        if ($user->user_type !== 'agency' && $user->user_type !== 'employee') {
            return Inertia::render('Agency/Dashboard', [
                'user' => $user,
                'agency' => [],
                'recentAds' => [],
                'commercials' => [],
                'paymentHistory' => [],
            ]);
        }

        // Get agency context - uses session for employees
        $agency = $this->getAgencyContext();

        if (!$agency) {
            return Inertia::render('Agency/Dashboard', [
                'user' => $user,
                'agency' => [],
                'recentAds' => [],
                'commercials' => [],
                'paymentHistory' => [],
            ]);
        }

        // Employees see ALL agency data, not just their own
        $ads = $agency->ads()->get();
        $adIds = $ads->pluck('id');

        $totalImpressions = $ads->sum('views_count');
        $totalContacts = $adIds->count() > 0 ? Contact::whereIn('ad_id', $adIds)->count() : 0;
        $totalClicks = $totalContacts;
        $conversionRate = $totalImpressions > 0 ? number_format(($totalClicks / $totalImpressions) * 100, 1) . '%' : '0%';
        $totalRevenue = $ads->sum('revenue') ?? 0;
        $avgCPC = $totalClicks > 0 ? ($totalRevenue / $totalClicks) : 0;

        $activeSubscription = $agency->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->first();

        $employeeCount = 0;
        if ($agency->agencySpaces()->count() > 0) {
            $employeeCount = User::whereIn('id', function ($q) use ($agency) {
                $q->select('user_id')
                    ->from('employee_positions')
                    ->whereIn('space_id', $agency->agencySpaces()->pluck('id'));
            })->count();
        }


        $recentAds = $ads->map(function ($ad) {
            return [
                'id' => $ad->id,
                'title' => $ad->title,
                'status' => $ad->status === 'valid' ? 'active' : 'archived',
                'views' => $ad->views_count,
                'clicks' => Contact::where('ad_id', $ad->id)->count(),
                'ctr' => $ad->views_count > 0 ? number_format((Contact::where('ad_id', $ad->id)->count() / $ad->views_count) * 100, 1) . '%' : '0%',
                'createdAt' => is_string($ad->created_at) ? $ad->created_at : $ad->created_at->format('Y-m-d'),
                'boosted' => $ad->boosts()->where('end_date', '>', now())->exists(),
                'revenue' => 'XFA ' . number_format($ad->revenue ?? 0, 2, ',', ' '),
            ];
        })->sortByDesc('createdAt')->values();

        // Rassembler les annonces des espaces de l'agence (pour les agences ET employés)
        $countAdsActiveEmplaye = 0;
        $vueEm = 0;
        $clicEm = 0;

        foreach ($agency->agencySpaces as $space) {
            $adsEmploye = Ad::where('space_id', $space->id)->where('user_id', '<>', $agency->id)->get();

            foreach ($adsEmploye as $ade) {
                $adContacts = Contact::where('ad_id', $ade->id)->count();
                $row = [
                    'id' => $ade->id,
                    'title' => $ade->title,
                    'status' => $ade->status === 'valid' ? 'active' : 'archived',
                    'views' => $ade->views_count,
                    'clicks' => $adContacts,
                    'ctr' => $ade->views_count > 0 ? number_format(($adContacts / $ade->views_count) * 100, 1) . '%' : '0%',
                    'createdAt' => is_string($ade->created_at) ? $ade->created_at : $ade->created_at->format('Y-m-d'),
                    'boosted' => $ade->boosts()->where('end_date', '>', now())->exists(),
                    'revenue' => 'XFA ' . number_format($ade->revenue ?? 0, 2, ',', ' '),
                ];
                if ($ade->status === 'valid') {
                    $countAdsActiveEmplaye++;
                }
                $vueEm = $vueEm + $ade->views_count;
                $clicEm = $clicEm + $adContacts;
                $recentAds->push($row);
            }
        }

        // Triez à nouveau par date créée après avoir ajouté toutes les annonces
        $recentAds = $recentAds->sortByDesc('createdAt')->values();

        $agencyData = [
            'name' => $agency->name,
            'memberCount' => $employeeCount,
            'amount' => $activeSubscription?->amount ?? '0',
            'totalSpent' => 'XFA ' . number_format($totalRevenue, 2, ',', ' '),
            'subscription' => $activeSubscription?->label ?? 'Free',
            'nextBillingDate' => $activeSubscription && $activeSubscription->pivot->end_date
                ? (is_string($activeSubscription->pivot->end_date) ? $activeSubscription->pivot->end_date : $activeSubscription->pivot->end_date->format('Y-m-d'))
                : 'N/A',
            'merchantCode' => $agency->merchant_code ?? 'N/A',
            'stats' => [
                'totalAds' => $ads->count(),
                'activeAds' => $ads->where('status', 'valid')->count() + $countAdsActiveEmplaye,
                'totalImpressions' => $totalImpressions + $vueEm,
                'totalClicks' => $totalClicks + $clicEm,
                'conversionRate' => $conversionRate,
                'avgCPC' => 'XFA' . number_format($avgCPC, 2, ',', '.'),
                'revenue' => 'XFA' . number_format($totalRevenue, 2, ',', ' '),
            ],
        ];





        $spaceIds = $agency->agencySpaces()->pluck('id');
        $commercials = User::whereIn('id', function ($q) use ($spaceIds) {
            $q->select('user_id')
                ->from('employee_positions')
                ->whereIn('space_id', $spaceIds);
        })
            ->with(['profile', 'employeePositions'])
            ->get()
            ->map(function ($employee) {
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'email' => $employee->email,
                    'adsCreated' => $employee->ads()->count(),
                    'phone' => $employee->phone ?? 'N/A',
                ];
            })->values();

        $transactions = Transaction::where('sender_id', $agency->id)
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();

        $paymentHistory = $transactions->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'date' => is_string($transaction->date) ? $transaction->date : $transaction->date->format('Y-m-d'),
                'amount' => 'XFA ' . number_format($transaction->amount, 2, ',', ' '),
                'type' => $transaction->transaction_type,
                'status' => ucfirst($transaction->status),
            ];
        })->toArray();

        if (empty($paymentHistory) && $activeSubscription) {
            $startDate = is_string($activeSubscription->pivot->start_date)
                ? $activeSubscription->pivot->start_date
                : $activeSubscription->pivot->start_date->format('Y-m-d');

            $paymentHistory[] = [
                'id' => 1,
                'date' => $startDate,
                'amount' => 'XFA ' . number_format($activeSubscription->amount, 2, ',', ' '),
                'type' => 'subscription',
                'status' => 'Completed',
            ];
        }

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/Dashboard', [
            'user' => $user,
            'agency' => $agencyData,
            'recentAds' => $recentAds,
            'commercials' => $commercials,
            'paymentHistory' => $paymentHistory,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }
    /**
     * Display agency ads page with real data
     * Also visible to employees assigned to agency spaces
     */
    public function annonceShow(): Response
    {
        $user = Auth::user();

        if (!$user) {
            return Inertia::render('Agency/Ads', [
                'user' => null,
                'ads' => [],
                'stats' => [],
            ]);
        }

        if ($user->user_type !== 'agency' && $user->user_type !== 'employee') {
            return Inertia::render('Agency/Ads', [
                'user' => $user,
                'ads' => [],
                'stats' => [],
            ]);
        }

        // Get agency context - for agencies, use their own data; for employees, use their employer's data
        $agency = $user->user_type === 'agency'
            ? $user
            : User::whereHas('agencySpaces.employeePositions', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->first();

        if (!$agency) {
            return Inertia::render('Agency/Ads', [
                'user' => $user,
                'ads' => [],
                'stats' => [],
            ]);
        }

        // Employees see ALL agency data, not just their own
        $ads = $agency->ads()->get();
        $adIds = $ads->pluck('id');

        $totalImpressions = $ads->sum('views_count');
        $totalContacts = $adIds->count() > 0 ? Contact::whereIn('ad_id', $adIds)->count() : 0;
        $totalClicks = $totalContacts;
        $totalRevenue = $ads->sum('revenue') ?? 0;

        // Format ads with location information
        $allAds = $ads->map(function ($ad) {
            $country = Country::find($ad->country_id);
            $city = City::find($ad->city_id);
            $location = '';

            if ($city && $country) {
                $location = $city->name . ', ' . $country->name;
            } elseif ($city) {
                $location = $city->name;
            } elseif ($country) {
                $location = $country->name;
            }

            return [
                'id' => $ad->id,
                'title' => $ad->title,
                'location' => $location,
                'status' => $ad->status === 'valid' ? 'active' : 'archived',
                'views' => $ad->views_count,
                'clicks' => Contact::where('ad_id', $ad->id)->count(),
                'ctr' => $ad->views_count > 0 ? number_format((Contact::where('ad_id', $ad->id)->count() / $ad->views_count) * 100, 1) . '%' : '0%',
                'createdAt' => is_string($ad->created_at) ? $ad->created_at : $ad->created_at->format('Y-m-d'),
                'boosted' => $ad->boosts()->where('end_date', '>', now())->exists(),
                'boostEndsAt' => $ad->boosts()->where('end_date', '>', now())->first()?->end_date ?
                    (is_string($ad->boosts()->where('end_date', '>', now())->first()->end_date)
                        ? $ad->boosts()->where('end_date', '>', now())->first()->end_date
                        : $ad->boosts()->where('end_date', '>', now())->first()->end_date->format('Y-m-d'))
                    : null,
                'revenue' => 'XFA ' . number_format($ad->revenue ?? 0, 2, ',', ' '),
                'category' => 'Général',
            ];
        })->sortByDesc('createdAt')->values();

        // Include employee ads from agency spaces (for agencies and employees)
        foreach ($agency->agencySpaces()->get() as $space) {
            $adsEmploye = Ad::where('space_id', $space->id)
                ->where('user_id', '!=', $agency->id)
                ->get();

            foreach ($adsEmploye as $ade) {
                $country = Country::find($ade->country_id);
                $city = City::find($ade->city_id);
                $location = '';

                if ($city && $country) {
                    $location = $city->name . ', ' . $country->name;
                } elseif ($city) {
                    $location = $city->name;
                } elseif ($country) {
                    $location = $country->name;
                }

                $adContacts = Contact::where('ad_id', $ade->id)->count();
                $allAds->push([
                    'id' => $ade->id,
                    'title' => $ade->title,
                    'location' => $location,
                    'status' => $ade->status === 'valid' ? 'active' : 'archived',
                    'views' => $ade->views_count,
                    'clicks' => $adContacts,
                    'ctr' => $ade->views_count > 0 ? number_format(($adContacts / $ade->views_count) * 100, 1) . '%' : '0%',
                    'createdAt' => is_string($ade->created_at) ? $ade->created_at : $ade->created_at->format('Y-m-d'),
                    'boosted' => $ade->boosts()->where('end_date', '>', now())->exists(),
                    'boostEndsAt' => $ade->boosts()->where('end_date', '>', now())->first()?->end_date ?
                        (is_string($ade->boosts()->where('end_date', '>', now())->first()->end_date)
                            ? $ade->boosts()->where('end_date', '>', now())->first()->end_date
                            : $ade->boosts()->where('end_date', '>', now())->first()->end_date->format('Y-m-d'))
                        : null,
                    'revenue' => 'XFA ' . number_format($ade->revenue ?? 0, 2, ',', ' '),
                    'category' => 'Général',
                ]);
            }
        }

        // Sort all ads by creation date
        $allAds = $allAds->sortByDesc('createdAt')->values();

        // Calculate total revenue from all ads
        $totalAdsRevenue = $allAds->reduce(function ($carry, $ad) {
            $revenueStr = str_replace(['XFA ', ' ', ','], ['', '', '.'], $ad['revenue']);
            return $carry + (float)$revenueStr;
        }, 0);

        // Calculate stats
        $stats = [
            'totalAds' => $allAds->count(),
            'activeAds' => $allAds->filter(function ($ad) { return $ad['status'] === 'active'; })->count(),
            'totalViews' => $allAds->sum('views'),
            'totalClicks' => $allAds->sum('clicks'),
            'totalRevenue' => 'XFA ' . number_format($totalAdsRevenue, 2, ',', ' '),
        ];

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/Ads', [
            'user' => $user,
            'ads' => $allAds,
            'stats' => $stats,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }
    /**
     * Get agency dashboard overview
     * Accessible to agencies and their employees
     */
    public function overview(): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'agency' && $user->user_type !== 'employee') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        // Get agency context - uses session for employees
        $agency = $this->getAgencyContext();

        if (!$agency) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $ads = $agency->ads()->get();

        $stats = [
            'total_ads' => $ads->count(),
            'active_ads' => $ads->where('status', 'valid')->count(),
            'pending_ads' => $ads->where('status', 'pending')->count(),
            'blocked_ads' => $ads->where('status', 'blocked')->count(),
            'total_views' => $ads->sum('views_count'),
            'total_favorites' => Favorite::whereIn('ad_id', $ads->pluck('id'))->count(),
            'total_contacts' => Contact::whereIn('ad_id', $ads->pluck('id'))->count(),
            'total_spaces' => $agency->agencySpaces()->count(),
            'active_subscription' => $agency->subscriptions()
                ->wherePivot('status', true)
                ->where('user_subscriptions.end_date', '>', now())
                ->first(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Get agency ads with statistics
     * Accessible to agencies and their employees
     */
    public function getAds(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'agency' && $user->user_type !== 'employee') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        // Get agency context - uses session for employees
        $agency = $this->getAgencyContext();

        if (!$agency) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $query = $agency->ads()->with(['features', 'boosts', 'space']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('space_id')) {
            $query->where('space_id', $request->space_id);
        }

        $ads = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $ads,
        ]);
    }

    /**
     * Get ad detailed statistics
     */
    public function getAdStatistics($adId): JsonResponse
    {
        $user = Auth::user();
        $ad = Ad::find($adId);

        if (!$ad || $ad->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found or unauthorized'
            ], 403);
        }

        $stats = [
            'views' => $ad->views()->count(),
            'unique_views' => $ad->views()->distinct('user_id')->count(),
            'favorites' => $ad->favorites()->count(),
            'contacts' => $ad->contacts()->count(),
            'reports' => $ad->reports()->count(),
            'boosts' => $ad->boosts()->where('ad_boosts.active', true)
                ->where('ad_boosts.end_date', '>', now())
                ->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Get agency spaces
     * Accessible to agencies and their employees
     */
    public function getSpaces(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'agency' && $user->user_type !== 'employee') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        // Get agency context - uses session for employees
        $agency = $this->getAgencyContext();

        if (!$agency) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $spaces = $agency->agencySpaces()
            ->with(['ads', 'employeePositions.user'])
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $spaces,
        ]);
    }

    /**
     * Get space statistics
     * Accessible to agencies and their employees
     */
    public function getSpaceStatistics($spaceId): JsonResponse
    {
        $user = Auth::user();
        $space = AgencySpace::find($spaceId);

        if (!$space) {
            return response()->json([
                'status' => 'error',
                'message' => 'Space not found'
            ], 404);
        }

        // Check authorization
        if ($user->user_type === 'agency') {
            if ($space->agency_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }
        } elseif ($user->user_type === 'employee') {
            // Check if employee is assigned to this space
            $hasAccess = EmployeePosition::where('user_id', $user->id)
                ->where('space_id', $space->id)
                ->exists();

            if (!$hasAccess) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $ads = $space->ads()->get();

        $stats = [
            'total_ads' => $ads->count(),
            'active_ads' => $ads->where('status', 'valid')->count(),
            'total_views' => $ads->sum('views_count'),
            'total_favorites' => Favorite::whereIn('ad_id', $ads->pluck('id'))->count(),
            'total_contacts' => Contact::whereIn('ad_id', $ads->pluck('id'))->count(),
            'employees' => $space->employeePositions()->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Get employees
     * Accessible to agencies and their employees
     */
    public function getEmployees(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'agency' && $user->user_type !== 'employee') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        // Get agency context - uses session for employees
        $agency = $this->getAgencyContext();

        if (!$agency) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $spaceIds = $agency->agencySpaces()->pluck('id');

        $employees = User::where('user_type', 'employee')
            ->whereIn('id', function ($q) use ($spaceIds) {
                $q->select('user_id')
                    ->from('employee_positions')
                    ->whereIn('space_id', $spaceIds);
            })
            ->with(['profile', 'employeePositions.space'])
            ->paginate($request->get('per_page', 15));

        $employees->getCollection()->transform(function ($employee) {
            $positions = $employee->employeePositions;
            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'email' => $employee->email,
                'phone' => $employee->phone,
                'role' => $positions->first()?->role ?? 'employee',
                'spaces' => $positions->map(function ($pos) {
                    return [
                        'id' => $pos->space_id,
                        'name' => $pos->space->name,
                        'position_id' => $pos->id,
                    ];
                })->toArray(),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $employees,
        ]);
    }

    /**
     * Get performance analytics filtered by period or date
     * Accessible to agencies and their employees
     */
    public function getPerformanceAnalytics(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'agency' && $user->user_type !== 'employee') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $period = $request->get('period', 'month');
        $selectedDate = $request->get('date', null);

        // Determine date range
        if ($period === 'day' && $selectedDate) {
            $dateFrom = Carbon::createFromFormat('Y-m-d', $selectedDate)->startOfDay();
            $dateTo = Carbon::createFromFormat('Y-m-d', $selectedDate)->endOfDay();
        } else {
            $dateFrom = match ($period) {
                'day' => now()->startOfDay(),
                'week' => now()->startOfWeek(),
                'month' => now()->startOfMonth(),
                'quarter' => now()->startOfQuarter(),
                'year' => now()->startOfYear(),
                default => now()->startOfMonth(),
            };
            $dateTo = now();
        }

        // Get agency and all its ads
        $agency = $user->user_type === 'agency' ? $user : User::whereHas('agencySpaces.employeePositions', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->first();

        if (!$agency) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agency not found'
            ], 403);
        }

        $ads = $agency->ads()->get();
        foreach ($agency->agencySpaces()->get() as $space) {
            $employeeAds = Ad::where('space_id', $space->id)->where('user_id', '!=', $agency->id)->get();
            $ads = $ads->concat($employeeAds);
        }

        $adIds = $ads->pluck('id')->toArray();
        $totalViews = View::whereIn('ad_id', $adIds)->whereBetween('created_at', [$dateFrom, $dateTo])->count();
        $totalContacts = Contact::whereIn('ad_id', $adIds)->whereBetween('created_at', [$dateFrom, $dateTo])->count();
        $totalRevenue = $ads->sum('revenue') ?? 0;
        $conversionRate = $totalViews > 0 ? (($totalContacts / $totalViews) * 100) : 0;

        // Top ads
        $topAds = $ads->sortByDesc('views_count')->take(10)->map(function ($ad) use ($dateFrom, $dateTo) {
            $contacts = Contact::where('ad_id', $ad->id)->whereBetween('created_at', [$dateFrom, $dateTo])->get();
            $contactsCount = $contacts->count();
            return [
                'id' => $ad->id,
                'title' => $ad->title,
                'views' => $ad->views_count,
                'clicks' => $contactsCount,
                'contacts' => $contactsCount,
                'ctr' => $ad->views_count > 0 ? round(($contactsCount / $ad->views_count) * 100, 2) : 0,
                'status' => $ad->status,
                'createdAt' => is_string($ad->created_at) ? $ad->created_at : $ad->created_at->format('Y-m-d'),
            ];
        })->values();

        // Category breakdown
        $categoryMetrics = $ads->groupBy('category')->map(function ($adsInCategory) use ($dateFrom, $dateTo) {
            $adIds = $adsInCategory->pluck('id');
            $totalClicks = Contact::whereIn('ad_id', $adIds)->whereBetween('created_at', [$dateFrom, $dateTo])->count();
            $totalImpressions = $adsInCategory->sum('views_count');

            return [
                'category' => $adsInCategory->first()->category ?? 'Général',
                'ads' => $adsInCategory->count(),
                'impressions' => $totalImpressions,
                'clicks' => $totalClicks,
                'pct' => $totalImpressions > 0 ? round(($totalClicks / $totalImpressions) * 100) : 0,
            ];
        })->values()->toArray();

        // Recent contacts
        $recentContacts = Contact::whereIn('ad_id', $adIds)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->with(['ad', 'user.profile'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($contact) {
                return [
                    'id' => $contact->id,
                    'ad_id' => $contact->ad_id,
                    'ad_title' => $contact->ad?->title ?? 'N/A',
                    'user_name' => $contact->user?->name ?? 'Visiteur anonyme',
                    'user_email' => $contact->user?->email ?? 'N/A',
                    'user_phone' => $contact->user?->phone ?? 'N/A',
                    'created_at' => is_string($contact->created_at) ? $contact->created_at : $contact->created_at->format('Y-m-d H:i'),
                ];
            });

        // Recent views
        $recentViews = View::whereIn('ad_id', $adIds)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->with(['ad', 'user.profile'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($view) {
                return [
                    'id' => $view->id,
                    'ad_id' => $view->ad_id,
                    'ad_title' => $view->ad?->title ?? 'N/A',
                    'user_name' => $view->user?->name ?? 'Visiteur anonyme',
                    'user_email' => $view->user?->email ?? 'N/A',
                    'created_at' => is_string($view->created_at) ? $view->created_at : $view->created_at->format('Y-m-d H:i'),
                ];
            });

        // Performance data for the period
        $performanceData = [];
        if ($period === 'day' && $selectedDate) {
            // For a single day, show hourly data
            try {
                $date = Carbon::createFromFormat('Y-m-d', $selectedDate);
            } catch (\Exception $e) {
                $date = now();
            }

            // Start from the beginning of the day
            $dayStart = $date->copy()->startOfDay();

            for ($hour = 0; $hour < 24; $hour++) {
                // Calculate hour boundaries by adding hours to day start
                $hourStart = $dayStart->copy()->addHours($hour);
                $hourEnd = $hourStart->copy()->addHour();

                $viewsCount = View::whereIn('ad_id', $adIds)
                    ->whereBetween('created_at', [$hourStart, $hourEnd])
                    ->count();

                $contactsCount = Contact::whereIn('ad_id', $adIds)
                    ->whereBetween('created_at', [$hourStart, $hourEnd])
                    ->count();

                $performanceData[] = [
                    'date' => $date->format('Y-m-d') . ' ' . str_pad($hour, 2, '0', STR_PAD_LEFT) . ':00',
                    'views' => $viewsCount,
                    'contacts' => $contactsCount,
                ];
            }
        } else {
            // For other periods, show daily data
            // Ensure we capture all days including the end day
            $current = $dateFrom->copy()->startOfDay();
            $endDate = $dateTo->copy()->startOfDay();

            while ($current <= $endDate) {
                $dayStart = $current->copy()->startOfDay();
                $dayEnd = $current->copy()->endOfDay();

                $viewsCount = View::whereIn('ad_id', $adIds)
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->count();

                $contactsCount = Contact::whereIn('ad_id', $adIds)
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->count();

                $performanceData[] = [
                    'date' => $current->format('Y-m-d'),
                    'views' => $viewsCount,
                    'contacts' => $contactsCount,
                ];

                $current->addDay();
            }
        }

        // Contacts by ad
        $contactsByAd = $ads->map(function ($ad) use ($dateFrom, $dateTo) {
            $contacts = Contact::where('ad_id', $ad->id)
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->with(['user.profile'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($contact) use ($ad) {
                    return [
                        'id' => $contact->id,
                        'ad_id' => $contact->ad_id,
                        'ad_title' => $ad->title,
                        'user_name' => $contact->user?->name ?? 'Visiteur',
                        'user_email' => $contact->user?->email ?? 'N/A',
                        'user_phone' => $contact->user?->phone ?? 'N/A',
                        'created_at' => is_string($contact->created_at) ? $contact->created_at : $contact->created_at->format('Y-m-d H:i:s'),
                    ];
                });
            return [
                'ad_id' => $ad->id,
                'ad_title' => $ad->title,
                'total_contacts' => $contacts->count(),
                'contacts' => $contacts,
            ];
        })->filter(function ($item) {
            return $item['total_contacts'] > 0;
        });

        $analyticsData = [
            'totalViews' => $totalViews,
            'totalClicks' => $totalContacts,
            'totalContacts' => $totalContacts,
            'conversionRate' => round($conversionRate, 2),
            'avgViewsPerAd' => $ads->count() > 0 ? round($totalViews / $ads->count()) : 0,
            'activeAds' => $ads->where('status', 'valid')->count(),
            'topAds' => $topAds,
            'categoryMetrics' => $categoryMetrics,
            'recentContacts' => $recentContacts,
            'recentViews' => $recentViews,
            'performanceData' => $performanceData,
            'contactsByAd' => $contactsByAd,
        ];

        return response()->json([
            'status' => 'success',
            'data' => $analyticsData,
        ]);
    }

    /**
     * Get subscription information
     * Accessible to agencies and their employees
     */
    public function getSubscription(): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'agency' && $user->user_type !== 'employee') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        // Get agency context - uses session for employees
        $agency = $this->getAgencyContext();

        if (!$agency) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $activeSubscription = $agency->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->with('pivot')
            ->first();

        if (!$activeSubscription) {
            return response()->json([
                'status' => 'success',
                'data' => null,
            ]);
        }

        $stats = [
            'subscription' => $activeSubscription,
            'ads_used' => $agency->ads()
                ->where('created_at', '>=', $activeSubscription->pivot->start_date)
                ->count(),
            'ads_remaining' => $activeSubscription->max_ads - ($agency->ads()
                ->where('created_at', '>=', $activeSubscription->pivot->start_date)
                ->count()),
            'days_remaining' => now()->diffInDays($activeSubscription->pivot->end_date),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Get recent activities
     * Accessible to agencies and their employees
     */
    public function getActivities(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'agency' && $user->user_type !== 'employee') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        // Get agency context - uses session for employees
        $agency = $this->getAgencyContext();

        if (!$agency) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $adIds = $agency->ads()->pluck('id');

        $activities = [
            'recent_ads' => Ad::whereIn('id', $adIds)
                ->latest()
                ->limit(5)
                ->get(['id', 'title', 'status', 'created_at']),
            'recent_contacts' => Contact::whereIn('ad_id', $adIds)
                ->with('user.profile')
                ->latest()
                ->limit(5)
                ->get(),
            'recent_favorites' => Favorite::whereIn('ad_id', $adIds)
                ->with('user.profile')
                ->latest()
                ->limit(5)
                ->get(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $activities,
        ]);
    }

    /**
     * Display space management page with spaces list
     * Accessible to agency and its employees
     */
    public function spaceManagement(): Response
    {
        $user = Auth::user();

        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return Inertia::render('Agency/SpaceManagement', [
                'user' => $user,
                'spaces' => [],
                'countries' => [],
                'cities' => [],
            ]);
        }

        // Get agency context - uses session for employees
        $agency = $this->getAgencyContext();

        if (!$agency) {
            return Inertia::render('Agency/SpaceManagement', [
                'user' => $user,
                'spaces' => [],
                'countries' => [],
                'cities' => [],
            ]);
        }

        $spaces = $agency->agencySpaces()
            ->with(['country', 'city', 'employeePositions.user.profile'])
            ->get()
            ->map(function ($space) {
                $employees = $space->employeePositions()
                    ->with('user.profile')
                    ->get()
                    ->map(function ($position) {
                        return [
                            'id' => $position->id,
                            'user_id' => $position->user_id,
                            'user_name' => $position->user->name,
                            'user_email' => $position->user->email,
                            'user_phone' => $position->user->phone,
                            'role' => $position->role,
                            'ads_created' => $position->user->ads()->count(),
                        ];
                    });

                return [
                    'id' => $space->id,
                    'name' => $space->name,
                    'description' => $space->description,
                    'merchant_code' => $space->merchant_code,
                    'email' => $space->email,
                    'phone' => $space->phone,
                    'address' => $space->address,
                    'country_id' => $space->country_id,
                    'city_id' => $space->city_id,
                    'country' => $space->country,
                    'city' => $space->city,
                    'status' => $space->status,
                    'employee_count' => $employees->count(),
                    'ad_count' => $space->ads()->count(),
                    'employees' => $employees,
                ];
            });

        $countries = Country::where('is_active', true)->orderBy('name')->get();
        $cities = City::where('is_active', true)->orderBy('name')->get();

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/SpaceManagement', [
            'user' => $user,
            'spaces' => $spaces,
            'countries' => $countries,
            'cities' => $cities,
            'agency' => [
                'id' => $agency->id,
                'name' => $agency->name,
            ],
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Display space detail page with employees
     * Accessible to agency and employees in that space
     */
    public function spaceDetail($spaceId): Response
    {
        $user = Auth::user();

        if (!$user) {
            return Inertia::render('Agency/SpaceDetails', [
                'user' => null,
                'space' => null,
                'employees' => [],
                'ads' => [],
            ]);
        }

        $space = AgencySpace::with(['country', 'city', 'employeePositions.user.profile', 'ads.country', 'ads.city'])
            ->find($spaceId);

        if (!$space) {
            return Inertia::render('Agency/SpaceDetails', [
                'user' => $user,
                'space' => null,
                'employees' => [],
                'ads' => [],
            ]);
        }

        // Check authorization: user must be agency owner or employee in this space
        if ($user->user_type === 'agency') {
            if ($space->agency_id !== $user->id) {
                return Inertia::render('Agency/SpaceDetails', [
                    'user' => $user,
                    'space' => null,
                    'employees' => [],
                    'ads' => [],
                ]);
            }
        } elseif ($user->user_type === 'employee') {
            $isInSpace = EmployeePosition::where('user_id', $user->id)
                ->where('space_id', $space->id)
                ->exists();

            if (!$isInSpace) {
                return Inertia::render('Agency/SpaceDetails', [
                    'user' => $user,
                    'space' => null,
                    'employees' => [],
                    'ads' => [],
                ]);
            }
        } else {
            return Inertia::render('Agency/SpaceDetails', [
                'user' => $user,
                'space' => null,
                'employees' => [],
                'ads' => [],
            ]);
        }

        $spaceData = [
            'id' => $space->id,
            'name' => $space->name,
            'description' => $space->description,
            'merchant_code' => $space->merchant_code,
            'email' => $space->email,
            'phone' => $space->phone,
            'address' => $space->address,
            'country_id' => $space->country_id,
            'city_id' => $space->city_id,
            'status' => $space->status,
            'country' => $space->country,
            'city' => $space->city,
            'created_at' => is_string($space->created_at) ? $space->created_at : $space->created_at->format('Y-m-d'),
            'updated_at' => is_string($space->updated_at) ? $space->updated_at : $space->updated_at->format('Y-m-d'),
        ];

        $employees = $space->employeePositions()
            ->with('user.profile')
            ->get()
            ->map(function ($position) {
                return [
                    'id' => $position->id,
                    'user_id' => $position->user_id,
                    'user_name' => $position->user->name,
                    'user_email' => $position->user->email,
                    'user_phone' => $position->user->phone,
                    'role' => $position->role,
                    'ads_created' => $position->user->ads()->count(),
                ];
            });

        $ads = $space->ads()
            ->with(['country', 'city'])
            ->get()
            ->map(function ($ad) {
                return [
                    'id' => $ad->id,
                    'title' => $ad->title,
                    'status' => $ad->status,
                    'views_count' => $ad->views_count,
                    'country' => $ad->country?->name,
                    'city' => $ad->city?->name,
                    'created_at' => is_string($ad->created_at) ? $ad->created_at : $ad->created_at->format('Y-m-d H:i:s'),
                ];
            });

        $countries = Country::where('is_active', true)->orderBy('name')->get();
        $cities = City::where('is_active', true)->orderBy('name')->get();

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/SpaceDetails', [
            'user' => $user,
            'space' => $spaceData,
            'employees' => $employees,
            'ads' => $ads,
            'countries' => $countries,
            'cities' => $cities,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Display ad creation form page
     * Accessible to agency and its employees
     * Shows only spaces the employee/agency has access to
     */
    public function adCreateForm(): Response
    {
        $user = Auth::user();

        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return Inertia::render('Agency/AdCreate', [
                'user' => $user,
                'spaces' => [],
                'countries' => [],
                'cities' => [],
            ]);
        }

        // Get accessible spaces based on user type
        if ($user->user_type === 'agency') {
            $spaces = $user->agencySpaces()
                ->with(['country', 'city'])
                ->get()
                ->map(function ($space) {
                    return [
                        'id' => $space->id,
                        'name' => $space->name,
                        'country_id' => $space->country_id,
                        'city_id' => $space->city_id,
                        'country' => $space->country?->name,
                        'city' => $space->city?->name,
                    ];
                });
        } else {
            // For employees, get only spaces they are assigned to
            $spaces = AgencySpace::whereIn('id', function ($q) use ($user) {
                $q->select('space_id')
                    ->from('employee_positions')
                    ->where('user_id', $user->id);
            })
                ->with(['country', 'city'])
                ->get()
                ->map(function ($space) {
                    return [
                        'id' => $space->id,
                        'name' => $space->name,
                        'country_id' => $space->country_id,
                        'city_id' => $space->city_id,
                        'country' => $space->country?->name,
                        'city' => $space->city?->name,
                    ];
                });
        }

        $countries = Country::where('is_active', true)->orderBy('name')->get();
        $cities = City::where('is_active', true)->orderBy('name')->get();
        $categories = Category::with('subcategories')->orderBy('name')->get();

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/AdCreate', [
            'user' => $user,
            'spaces' => $spaces,
            'countries' => $countries,
            'cities' => $cities,
            'categories' => $categories,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Display employee management page
     * Accessible to agency only
     * Shows all employees across all agency spaces
     */
    public function employeeManagement(): Response
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return Inertia::render('Agency/EmployeeManagement', [
                'user' => $user,
                'employees' => [],
                'spaces' => [],
            ]);
        }

        $spaceIds = $user->agencySpaces()->pluck('id');

        $employees = User::whereIn('id', function ($q) use ($spaceIds) {
            $q->select('user_id')
                ->from('employee_positions')
                ->whereIn('space_id', $spaceIds);
        })
            ->with(['profile', 'employeePositions'])
            ->get()
            ->map(function ($employee) {
                $positions = $employee->employeePositions()->with('space')->get();
                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'email' => $employee->email,
                    'phone' => $employee->phone,
                    'role' => $positions->first()?->role ?? 'employee',
                    'space_id' => $positions->first()?->space_id,
                    'spaces' => $positions->map(function ($pos) {
                        return [
                            'id' => $pos->space_id,
                            'name' => $pos->space->name,
                            'position_id' => $pos->id,
                        ];
                    })->toArray(),
                ];
            });

        $spaces = $user->agencySpaces()
            ->select(['id', 'name'])
            ->get();

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/EmployeeManagement', [
            'user' => $user,
            'employees' => $employees,
            'spaces' => $spaces,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Display agency profile
     * Accessible to agency only
     */
    public function profileUpdate(): Response
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return Inertia::render('Agency/Profile', [
                'user' => $user,
                'agency' => [],
                'spaces' => [],
                'activeSubscription' => null,
                'stats' => [],
                'city' => [],
                'country' => [],
            ]);
        }

        $profile = $user->profile;

        // Get agency data
        $agencyData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'logo' => $profile?->logo ?? $profile?->photo,
            'slogan' => $profile?->slogan,
            'description' => $profile?->description,
            'country_id' => $user->country_id,
            'city_id' => $user->city_id,
            'address' => $user->address,
            'merchant_code' => $user->merchant_code,
            'status' => $user->status,
        ];

        // Get spaces
        $spaces = $user->agencySpaces()
            ->with(['city', 'country'])
            ->get()
            ->map(function ($space) {
                return [
                    'id' => $space->id,
                    'name' => $space->name,
                    'email' => $space->email,
                    'phone' => $space->phone,
                    'address' => $space->address,
                    'city_name' => $space->city?->name,
                    'country_name' => $space->country?->name,
                ];
            });

        // Get active subscription
        $activeSubscription = UserSubscription::where('user_id', $user->id)
            ->where('status', true)
            ->where('end_date', '>', now())
            ->with('subscription')
            ->first();

        $subscriptionData = null;
        if ($activeSubscription) {
            $usedAds = Ad::where('user_id', $user->id)
                ->where('created_at', '>=', $activeSubscription->start_date)
                ->where('created_at', '<=', $activeSubscription->end_date)
                ->count();

            $subscriptionData = [
                'plan_name' => $activeSubscription->subscription?->label,
                'ads_limit' => $activeSubscription->subscription?->max_ads,
                'ads_remaining' => max(0, ($activeSubscription->subscription?->max_ads ?? 0) - $usedAds),
                'starts_at' => $activeSubscription->start_date,
                'ends_at' => $activeSubscription->end_date,
            ];
        }

        // Get statistics
        $spaceIds = $user->agencySpaces()->pluck('id');
        $ads = Ad::where('user_id', $user->id)->get();
        $adIds = $ads->pluck('id');

        $stats = [
            'total_ads' => $ads->count(),
            'total_views' => $ads->sum('views_count') ?? 0,
            'total_contacts' => Contact::whereIn('ad_id', $adIds)->count(),
            'total_employees' => EmployeePosition::whereIn('space_id', $spaceIds)->distinct('user_id')->count(),
        ];

        // Get country and city
        $country = $user->country;
        $city = $user->city;

        // Get all countries and cities for the edit form
        $allCountries = Country::where('is_active', true)->orderBy('name')->get();
        $allCities = City::where('is_active', true)->orderBy('name')->get();

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/Profile', [
            'user' => $user,
            'agency' => $agencyData,
            'spaces' => $spaces,
            'activeSubscription' => $subscriptionData,
            'stats' => $stats,
            'city' => $city,
            'country' => $country,
            'countries' => $allCountries,
            'cities' => $allCities,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Update agency profile (all information)
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return back()->withErrors(['auth' => 'Unauthorized']);
        }

        $validated = $request->validate([
            'agency_name' => 'required|string|max:255',
            'slogan' => 'required|string|max:100',
            'description' => 'required|string|max:2000',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'address' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'city_id' => 'required|exists:cities,id',
            'merchant_code' => 'required|string|max:255',
            'photo' => 'nullable|url',
        ]);

        try {
            // Update user data
            $user->update([
                'name' => $validated['agency_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'country_id' => $validated['country_id'],
                'city_id' => $validated['city_id'],
                'merchant_code' => $validated['merchant_code'],
            ]);

            // Update or create profile data
            $profile = $user->profile ?? new Profile();
            $profile->user_id = $user->id;
            $profile->slogan = $validated['slogan'];
            $profile->description = $validated['description'];
            if ($validated['photo']) {
                $profile->photo = $validated['photo'];
            }
            $profile->save();

            return redirect()->back()->with('success', 'Profil mis à jour avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['submit' => 'Erreur lors de la mise à jour: ' . $e->getMessage()]);
        }
    }

    /**
     * Display commercials/team page
     * Accessible to agency only
     * Shows all employees with their performance metrics
     */
    public function commercials(): Response
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return Inertia::render('Agency/Commercials', [
                'user' => $user,
                'commercials' => [],
            ]);
        }

        $spaceIds = $user->agencySpaces()->pluck('id');

        $commercials = User::whereIn('id', function ($q) use ($spaceIds) {
            $q->select('user_id')
                ->from('employee_positions')
                ->whereIn('space_id', $spaceIds);
        })
            ->with(['profile', 'employeePositions', 'ads'])
            ->get()
            ->map(function ($employee) {
                $ads = $employee->ads;
                $adIds = $ads->pluck('id');
                $totalViews = $ads->sum('views_count');
                $totalContacts = Contact::whereIn('ad_id', $adIds)->count();
                $totalRevenue = $ads->sum('revenue') ?? 0;

                return [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'email' => $employee->email,
                    'phone' => $employee->phone,
                    'role' => $employee->employeePositions->first()?->role ?? 'employee',
                    'adsCreated' => $ads->count(),
                    'totalViews' => $totalViews,
                    'totalClicks' => $totalContacts,
                    'revenue' => 'XFA ' . number_format($totalRevenue, 2, ',', ' '),
                    'joinedAt' => is_string($employee->created_at) ? $employee->created_at : $employee->created_at->format('Y-m-d'),
                    'status' => 'active',
                    'performance' => $this->getPerformanceRating($totalViews, $totalContacts),
                ];
            })->sortByDesc('totalViews')->values();

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/Commercials', [
            'user' => $user,
            'commercials' => $commercials,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Display analytics & statistics page
     * Accessible to agency and its employees
     * Shows comprehensive performance analytics and statistics
     * Supports filtering by period and specific date
     */
    public function analytics(Request $request): Response
    {
        $user = Auth::user();

        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return Inertia::render('Agency/Analytics', [
                'user' => $user,
                'analytics' => [],
            ]);
        }

        // Get agency context - uses session for employees
        $agency = $this->getAgencyContext();

        if (!$agency) {
            return Inertia::render('Agency/Analytics', [
                'user' => $user,
                'analytics' => [],
            ]);
        }

        // Get period and optional date from request
        $period = $request->get('period', 'month');
        $selectedDate = $request->get('date', null);

        // Determine date range based on period
        if ($period === 'day' && !empty($selectedDate)) {
            $dateFrom = Carbon::createFromFormat('Y-m-d', $selectedDate)->startOfDay();
            $dateTo = Carbon::createFromFormat('Y-m-d', $selectedDate)->endOfDay();
        } else {
            $dateFrom = match ($period) {
                'day' => now()->startOfDay(),
                'week' => now()->startOfWeek(),
                'month' => now()->startOfMonth(),
                'quarter' => now()->startOfQuarter(),
                'year' => now()->startOfYear(),
                default => now()->startOfMonth(),
            };
            $dateTo = now();
        }

        // Get all ads for the agency
        $ads = $agency->ads()->get();

        // Also include employee ads from agency spaces
        foreach ($agency->agencySpaces()->get() as $space) {
            $employeeAds = Ad::where('space_id', $space->id)
                ->where('user_id', '!=', $agency->id)
                ->get();
            $ads = $ads->concat($employeeAds);
        }

        $adIds = $ads->pluck('id')->toArray();

        // Calculate metrics for the selected period
        $totalViews = View::whereIn('ad_id', $adIds)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();
        $totalContacts = Contact::whereIn('ad_id', $adIds)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->count();
        $totalRevenue = $ads->sum('revenue') ?? 0;
        $conversionRate = $totalViews > 0 ? (($totalContacts / $totalViews) * 100) : 0;

        // Top ads with detailed metrics
        $topAds = $ads->sortByDesc('views_count')
            ->take(10)
            ->map(function ($ad) use ($dateFrom, $dateTo) {
                $contacts = Contact::where('ad_id', $ad->id)
                    ->whereBetween('created_at', [$dateFrom, $dateTo])
                    ->get();
                $contactsCount = $contacts->count();
                return [
                    'id' => $ad->id,
                    'title' => $ad->title,
                    'views' => $ad->views_count,
                    'clicks' => $contactsCount,
                    'contacts' => $contactsCount,
                    'ctr' => $ad->views_count > 0 ? round(($contactsCount / $ad->views_count) * 100, 2) : 0,
                    'status' => $ad->status,
                    'createdAt' => is_string($ad->created_at) ? $ad->created_at : $ad->created_at->format('Y-m-d'),
                ];
            })->values();

        // Category breakdown
        $categoryMetrics = $ads->groupBy('category')->map(function ($adsInCategory) use ($dateFrom, $dateTo) {
            $catAdIds = $adsInCategory->pluck('id')->toArray();
            $totalClicks = Contact::whereIn('ad_id', $catAdIds)
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count();
            $totalImpressions = $adsInCategory->sum('views_count');

            return [
                'category' => $adsInCategory->first()->category ?? 'Général',
                'ads' => $adsInCategory->count(),
                'impressions' => $totalImpressions,
                'clicks' => $totalClicks,
                'pct' => $totalImpressions > 0 ? round(($totalClicks / $totalImpressions) * 100) : 0,
            ];
        })->values()->toArray();

        // Get recent contacts with full details
        $recentContacts = Contact::whereIn('ad_id', $adIds)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->with(['ad', 'user.profile'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($contact) {
                return [
                    'id' => $contact->id,
                    'ad_id' => $contact->ad_id,
                    'ad_title' => $contact->ad?->title ?? 'N/A',
                    'user_name' => $contact->user?->name ?? 'Visiteur anonyme',
                    'user_email' => $contact->user?->email ?? 'N/A',
                    'user_phone' => $contact->user?->phone ?? 'N/A',
                    'created_at' => is_string($contact->created_at) ? $contact->created_at : $contact->created_at->format('Y-m-d H:i'),
                ];
            });

        // Get recent views with full details
        $recentViews = View::whereIn('ad_id', $adIds)
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->with(['ad', 'user.profile'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($view) {
                return [
                    'id' => $view->id,
                    'ad_id' => $view->ad_id,
                    'ad_title' => $view->ad?->title ?? 'N/A',
                    'user_name' => $view->user?->name ?? 'Visiteur anonyme',
                    'user_email' => $view->user?->email ?? 'N/A',
                    'created_at' => is_string($view->created_at) ? $view->created_at : $view->created_at->format('Y-m-d H:i'),
                ];
            });

        // Performance over time for the selected period
        $performanceData = [];
        if ($period === 'day' && !empty($selectedDate)) {
            // For a single day, show hourly data
            try {
                $date = Carbon::createFromFormat('Y-m-d', $selectedDate);
            } catch (\Exception $e) {
                $date = now();
            }

            // Start from the beginning of the day
            $dayStart = $date->copy()->startOfDay();

            for ($hour = 0; $hour < 24; $hour++) {
                // Calculate hour boundaries by adding hours to day start
                $hourStart = $dayStart->copy()->addHours($hour);
                $hourEnd = $hourStart->copy()->addHour();

                $viewsCount = View::whereIn('ad_id', $adIds)
                    ->whereBetween('created_at', [$hourStart, $hourEnd])
                    ->count();

                $contactsCount = Contact::whereIn('ad_id', $adIds)
                    ->whereBetween('created_at', [$hourStart, $hourEnd])
                    ->count();

                $performanceData[] = [
                    'date' => $date->format('Y-m-d') . ' ' . str_pad($hour, 2, '0', STR_PAD_LEFT) . ':00',
                    'views' => $viewsCount,
                    'contacts' => $contactsCount,
                ];
            }
        } else {
            // For other periods, show daily data
            // Ensure we capture all days including the end day
            $current = $dateFrom->copy()->startOfDay();
            $endDate = $dateTo->copy()->startOfDay();

            while ($current <= $endDate) {
                $dayStart = $current->copy()->startOfDay();
                $dayEnd = $current->copy()->endOfDay();

                $viewsCount = View::whereIn('ad_id', $adIds)
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->count();

                $contactsCount = Contact::whereIn('ad_id', $adIds)
                    ->whereBetween('created_at', [$dayStart, $dayEnd])
                    ->count();

                $performanceData[] = [
                    'date' => $current->format('Y-m-d'),
                    'views' => $viewsCount,
                    'contacts' => $contactsCount,
                ];

                $current->addDay();
            }
        }

        // Contacts by ad
        $contactsByAd = $ads->map(function ($ad) use ($dateFrom, $dateTo) {
            $contacts = Contact::where('ad_id', $ad->id)
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->with(['user.profile'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($contact) use ($ad) {
                    return [
                        'id' => $contact->id,
                        'ad_id' => $contact->ad_id,
                        'ad_title' => $ad->title,
                        'user_name' => $contact->user?->name ?? 'Visiteur',
                        'user_email' => $contact->user?->email ?? 'N/A',
                        'user_phone' => $contact->user?->phone ?? 'N/A',
                        'created_at' => is_string($contact->created_at) ? $contact->created_at : $contact->created_at->format('Y-m-d H:i:s'),
                    ];
                });
            return [
                'ad_id' => $ad->id,
                'ad_title' => $ad->title,
                'total_contacts' => $contacts->count(),
                'contacts' => $contacts,
            ];
        })->filter(function ($item) {
            return $item['total_contacts'] > 0;
        });

        $analyticsData = [
            'totalViews' => $totalViews,
            'totalClicks' => $totalContacts,
            'totalContacts' => $totalContacts,
            'conversionRate' => round($conversionRate, 2),
            'avgViewsPerAd' => $ads->count() > 0 ? round($totalViews / $ads->count()) : 0,
            'activeAds' => $ads->where('status', 'valid')->count(),
            'topAds' => $topAds,
            'categoryMetrics' => $categoryMetrics,
            'recentContacts' => $recentContacts,
            'recentViews' => $recentViews,
            'performanceData' => $performanceData,
            'contactsByAd' => $contactsByAd,
        ];

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/Analytics', [
            'user' => $user,
            'analytics' => $analyticsData,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Display ad edit page
     * Accessible to agency and employees who created the ad or belong to its space
     */
    public function adEdit($adId): Response
    {
        $user = Auth::user();

        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return Inertia::render('Agency/AdEdit', [
                'user' => $user,
                'ad' => null,
                'features' => [],
                'spaces' => [],
                'countries' => [],
                'cities' => [],
                'categories' => [],
            ]);
        }

        $ad = Ad::with(['space'])->find($adId);

        if (!$ad) {
            return Inertia::render('Agency/AdEdit', [
                'user' => $user,
                'ad' => null,
                'features' => [],
                'spaces' => [],
                'countries' => [],
                'cities' => [],
                'categories' => [],
            ]);
        }

        // Check authorization
        if ($user->user_type === 'agency') {
            if ($ad->user_id !== $user->id) {
                return Inertia::render('Agency/AdEdit', [
                    'user' => $user,
                    'ad' => null,
                    'features' => [],
                    'spaces' => [],
                    'countries' => [],
                    'cities' => [],
                    'categories' => [],
                ]);
            }
        } elseif ($user->user_type === 'employee') {
            $hasAccess = EmployeePosition::where('user_id', $user->id)
                ->where('space_id', $ad->space_id)
                ->exists();

            if (!$hasAccess && $ad->user_id !== $user->id) {
                return Inertia::render('Agency/AdEdit', [
                    'user' => $user,
                    'ad' => null,
                    'features' => [],
                    'spaces' => [],
                    'countries' => [],
                    'cities' => [],
                    'categories' => [],
                ]);
            }
        }

        // Get accessible spaces
        if ($user->user_type === 'agency') {
            $spaces = $user->agencySpaces()->select(['id', 'name'])->get();
        } else {
            $spaces = AgencySpace::whereIn('id', function ($q) use ($user) {
                $q->select('space_id')
                    ->from('employee_positions')
                    ->where('user_id', $user->id);
            })->select(['id', 'name'])->get();
        }

        $allFeatures = $ad->features()->get();

        $adData = [
            'id' => $ad->id,
            'title' => $ad->title,
            'category_id' => $ad->category_id,
            'subcategory_id' => $ad->subcategory_id,
            'space_id' => $ad->space_id,
            'country_id' => $ad->country_id,
            'city_id' => $ad->city_id,
            'address' => $ad->address,
            'description' => $ad->description,
            'price' => $ad->price,
            'price_description' => $ad->price_description ?? 'fixe',
            'main_photo' => $ad->main_photo,
            'contact_phone' => $ad->contact_phone,
            'contact_email' => $ad->contact_email,
        ];

        $features = $allFeatures->map(function ($feature) {
            return [
                'id' => $feature->id,
                'label' => $feature->label,
                'photo' => $feature->photo,
            ];
        });

        $countries = Country::where('is_active', true)->orderBy('name')->get();
        $cities = City::where('is_active', true)->orderBy('name')->get();
        $categories = Category::with('subcategories')->orderBy('name')->get();

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/AdEdit', [
            'user' => $user,
            'ad' => $adData,
            'features' => $features,
            'spaces' => $spaces,
            'countries' => $countries,
            'cities' => $cities,
            'categories' => $categories,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Display ad details page
     * Accessible to agency and employees
     */
    public function adDetails($adId): Response
    {
        $user = Auth::user();

        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return Inertia::render('Agency/AdDetails', [
                'user' => $user,
                'ad' => null,
                'features' => [],
            ]);
        }

        $ad = Ad::with(['space', 'category', 'subcategory'])->find($adId);

        if (!$ad) {
            return Inertia::render('Agency/AdDetails', [
                'user' => $user,
                'ad' => null,
                'features' => [],
            ]);
        }

        // Check authorization
        if ($user->user_type === 'agency') {
            if ($ad->user_id !== $user->id) {
                return Inertia::render('Agency/AdDetails', [
                    'user' => $user,
                    'ad' => null,
                    'features' => [],
                ]);
            }
        } elseif ($user->user_type === 'employee') {
            $hasAccess = EmployeePosition::where('user_id', $user->id)
                ->where('space_id', $ad->space_id)
                ->exists();

            if (!$hasAccess && $ad->user_id !== $user->id) {
                return Inertia::render('Agency/AdDetails', [
                    'user' => $user,
                    'ad' => null,
                    'features' => [],
                ]);
            }
        }

        $country = Country::find($ad->country_id);
        $city = City::find($ad->city_id);
        $totalContacts = Contact::where('ad_id', $ad->id)->count();
        $allFeatures = $ad->features()->get();
        $photosCount = $allFeatures->count() + 1; // +1 for main photo
        $activeBoost = $ad->boosts()->where('end_date', '>', now())->first();

        $adData = [
            'id' => $ad->id,
            'title' => $ad->title,
            'category' => $ad->category?->name,
            'subcategory' => $ad->subcategory?->name,
            'status' => $ad->status === 'valid' ? 'active' : 'archived',
            'created_at' => is_string($ad->created_at) ? $ad->created_at : $ad->created_at->format('Y-m-d'),
            'updated_at' => is_string($ad->updated_at) ? $ad->updated_at : $ad->updated_at->format('Y-m-d'),
            'published_at' => is_string($ad->created_at) ? $ad->created_at : $ad->created_at->format('Y-m-d'),
            'expiry_date' => is_string($ad->created_at)
                ? date('Y-m-d', strtotime($ad->created_at . ' + 90 days'))
                : $ad->created_at->addDays(90)->format('Y-m-d'),
            'space' => ['id' => $ad->space->id, 'name' => $ad->space->name],
            'country' => $country?->name,
            'city' => $city?->name,
            'address' => $ad->address,
            'description' => $ad->description,
            'price' => $ad->price,
            'price_description' => $ad->price_description ?? 'fixe',
            'contact_phone' => $ad->contact_phone ?? $user->phone ?? '',
            'contact_email' => $ad->contact_email ?? $user->email,
            'main_photo' => $ad->main_photo,
            'photos_count' => $photosCount,
            'views' => $ad->views_count,
            'clicks' => $totalContacts,
            'contacts' => $totalContacts,
            'conversion_rate' => $ad->views_count > 0 ? round(($totalContacts / $ad->views_count) * 100, 2) : 0,
            'featured' => false,
            'boosted' => $activeBoost !== null,
            'boost_until' => $activeBoost ? (is_string($activeBoost->end_date) ? $activeBoost->end_date : $activeBoost->end_date->format('Y-m-d')) : null,
        ];

        $features = $allFeatures->map(function ($feature) {
            return [
                'id' => $feature->id,
                'label' => $feature->label,
                'photo' => $feature->photo,
            ];
        });

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/AdDetails', [
            'user' => $user,
            'ad' => $adData,
            'features' => $features,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Update an ad
     * Accessible to agency and employees who created the ad or belong to its space
     */
    public function updateAd(Request $request, $adId)
    {
        $user = Auth::user();

        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $ad = Ad::find($adId);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        // Check authorization
        if ($user->user_type === 'agency') {
            if ($ad->user_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }
        } elseif ($user->user_type === 'employee') {
            $hasAccess = EmployeePosition::where('user_id', $user->id)
                ->where('space_id', $ad->space_id)
                ->exists();

            if (!$hasAccess && $ad->user_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }
        }

        $request->validate([
            'title' => 'required|string|min:10|max:100',
            'category' => 'required|string',
            'subcategory' => 'required|string',
            'space_id' => 'required|exists:agency_spaces,id',
            'country_id' => 'required|exists:countries,id',
            'city_id' => 'required|exists:cities,id',
            'address' => 'required|string',
            'description' => 'required|string|min:20|max:2000',
            'price' => 'nullable|numeric|min:0',
            'price_description' => 'required|in:fixe,negociable,sur-demande,gratuit',
            'main_photo' => 'required|url',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'required|email',
            'features' => 'nullable|array',
            'features.*.label' => 'required_with:features|string',
            'features.*.photo' => 'required_with:features|url',
        ]);

        $ad->update([
            'title' => $request->title,
            'category' => $request->category,
            'subcategory' => $request->subcategory,
            'space_id' => $request->space_id,
            'country_id' => $request->country_id,
            'city_id' => $request->city_id,
            'address' => $request->address,
            'description' => $request->description,
            'price' => $request->price ?? 0,
            'price_description' => $request->price_description,
            'main_photo' => $request->main_photo,
            'contact_phone' => $request->contact_phone,
            'contact_email' => $request->contact_email,
        ]);

        $existingFeatures = $ad->features()->get();
        $newFeatures = $request->features ?? [];

        $existingFeatureIds = $existingFeatures->pluck('id')->toArray();
        $newFeatureIds = [];

        foreach ($newFeatures as $feature) {
            if (isset($feature['id'])) {
                $existingFeature = $existingFeatures->firstWhere('id', $feature['id']);
                if ($existingFeature) {
                    $existingFeature->update([
                        'label' => $feature['label'],
                        'photo' => $feature['photo'],
                    ]);
                    $newFeatureIds[] = $feature['id'];
                }
            } else {
                $newFeature = AdFeature::create([
                    'ad_id' => $ad->id,
                    'label' => $feature['label'],
                    'photo' => $feature['photo'],
                ]);
                $newFeatureIds[] = $newFeature->id;
            }
        }

        $featuresToDelete = array_diff($existingFeatureIds, $newFeatureIds);
        AdFeature::whereIn('id', $featuresToDelete)->delete();

        return redirect()->route('agency.ad-details', $ad->id)
            ->with('message', 'Annonce mise à jour avec succès');
    }

    /**
     * Delete an ad
     * Accessible to agency and employees who created the ad or belong to its space
     */
    public function deleteAd($adId)
    {
        $user = Auth::user();

        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $ad = Ad::find($adId);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        // Check authorization
        if ($user->user_type === 'agency') {
            if ($ad->user_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }
        } elseif ($user->user_type === 'employee') {
            $hasAccess = EmployeePosition::where('user_id', $user->id)
                ->where('space_id', $ad->space_id)
                ->exists();

            if (!$hasAccess && $ad->user_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }
        }

        $ad->features()->delete();
        $ad->delete();

        return redirect()->route('agency.ads')
            ->with('message', 'Annonce supprimée avec succès');
    }

    /**
     * Display boost ad page
     * Accessible to agency and employees
     */
    public function boostAd($adId): Response
    {
        $user = Auth::user();

        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return Inertia::render('Agency/BoostAd', [
                'user' => $user,
                'ad' => null,
                'packages' => [],
            ]);
        }

        $ad = Ad::with(['space'])->find($adId);

        if (!$ad) {
            return Inertia::render('Agency/BoostAd', [
                'user' => $user,
                'ad' => null,
                'packages' => [],
            ]);
        }

        // Check authorization
        if ($user->user_type === 'agency') {
            if ($ad->user_id !== $user->id) {
                return Inertia::render('Agency/BoostAd', [
                    'user' => $user,
                    'ad' => null,
                    'packages' => [],
                ]);
            }
        } elseif ($user->user_type === 'employee') {
            $hasAccess = EmployeePosition::where('user_id', $user->id)
                ->where('space_id', $ad->space_id)
                ->exists();

            if (!$hasAccess && $ad->user_id !== $user->id) {
                return Inertia::render('Agency/BoostAd', [
                    'user' => $user,
                    'ad' => null,
                    'packages' => [],
                ]);
            }
        }

        $country = Country::find($ad->country_id);
        $city = City::find($ad->city_id);

        $adData = [
            'id' => $ad->id,
            'title' => $ad->title,
            'location' => ($city?->name ? $city->name . ', ' : '') . ($country?->name ?? ''),
            'views' => $ad->views_count,
            'clicks' => Contact::where('ad_id', $ad->id)->count(),
        ];

        $boosts = Boost::all();
        $packages = $boosts->map(function ($boost) {
            $estimatedViews = $boost->duration_days * 24;
            $estimatedClicks = max(1, (int)($estimatedViews * 0.1));
            return [
                'id' => $boost->id,
                'name' => $boost->label,
                'duration' => $boost->duration_days,
                'price' => $boost->amount,
                'benefits' => [
                    ['label' => 'Durée', 'value' => $boost->duration_days . ' jours'],
                    ['label' => 'Position', 'value' => 'Premium'],
                    ['label' => 'Impressions estimées', 'value' => '+' . $estimatedViews . ' vues', 'highlight' => true],
                    ['label' => 'Clics estimés', 'value' => '+' . $estimatedClicks],
                ],
            ];
        })->values()->toArray();

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/BoostAd', [
            'user' => $user,
            'ad' => $adData,
            'packages' => $packages,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Display subscriptions page
     * Accessible to agencies only
     */
    public function subscriptions(): Response
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return Inertia::render('Agency/Subscriptions', [
                'user' => $user,
                'currentSubscription' => null,
                'plans' => [],
                'billingHistory' => [],
            ]);
        }

        $activeSubscription = $user->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->first();

        $currentSubscriptionData = null;
        if ($activeSubscription) {
            $currentSubscriptionData = [
                'plan' => $activeSubscription->label,
                'price' => $activeSubscription->amount,
                'billingCycle' => 'monthly',
                'startDate' => is_string($activeSubscription->pivot->start_date) ? $activeSubscription->pivot->start_date : $activeSubscription->pivot->start_date->format('Y-m-d'),
                'nextBillingDate' => is_string($activeSubscription->pivot->end_date) ? $activeSubscription->pivot->end_date : $activeSubscription->pivot->end_date->format('Y-m-d'),
                'status' => 'active',
                'autoRenew' => true,
            ];
        }

        $allPlans = Subscription::where('is_active', true)->get();
        $plans = $allPlans->map(function ($plan) use ($activeSubscription) {
            return [
                'id' => $plan->id,
                'name' => $plan->label,
                'price' => $plan->amount,
                'priceAnnual' => $plan->amount * 12,
                'description' => $plan->description ?? 'Plan professionnel',
                'amount' => $plan->amount,
                'max_ads' => $plan->max_ads,
                'duration_days' => $plan->duration_days,
                'features' => [
                    $plan->max_ads ? 'Jusqu\'à ' . $plan->max_ads . ' annonces' : 'Annonces illimitées',
                    'Durée: ' . $plan->duration_days . ' jours',
                    'Montant: ' . $plan->amount . 'xfa',
                ],
                'current' => $activeSubscription && $activeSubscription->id === $plan->id,
            ];
        })->toArray();

        $transactions = Transaction::where('sender_id', $user->id)
            ->orderBy('date', 'desc')
            ->limit(15)
            ->get();

        $billingHistory = $transactions->map(function ($transaction) {
            $transactionLabel = $transaction->transaction_type === 'boost' ? 'Boost' : 'Abonnement';
            return [
                'id' => $transaction->id,
                'date' => is_string($transaction->date) ? $transaction->date : $transaction->date->format('Y-m-d'),
                'plan' => $transactionLabel,
                'type' => $transaction->transaction_type,
                'amount' => $transaction->amount,
                'status' => ucfirst($transaction->status),
                'invoice' => '#INV-' . str_pad($transaction->id, 5, '0', STR_PAD_LEFT),
            ];
        })->toArray();

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/Subscriptions', [
            'user' => $user,
            'currentSubscription' => $currentSubscriptionData,
            'plans' => $plans,
            'billingHistory' => $billingHistory,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Display subscription payment page
     * Accessible to agencies only
     * Shows selected plan from query parameter or current active subscription
     */
    public function subscriptionPayment(Request $request): Response
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return Inertia::render('Agency/SubscriptionPayment', [
                'user' => $user,
                'subscription' => null,
                'plan' => null,
                'selectedPlan' => null,
                'allPlans' => [],
                'billingHistory' => [],
            ]);
        }

        // Check if a specific plan is being renewed
        $planId = $request->query('plan');

        $selectedPlanData = null;
        if ($planId) {
            $selectedPlan = Subscription::find($planId);
            if ($selectedPlan && $selectedPlan->is_active) {
                $selectedPlanData = [
                    'id' => $selectedPlan->id,
                    'label' => $selectedPlan->label,
                    'amount' => $selectedPlan->amount,
                    'max_ads' => $selectedPlan->max_ads,
                    'duration_days' => $selectedPlan->duration_days ?? 30,
                    'features' => [
                        $selectedPlan->max_ads ? 'Jusqu\'à ' . $selectedPlan->max_ads . ' annonces' : 'Annonces illimitées',
                        'Durée: ' . $selectedPlan->duration_days . ' jours',
                        'Montant: ' . $selectedPlan->amount . 'xfa',
                    ],
                ];
            }
        }

        // Get current active subscription
        $activeSubscription = $user->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->first();

        $subscriptionData = null;
        if ($activeSubscription) {
            $subscriptionData = [
                'id' => $activeSubscription->id,
                'label' => $activeSubscription->label,
                'amount' => $activeSubscription->amount,
                'max_ads' => $activeSubscription->max_ads,
                'duration_days' => $activeSubscription->duration_days ?? 30,
                'features' => [
                    $activeSubscription->max_ads ? 'Jusqu\'à ' . $activeSubscription->max_ads . ' annonces' : 'Annonces illimitées',
                    'Durée: ' . $activeSubscription->duration_days . ' jours',
                    'Montant: ' . $activeSubscription->amount . 'xfa',
                ],
            ];
        }

        // Get all available plans
        $allPlans = Subscription::where('is_active', true)->get()->map(function ($plan) {
            return [
                'id' => $plan->id,
                'label' => $plan->label,
                'amount' => $plan->amount,
                'max_ads' => $plan->max_ads,
                'duration_days' => $plan->duration_days ?? 30,
                'features' => [
                    $plan->max_ads ? 'Jusqu\'à ' . $plan->max_ads . ' annonces' : 'Annonces illimitées',
                    'Durée: ' . $plan->duration_days . ' jours',
                    'Montant: ' . $plan->amount . 'xfa',
                ],
            ];
        });

        $transactions = Transaction::where('sender_id', $user->id)
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();

        $billingHistory = $transactions->map(function ($transaction) {
            $transactionLabel = $transaction->transaction_type === 'boost' ? 'Boost' : 'Abonnement';
            return [
                'id' => $transaction->id,
                'date' => is_string($transaction->date) ? $transaction->date : $transaction->date->format('Y-m-d'),
                'plan' => $transactionLabel,
                'type' => $transaction->transaction_type,
                'amount' => $transaction->amount,
                'status' => ucfirst($transaction->status),
                'invoice' => '#INV-' . str_pad($transaction->id, 5, '0', STR_PAD_LEFT),
            ];
        })->toArray();

        $agencyContextData = $this->getSelectedAgencyData();

        return Inertia::render('Agency/SubscriptionPayment', [
            'user' => $user,
            'subscription' => $subscriptionData,
            'plan' => $subscriptionData,
            'selectedPlan' => $selectedPlanData ?? $subscriptionData,
            'allPlans' => $allPlans,
            'billingHistory' => $billingHistory,
            'selectedAgency' => $agencyContextData['selectedAgency'],
            'availableAgencies' => $agencyContextData['availableAgencies'],
        ]);
    }

    /**
     * Purchase/activate a boost for an ad
     * Native Inertia POST handler
     */
    public function purchaseBoost(Request $request, $adId)
    {
        $user = Auth::user();

        // Authorization check
        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return redirect()->route('agency.ads')
                ->withErrors(['auth' => 'Unauthorized']);
        }

        // Find the ad
        $ad = Ad::with(['space'])->find($adId);

        if (!$ad) {
            return redirect()->route('agency.ads')
                ->withErrors(['ad' => 'Ad not found']);
        }

        // Check access rights
        if ($user->user_type === 'agency') {
            if ($ad->user_id !== $user->id) {
                return redirect()->route('agency.ads')
                    ->withErrors(['auth' => 'Unauthorized']);
            }
        } elseif ($user->user_type === 'employee') {
            $hasAccess = EmployeePosition::where('user_id', $user->id)
                ->where('space_id', $ad->space_id)
                ->exists();

            if (!$hasAccess && $ad->user_id !== $user->id) {
                return redirect()->route('agency.ads')
                    ->withErrors(['auth' => 'Unauthorized']);
            }
        }

        // Validate request
        $validated = $request->validate([
            'boost_id' => 'required|exists:boosts,id',
            'payment_method' => 'required|string',
        ]);

        // Find boost package
        $boost = Boost::find($validated['boost_id']);
        if (!$boost) {
            return back()->withErrors(['boost' => 'Boost package not found']);
        }

        try {
            // Create the ad boost record
            $startDate = now()->startOfDay();
            $endDate = $startDate->copy()->addDays($boost->duration_days);

            $adBoost = AdBoost::create([
                'ad_id' => $ad->id,
                'boost_id' => $boost->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'active' => true,
            ]);

            // Create transaction record
            Transaction::create([
                'sender_id' => $user->id,
                'amount' => $boost->amount,
                'mode' => 'simulated',
                'transaction_type' => 'boost',
                'status' => 'success',
                'date' => now(),
            ]);

            // Redirect back to ad details with success
            return redirect()->route('agency.ad-details', $ad->id)
                ->with('success', 'Boost activé avec succès!');

        } catch (\Exception $e) {
            return back()->withErrors(['payment' => 'Erreur lors du traitement du paiement: ' . $e->getMessage()]);
        }
    }

    /**
     * Renew/purchase a subscription
     * Native Inertia POST handler
     */
    public function renewSubscription(Request $request)
    {
        $user = Auth::user();

        // Authorization check
        if (!$user || $user->user_type !== 'agency') {
            return redirect()->route('agency.subscriptions')
                ->withErrors(['auth' => 'Unauthorized']);
        }

        // Validate request
        $validated = $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'payment_method' => 'required|string',
        ]);

        // Find subscription plan
        $subscription = Subscription::find($validated['subscription_id']);
        if (!$subscription) {
            return back()->withErrors(['subscription' => 'Subscription plan not found']);
        }

        try {
            // Get current active subscription to determine start date
            $currentSubscription = $user->subscriptions()
                ->wherePivot('status', true)
                ->where('user_subscriptions.end_date', '>', now())
                ->first();

            // Determine start date: use end_date of current subscription if valid, otherwise use today
            $startDate = $currentSubscription
                ? Carbon::parse($currentSubscription->pivot->end_date)->startOfDay()
                : now()->startOfDay();

            $endDate = $startDate->copy()->addDays($subscription->duration_days ?? 30);

            // Create/update subscription via pivot table
            $user->subscriptions()->attach($subscription->id, [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => true,
            ]);

            // Create transaction record
            Transaction::create([
                'sender_id' => $user->id,
                'amount' => $subscription->amount,
                'mode' => 'simulated',
                'transaction_type' => 'subscription',
                'status' => 'success',
                'date' => now(),
            ]);

            // Redirect to subscriptions page with success
            return redirect()->route('agency.subscriptions')
                ->with('success', 'Abonnement activé avec succès!');

        } catch (\Exception $e) {
            return back()->withErrors(['payment' => 'Erreur lors du traitement de l\'abonnement: ' . $e->getMessage()]);
        }
    }

    /**
     * Store a newly created ad via Inertia form
     * Accessible to agency and its employees
     */
    public function storeAd(Request $request)
    {
        $user = Auth::user();

        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return redirect()->route('agency.ad-create')
                ->withErrors(['auth' => 'Unauthorized']);
        }

        if ($user->user_type === 'agency') {
            $quotaService = new QuotaService();
            $activeSubscription = $quotaService->getActiveSubscription($user);

            if (!$activeSubscription) {
                return redirect()->route('agency.ad-create')
                    ->withErrors(['subscription' => 'Vous devez avoir un abonnement actif pour créer une annonce']);
            }

            if (!$quotaService->canCreateAd($user)) {
                return redirect()->route('agency.ad-create')
                    ->withErrors(['subscription' => 'Vous avez atteint le nombre maximal d\'annonces pour votre abonnement']);
            }
        }

        $validated = $request->validate([
            'title' => 'required|string|min:10|max:255',
            'description' => 'required|string|min:20',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'price' => 'nullable|integer|min:0',
            'price_description' => 'nullable|string|max:100',
            'country_id' => 'required|exists:countries,id',
            'city_id' => 'required|exists:cities,id',
            'address' => 'nullable|string|max:255',
            'main_photo' => 'required|url',
            'additional_photos' => 'nullable|array|max:5',
            'additional_photos.*' => 'url',
            'space_id' => 'nullable|exists:agency_spaces,id',
            'contact_phone' => 'nullable|string|max:20',
            'contact_email' => 'required|email',
        ], [
            'title.min' => 'Le titre doit contenir au moins 10 caractères',
            'description.min' => 'La description doit contenir au moins 20 caractères',
            'main_photo.required' => 'La photo principale est requise',
            'main_photo.url' => 'L\'URL de la photo principale n\'est pas valide',
            'additional_photos.*.url' => 'Une des URLs de photos supplémentaires n\'est pas valide',
        ]);

        // Check authorization for space
        if (!empty($validated['space_id'])) {
            $space = AgencySpace::find($validated['space_id']);
            if (!$space) {
                return redirect()->route('agency.ad-create')
                    ->withErrors(['space_id' => 'Espace non trouvé']);
            }

            if ($user->user_type === 'agency') {
                if ($space->agency_id !== $user->id) {
                    return redirect()->route('agency.ad-create')
                        ->withErrors(['space_id' => 'Non autorisé à utiliser cet espace']);
                }
            } else {
                // For employees, check if they're assigned to this space
                $hasAccess = EmployeePosition::where('user_id', $user->id)
                    ->where('space_id', $validated['space_id'])
                    ->exists();

                if (!$hasAccess) {
                    return redirect()->route('agency.ad-create')
                        ->withErrors(['space_id' => 'Non autorisé à utiliser cet espace']);
                }
            }
        }

        try {
            $ad = Ad::create([
                'user_id' => $user->id,
                'space_id' => $validated['space_id'] ?? null,
                'country_id' => $validated['country_id'],
                'city_id' => $validated['city_id'],
                'category_id' => $validated['category_id'],
                'subcategory_id' => $validated['subcategory_id'],
                'address' => $validated['address'] ?? null,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'price' => $validated['price'] ?? 0,
                'price_description' => $validated['price_description'] ?? 'fixe',
                'main_photo' => $validated['main_photo'],
                'contact_phone' => $validated['contact_phone'] ?? null,
                'contact_email' => $validated['contact_email'],
                'status' => $user->user_type === 'admin' ? 'valid' : 'pending',
                'views_count' => 0,
            ]);

            if (!empty($validated['additional_photos'])) {
                foreach ($validated['additional_photos'] as $index => $photoUrl) {
                    AdFeature::create([
                        'ad_id' => $ad->id,
                        'label' => 'Photo ' . ($index + 1),
                        'photo' => $photoUrl,
                    ]);
                }
            }

            return redirect()->route('agency.ads')
                ->with('success', 'Annonce créée avec succès. Elle est en attente de validation.');
        } catch (\Exception $e) {
            return redirect()->route('agency.ad-create')
                ->withErrors(['submit' => 'Une erreur s\'est produite lors de la création de l\'annonce: ' . $e->getMessage()]);
        }
    }

    /**
     * Store a new agency space
     * Only agencies can create spaces
     */
    public function storeSpace(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return back()->withErrors(['auth' => 'Only agencies can create spaces']);
        }

        // Check subscription and space quota
        $quotaService = new QuotaService();
        $activeSubscription = $quotaService->getActiveSubscription($user);

        if (!$activeSubscription) {
            return back()->withErrors(['subscription' => 'Vous devez avoir un abonnement actif pour créer un espace commercial']);
        }

        if (!$quotaService->canCreateSpace($user)) {
            $remaining = $quotaService->getSpaceQuotaRemaining($user);
            return back()->withErrors(['subscription' => "Vous avez atteint le nombre maximal d'espaces pour votre abonnement. Vous pouvez avoir un maximum de {$activeSubscription->max_spaces} espaces."]);
        }

        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255',
            'description' => 'nullable|string|max:1000',
            'merchant_code' => 'required|string|unique:agency_spaces,merchant_code|max:100',
            'country_id' => 'required|exists:countries,id',
            'city_id' => 'required|exists:cities,id',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
        ], [
            'merchant_code.unique' => 'Ce code marchand est déjà utilisé',
            'name.required' => 'Le nom de l\'espace est requis',
            'country_id.required' => 'Le pays est requis',
            'city_id.required' => 'La ville est requise',
        ]);

        try {
            AgencySpace::create([
                'agency_id' => $user->id,
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'merchant_code' => $validated['merchant_code'],
                'country_id' => $validated['country_id'],
                'city_id' => $validated['city_id'],
                'address' => $validated['address'],
                'phone' => $validated['phone'],
                'email' => $validated['email'],
                'status' => true,
            ]);

            return redirect()->route('agency.spaces')
                ->with('success', 'Espace commercial créé avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['submit' => 'Erreur lors de la création de l\'espace: ' . $e->getMessage()]);
        }
    }

    /**
     * Update an agency space
     * Only agencies can update their own spaces
     */
    public function updateSpace(Request $request, $spaceId)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return back()->withErrors(['auth' => 'Only agencies can update spaces']);
        }

        $space = AgencySpace::find($spaceId);

        if (!$space || $space->agency_id !== $user->id) {
            return back()->withErrors(['space' => 'Space not found or unauthorized']);
        }

        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255',
            'description' => 'nullable|string|max:1000',
            'merchant_code' => 'nullable|string|max:100',
            'country_id' => 'required|exists:countries,id',
            'city_id' => 'required|exists:cities,id',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
        ], [
            'merchant_code.unique' => 'Ce code marchand est déjà utilisé',
        ]);

        try {
            // Only validate merchant_code uniqueness if it's provided and different from current
            if (!empty($validated['merchant_code']) && $validated['merchant_code'] !== $space->merchant_code) {
                if (AgencySpace::where('merchant_code', $validated['merchant_code'])
                    ->where('id', '!=', $space->id)
                    ->exists()) {
                    return back()->withErrors(['merchant_code' => 'Ce code marchand est déjà utilisé']);
                }
            } elseif (empty($validated['merchant_code'])) {
                // Keep existing merchant code if not provided
                $validated['merchant_code'] = $space->merchant_code;
            }

            $space->update($validated);

            return redirect()->back()
                ->with('success', 'Espace commercial modifié avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['submit' => 'Erreur lors de la modification de l\'espace: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete an agency space
     * Only agencies can delete their own spaces
     * Cascades delete to ads and employee positions
     */
    public function deleteSpace($spaceId)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return back()->withErrors(['auth' => 'Only agencies can delete spaces']);
        }

        $space = AgencySpace::find($spaceId);

        if (!$space || $space->agency_id !== $user->id) {
            return back()->withErrors(['space' => 'Space not found or unauthorized']);
        }

        try {
            // Delete associated ads
            $space->ads()->delete();

            // Delete associated employee positions
            $space->employeePositions()->delete();

            // Delete the space
            $space->delete();

            return redirect()->route('agency.spaces')
                ->with('success', 'Espace commercial supprimé avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['submit' => 'Erreur lors de la suppression de l\'espace: ' . $e->getMessage()]);
        }
    }

    /**
     * Store a new employee and assign to spaces
     * Only agencies can create employees
     */
    public function storeEmployee(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return back()->withErrors(['auth' => 'Only agencies can create employees']);
        }

        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:employee,commercial,manager',
            'space_ids' => 'required|array|min:1',
            'space_ids.*' => 'exists:agency_spaces,id',
        ]);

        try {
            // Verify all spaces belong to the agency
            $agencySpaceIds = $user->agencySpaces()->pluck('id')->toArray();
            $requestedSpaceIds = $validated['space_ids'];

            foreach ($requestedSpaceIds as $spaceId) {
                if (!in_array($spaceId, $agencySpaceIds)) {
                    return back()->withErrors(['space_ids' => 'Vous ne pouvez assigner que vos propres espaces']);
                }
            }

            // Create the employee user
            $employee = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'password' => $validated['password'],
                'user_type' => 'employee',
                'status' => true,
            ]);

            // Create profile
            Profile::create([
                'user_id' => $employee->id,
            ]);

            // Assign to spaces
            foreach ($validated['space_ids'] as $spaceId) {
                EmployeePosition::create([
                    'user_id' => $employee->id,
                    'space_id' => $spaceId,
                    'role' => $validated['role'],
                ]);
            }

            return redirect()->route('agency.employees')
                ->with('success', 'Employé créé et assigné aux espaces avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['submit' => 'Erreur lors de la création de l\'employé: ' . $e->getMessage()]);
        }
    }

    /**
     * Update an employee
     * Only agencies can update their own employees
     */
    public function updateEmployee(Request $request, $employeeId)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return back()->withErrors(['auth' => 'Only agencies can update employees']);
        }

        $employee = User::find($employeeId);

        if (!$employee) {
            return back()->withErrors(['employee' => 'Employee not found']);
        }

        // Verify the employee belongs to this agency
        $agencySpaceIds = $user->agencySpaces()->pluck('id')->toArray();
        $employeeSpaceIds = $employee->employeePositions()->pluck('space_id')->toArray();

        if (empty(array_intersect($agencySpaceIds, $employeeSpaceIds))) {
            return back()->withErrors(['auth' => 'Unauthorized']);
        }

        $validated = $request->validate([
            'name' => 'required|string|min:3|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $employeeId,
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:employee,commercial,manager',
            'space_ids' => 'required|array|min:1',
            'space_ids.*' => 'exists:agency_spaces,id',
        ]);

        try {
            // Verify all spaces belong to the agency
            foreach ($validated['space_ids'] as $spaceId) {
                if (!in_array($spaceId, $agencySpaceIds)) {
                    return back()->withErrors(['space_ids' => 'Vous ne pouvez assigner que vos propres espaces']);
                }
            }

            // Update employee user
            $employee->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ]);

            // Update positions
            EmployeePosition::where('user_id', $employeeId)->delete();
            foreach ($validated['space_ids'] as $spaceId) {
                EmployeePosition::create([
                    'user_id' => $employeeId,
                    'space_id' => $spaceId,
                    'role' => $validated['role'],
                ]);
            }

            return redirect()->route('agency.employees')
                ->with('success', 'Employé modifié avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['submit' => 'Erreur lors de la modification de l\'employé: ' . $e->getMessage()]);
        }
    }

    /**
     * Assign an existing user to a space as an employee
     * Only agencies can assign employees
     */
    public function assignEmployee(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return back()->withErrors(['auth' => 'Only agencies can assign employees']);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:employee,commercial,manager',
            'space_ids' => 'required|array|min:1',
            'space_ids.*' => 'exists:agency_spaces,id',
        ]);

        try {
            // Verify all spaces belong to the agency
            $agencySpaceIds = $user->agencySpaces()->pluck('id')->toArray();
            $requestedSpaceIds = $validated['space_ids'];

            foreach ($requestedSpaceIds as $spaceId) {
                if (!in_array($spaceId, $agencySpaceIds)) {
                    return back()->withErrors(['space_ids' => 'Vous ne pouvez assigner que vos propres espaces']);
                }
            }

            // Assign to spaces
            foreach ($validated['space_ids'] as $spaceId) {
                // Check if position already exists
                $exists = EmployeePosition::where('user_id', $validated['user_id'])
                    ->where('space_id', $spaceId)
                    ->exists();

                if (!$exists) {
                    EmployeePosition::create([
                        'user_id' => $validated['user_id'],
                        'space_id' => $spaceId,
                        'role' => $validated['role'],
                    ]);
                }
            }

            return redirect()->back()
                ->with('success', 'Employé assigné aux espaces avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['submit' => 'Erreur lors de l\'assignation de l\'employé: ' . $e->getMessage()]);
        }
    }

    /**
     * Search for users available to assign to a space
     * Returns users that can be assigned as employees
     */
    public function searchUsersForAssignment(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $query = $request->query('q', '');

        if (strlen($query) < 2) {
            return response()->json([
                'status' => 'error',
                'message' => 'Query must be at least 2 characters'
            ], 400);
        }

        $users = User::where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('email', 'like', "%{$query}%");
        })
        ->where('user_type', '!=', 'agency')
        ->where('user_type', '!=', 'admin')
        ->where('user_type', '!=', 'manager')
        ->limit(20)
        ->get(['id', 'name', 'email'])
        ->toArray();

        return response()->json([
            'status' => 'success',
            'data' => $users,
        ]);
    }

    /**
     * Assign multiple existing users to a space in one action
     * Only agencies can assign employees
     */
    public function assignMultipleEmployees(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return back()->withErrors(['auth' => 'Only agencies can assign employees']);
        }

        $validated = $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'role' => 'required|in:employee,commercial,manager',
            'space_id' => 'required|exists:agency_spaces,id',
        ]);

        try {
            // Verify the space belongs to the agency
            $agencySpaceIds = $user->agencySpaces()->pluck('id')->toArray();

            if (!in_array($validated['space_id'], $agencySpaceIds)) {
                return back()->withErrors(['space_id' => 'Vous ne pouvez assigner que vos propres espaces']);
            }

            $createdCount = 0;
            $skippedCount = 0;

            // Assign all users to the space
            foreach ($validated['user_ids'] as $userId) {
                // Check if position already exists
                $exists = EmployeePosition::where('user_id', $userId)
                    ->where('space_id', $validated['space_id'])
                    ->exists();

                if (!$exists) {
                    EmployeePosition::create([
                        'user_id' => $userId,
                        'space_id' => $validated['space_id'],
                        'role' => $validated['role'],
                    ]);
                    $createdCount++;
                } else {
                    $skippedCount++;
                }
            }

            $message = "Assignation effectuée: {$createdCount} employé(s) assigné(s)";
            if ($skippedCount > 0) {
                $message .= " ({$skippedCount} déjà assigné(s))";
            }

            return redirect()->back()
                ->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['submit' => 'Erreur lors de l\'assignation des employés: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete an employee position
     * Only agencies or employees with manager role in that space can delete employees from that space
     * Only deletes the EmployeePosition, not the User account
     */
    public function deleteEmployee($positionId)
    {
        $user = Auth::user();

        if (!$user) {
            return back()->withErrors(['auth' => 'Unauthorized']);
        }

        $position = EmployeePosition::with(['space', 'user'])->find($positionId);

        if (!$position) {
            return back()->withErrors(['position' => 'Employee position not found']);
        }

        // Check authorization: agency owners or managers in that space can delete, employees can remove themselves
        if ($user->user_type === 'agency') {
            // Agency can delete employees from their own spaces
            if ($position->space->agency_id !== $user->id) {
                return back()->withErrors(['auth' => 'Unauthorized']);
            }
        } elseif ($user->user_type === 'employee') {
            // Allow if removing themselves, otherwise must be manager in the space
            if ($position->user_id === $user->id) {
                // Employee can remove themselves from spaces
            } else {
                // Must be manager to remove others
                $managerPosition = EmployeePosition::where('user_id', $user->id)
                    ->where('space_id', $position->space_id)
                    ->where('role', 'manager')
                    ->first();

                if (!$managerPosition) {
                    return back()->withErrors(['auth' => 'Only managers can delete employees from this space']);
                }
            }
        } else {
            return back()->withErrors(['auth' => 'Unauthorized']);
        }

        try {
            $position->delete();

            return redirect()->back()
                ->with('success', 'Employé supprimé du poste avec succès');
        } catch (\Exception $e) {
            return back()->withErrors(['submit' => 'Erreur lors de la suppression de l\'employé: ' . $e->getMessage()]);
        }
    }

    /**
     * Helper method to calculate performance rating
     */
    private function getPerformanceRating($views, $contacts)
    {
        if ($views === 0) {
            return 'new';
        }
        $conversionRate = ($contacts / $views) * 100;
        if ($conversionRate >= 5) {
            return 'excellent';
        } elseif ($conversionRate >= 3) {
            return 'good';
        } elseif ($conversionRate >= 1) {
            return 'average';
        } else {
            return 'low';
        }
    }
}
