<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ad;
use App\Models\Transaction;
use App\Models\Report;
use App\Models\UserSubscription;
use App\Models\Subscription;
use App\Models\Boost;
use App\Models\AdBoost;
use App\Models\Country;
use App\Models\City;
use App\Models\Contact;
use App\Models\Favorite;
use App\Models\View;
use App\Models\EmployeePosition;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display admin dashboard with overview
     */
    public function index(): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/Dashboard', [
                'user' => $user,
                'stats' => [],
            ]);
        }

        // Overall statistics
        $stats = [
            'users' => [
                'total' => User::count(),
                'visitors' => User::where('user_type', 'visitor')->count(),
                'agencies' => User::where('user_type', 'agency')->count(),
                'employees' => User::where('user_type', 'employee')->count(),
                'active' => User::where('status', 1)->count(),
                'pending' => User::where('status', 2)->count(),
                'blocked' => User::where('status', 3)->count(),
                'new_today' => User::where('created_at', '>=', now()->startOfDay())->count(),
                'new_week' => User::where('created_at', '>=', now()->startOfWeek())->count(),
            ],
            'ads' => [
                'total' => Ad::count(),
                'valid' => Ad::where('status', 'valid')->count(),
                'pending' => Ad::where('status', 'pending')->count(),
                'blocked' => Ad::where('status', 'blocked')->count(),
                'new_today' => Ad::where('created_at', '>=', now()->startOfDay())->count(),
            ],
            'revenue' => [
                'total' => Transaction::where('status', 'success')->sum('amount'),
                'today' => Transaction::where('status', 'success')
                    ->where('created_at', '>=', now()->startOfDay())
                    ->sum('amount'),
                'week' => Transaction::where('status', 'success')
                    ->where('created_at', '>=', now()->startOfWeek())
                    ->sum('amount'),
                'month' => Transaction::where('status', 'success')
                    ->where('created_at', '>=', now()->startOfMonth())
                    ->sum('amount'),
            ],
            'reports' => [
                'total' => Report::count(),
                'pending' => Report::where('status', 'pending')->count(),
                'resolved' => Report::where('status', 'resolved')->count(),
            ],
            'subscriptions' => [
                'active' => UserSubscription::where('status', 1)
                    ->where('end_date', '>', now())
                    ->count(),
                'pending' => UserSubscription::where('status', 2)->count(),
                'expired' => UserSubscription::where('end_date', '<=', now())->count(),
            ],
            'boosts' => [
                'active' => AdBoost::where('end_date', '>', now())->count(),
                'pending' => AdBoost::where('status', 'pending')->count(),
            ],
        ];

        // Recent activities
        $recentActivities = [
            'new_users' => User::where('user_type', 'agency')
                ->where('created_at', '>=', now()->subDays(7))
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['id', 'name', 'email', 'status', 'created_at']),
            'new_ads' => Ad::where('created_at', '>=', now()->subDays(7))
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['id', 'title', 'user_id', 'status', 'created_at']),
            'pending_ads' => Ad::where('status', 'pending')
                ->with('user')
                ->orderBy('created_at', 'asc')
                ->limit(5)
                ->get(['id', 'title', 'user_id', 'created_at']),
            'recent_reports' => Report::with(['ad', 'user'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'pending_agencies' => User::where('user_type', 'agency')
                ->where('status', 2)
                ->orderBy('created_at', 'asc')
                ->limit(5)
                ->get(['id', 'name', 'email', 'created_at']),
        ];

        return Inertia::render('Admin/Dashboard', [
            'user' => $user,
            'stats' => $stats,
            'recentActivities' => $recentActivities,
        ]);
    }

    /**
     * Display user management page
     */
    public function users(Request $request): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/Users', [
                'users' => [],
                'total' => 0,
                'filters' => [],
            ]);
        }

        $query = User::query();

        // Filtering
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('user_type', $request->type);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate(20);

        $users->getCollection()->transform(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone,
                'user_type' => $u->user_type,
                'status' => $u->status,
                'status_label' => $this->getUserStatusLabel($u->status),
                'created_at' => $u->created_at->format('Y-m-d H:i'),
                'profile' => $u->profile,
            ];
        });

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'type' => $request->get('type', 'all'),
                'status' => $request->get('status', 'all'),
                'search' => $request->get('search', ''),
                'sort_by' => $request->get('sort_by', 'created_at'),
                'sort_order' => $request->get('sort_order', 'desc'),
            ],
            'stats' => [
                'total' => User::count(),
                'visitors' => User::where('user_type', 'visitor')->count(),
                'agencies' => User::where('user_type', 'agency')->count(),
                'employees' => User::where('user_type', 'employee')->count(),
                'active' => User::where('status', 1)->count(),
                'pending' => User::where('status', 2)->count(),
                'blocked' => User::where('status', 3)->count(),
            ],
        ]);
    }

    /**
     * Display agencies management page
     */
    public function agencies(Request $request): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/Agencies', [
                'agencies' => [],
                'filters' => [],
            ]);
        }

        $query = User::where('user_type', 'agency');

        // Filtering
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $agencies = $query->with(['profile', 'agencySpaces', 'subscriptions'])->paginate(20);

        $agencies->getCollection()->transform(function ($agency) {
            // Get subscription information
            $activeSubscription = $agency->subscriptions()
                ->wherePivot('status', 1)
                ->where('user_subscriptions.end_date', '>', now())
                ->first();

            $allSubscriptions = $agency->subscriptions()
                ->get()
                ->map(function ($sub) {
                    $pivot = $sub->pivot;
                    $endDate = \Carbon\Carbon::parse($pivot->end_date);
                    $isActive = $pivot->status === 1 && $endDate > now();
                    $isExpired = $endDate <= now();

                    return [
                        'id' => $sub->id,
                        'label' => $sub->label,
                        'amount' => $sub->amount,
                        'start_date' => $this->safeFormatDate($pivot->start_date, 'Y-m-d'),
                        'end_date' => $this->safeFormatDate($pivot->end_date, 'Y-m-d'),
                        'status' => $isActive ? 'active' : ($isExpired ? 'expired' : 'inactive'),
                        'status_label' => $isActive ? 'Valide' : ($isExpired ? 'Expiré' : 'Inactif'),
                    ];
                })
                ->sortByDesc('end_date')
                ->values();

            return [
                'id' => $agency->id,
                'name' => $agency->name,
                'email' => $agency->email,
                'phone' => $agency->phone,
                'status' => $agency->status,
                'status_label' => $this->getUserStatusLabel($agency->status),
                'logo' => $agency->profile?->logo,
                'profile' => $agency->profile ? [
                    'photo' => $agency->profile->photo,
                    'description' => $agency->profile->description,
                ] : null,
                'spaces_count' => $agency->agencySpaces()->count(),
                'ads_count' => $agency->ads()->count(),
                'subscription' => $activeSubscription ? [
                    'id' => $activeSubscription->id,
                    'label' => $activeSubscription->label,
                    'amount' => $activeSubscription->amount,
                    'start_date' => $this->safeFormatDate($activeSubscription->pivot->start_date, 'Y-m-d'),
                    'end_date' => $this->safeFormatDate($activeSubscription->pivot->end_date, 'Y-m-d'),
                    'status' => 'active',
                    'status_label' => 'Valide',
                ] : null,
                'subscription_status' => $allSubscriptions->isEmpty() ? 'none' : ($activeSubscription ? 'active' : 'expired'),
                'all_subscriptions' => $allSubscriptions,
                'created_at' => $agency->created_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('Admin/Agencies', [
            'agencies' => $agencies,
            'filters' => [
                'status' => $request->get('status', 'all'),
                'search' => $request->get('search', ''),
                'sort_by' => $request->get('sort_by', 'created_at'),
                'sort_order' => $request->get('sort_order', 'desc'),
            ],
            'stats' => [
                'total' => User::where('user_type', 'agency')->count(),
                'active' => User::where('user_type', 'agency')->where('status', 1)->count(),
                'pending' => User::where('user_type', 'agency')->where('status', 2)->count(),
                'blocked' => User::where('user_type', 'agency')->where('status', 3)->count(),
            ],
        ]);
    }

    /**
     * Display user detail page
     */
    public function userDetail($userId): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/UserDetail', [
                'user' => null,
            ]);
        }

        $targetUser = User::with(['profile', 'ads', 'employeePositions.space.agency', 'subscriptions', 'country', 'city'])
            ->find($userId);

        if (!$targetUser) {
            return Inertia::render('Admin/UserDetail', [
                'user' => null,
            ]);
        }

        $userData = [
            'id' => $targetUser->id,
            'name' => $targetUser->name,
            'email' => $targetUser->email,
            'phone' => $targetUser->phone,
            'user_type' => $targetUser->user_type,
            'status' => $targetUser->status,
            'status_label' => $this->getUserStatusLabel($targetUser->status),
            'created_at' => $targetUser->created_at->format('Y-m-d H:i'),
            'updated_at' => $targetUser->updated_at->format('Y-m-d H:i'),
            'personal_info' => [
                'contact' => [
                    'email' => $targetUser->email,
                    'phone' => $targetUser->phone,
                ],
                'location' => [
                    'country' => $targetUser->country?->name,
                    'city' => $targetUser->city?->name,
                    'address' => $targetUser->address,
                ],
                'account' => [
                    'merchant_code' => $targetUser->merchant_code,
                    'user_type' => $targetUser->user_type,
                    'status' => $targetUser->status,
                    'status_label' => $this->getUserStatusLabel($targetUser->status),
                ],
                'dates' => [
                    'created_at' => $targetUser->created_at->format('Y-m-d H:i'),
                    'updated_at' => $targetUser->updated_at->format('Y-m-d H:i'),
                ],
            ],
            'profile' => $targetUser->profile ? [
                'photo' => $targetUser->profile->photo,
                'description' => $targetUser->profile->description,
                'slogan' => $targetUser->profile->slogan,
                'address' => $targetUser->profile->address,
            ] : null,
        ];

        // Type-specific data
        if ($targetUser->user_type === 'visitor') {
            // Simple visitor - just personal info
            $userData['type_data'] = null;
        } elseif ($targetUser->user_type === 'employee') {
            // Employee - positions, agencies, ads
            $positions = $targetUser->employeePositions()
                ->with(['space.agency', 'space.country', 'space.city'])
                ->get()
                ->map(function ($position) {
                    return [
                        'id' => $position->id,
                        'role' => $position->role,
                        'space' => [
                            'id' => $position->space->id,
                            'name' => $position->space->name,
                            'address' => $position->space->address,
                            'country' => $position->space->country?->name,
                            'city' => $position->space->city?->name,
                        ],
                        'agency' => [
                            'id' => $position->space->agency->id,
                            'name' => $position->space->agency->name,
                        ],
                    ];
                })
                ->values();

            // Get unique agencies this employee works for
            $agenciesArray = [];
            $agencyIds = [];
            foreach ($positions as $pos) {
                if (!in_array($pos['agency']['id'], $agencyIds)) {
                    $agenciesArray[] = $pos['agency'];
                    $agencyIds[] = $pos['agency']['id'];
                }
            }
            $agencies = collect($agenciesArray);

            // Get ads created by this employee
            $ads = $targetUser->ads()
                ->with(['space', 'category'])
                ->get()
                ->map(function ($ad) {
                    $views = View::where('ad_id', $ad->id)->with('user')->get()->map(function ($view) {
                        return [
                            'id' => $view->id,
                            'user_name' => $view->user->name,
                            'user_email' => $view->user->email,
                            'created_at' => $view->created_at->format('Y-m-d H:i'),
                        ];
                    })->values();
                    $reports = Report::where('ad_id', $ad->id)->with('user')->get()->map(function ($report) {
                        return [
                            'id' => $report->id,
                            'reason' => $report->reason,
                            'user_name' => $report->user?->name,
                            'user_email' => $report->user?->email,
                            'status' => $report->status,
                            'status_label' => $this->getReportStatusLabel($report->status),
                            'created_at' => $report->created_at->format('Y-m-d H:i'),
                        ];
                    })->values();
                    $contacts = Contact::where('ad_id', $ad->id)->with('user')->get()->map(function ($contact) {
                        return [
                            'id' => $contact->id,
                            'user_name' => $contact->user?->name,
                            'user_email' => $contact->user?->email,
                            'created_at' => $contact->created_at->format('Y-m-d H:i'),
                        ];
                    })->values();

                    return [
                        'id' => $ad->id,
                        'title' => $ad->title,
                        'status' => $ad->status,
                        'views_count' => $ad->views_count,
                        'created_at' => $ad->created_at->format('Y-m-d H:i'),
                        'space_name' => $ad->space?->name,
                        'views' => $views,
                        'reports' => $reports,
                        'contacts' => $contacts,
                    ];
                })
                ->values();

            $userData['type_data'] = [
                'positions' => $positions,
                'agencies' => $agencies,
                'ads' => $ads,
            ];
        } elseif ($targetUser->user_type === 'agency') {
            // Agency - spaces, employees, ads with metrics
            $spaces = $targetUser->agencySpaces()
                ->with(['country', 'city', 'employeePositions'])
                ->get()
                ->map(function ($space) {
                    return [
                        'id' => $space->id,
                        'name' => $space->name,
                        'email' => $space->email,
                        'phone' => $space->phone,
                        'address' => $space->address,
                        'country' => $space->country?->name,
                        'city' => $space->city?->name,
                        'employees_count' => $space->employeePositions()->count(),
                    ];
                })
                ->values();

            // Get employees working for this agency
            $employees = EmployeePosition::where(function ($q) use ($targetUser) {
                $q->whereIn('space_id', $targetUser->agencySpaces()->pluck('id'));
            })
                ->with(['user', 'space'])
                ->get()
                ->map(function ($position) {
                    return [
                        'id' => $position->user->id,
                        'name' => $position->user->name,
                        'email' => $position->user->email,
                        'role' => $position->role,
                        'space_name' => $position->space->name,
                    ];
                })
                ->unique('id')
                ->values();

            // Get ads with detailed metrics
            $ads = $targetUser->ads()
                ->with(['space'])
                ->get()
                ->map(function ($ad) {
                    $views = View::where('ad_id', $ad->id)->with('user')->get()->map(function ($view) {
                        return [
                            'id' => $view->id,
                            'user_name' => $view->user->name,
                            'user_email' => $view->user->email,
                            'created_at' => $view->created_at->format('Y-m-d H:i'),
                        ];
                    })->values();
                    $reports = Report::where('ad_id', $ad->id)->with('user')->get()->map(function ($report) {
                        return [
                            'id' => $report->id,
                            'reason' => $report->reason,
                            'user_name' => $report->user?->name,
                            'user_email' => $report->user?->email,
                            'status' => $report->status,
                            'status_label' => $this->getReportStatusLabel($report->status),
                            'created_at' => $report->created_at->format('Y-m-d H:i'),
                        ];
                    })->values();
                    $contacts = Contact::where('ad_id', $ad->id)->with('user')->get()->map(function ($contact) {
                        return [
                            'id' => $contact->id,
                            'user_name' => $contact->user?->name,
                            'user_email' => $contact->user?->email,
                            'created_at' => $contact->created_at->format('Y-m-d H:i'),
                        ];
                    })->values();

                    return [
                        'id' => $ad->id,
                        'title' => $ad->title,
                        'status' => $ad->status,
                        'space_name' => $ad->space?->name,
                        'views_count' => $ad->views_count,
                        'views' => $views,
                        'reports' => $reports,
                        'contacts' => $contacts,
                        'created_at' => $ad->created_at->format('Y-m-d H:i'),
                    ];
                })
                ->values();

            // Calculate aggregate stats
            $totalViews = 0;
            $totalReports = 0;
            $totalContacts = 0;
            foreach ($ads as $ad) {
                $totalViews += count($ad['views']);
                $totalReports += count($ad['reports']);
                $totalContacts += count($ad['contacts']);
            }

            $userData['type_data'] = [
                'spaces' => $spaces,
                'employees' => $employees,
                'ads' => $ads,
                'stats' => [
                    'total_spaces' => $spaces->count(),
                    'total_employees' => $employees->count(),
                    'total_ads' => $ads->count(),
                    'total_views' => $totalViews,
                    'total_reports' => $totalReports,
                    'total_contacts' => $totalContacts,
                ],
            ];
        }

        // User transactions
        $userTransactions = Transaction::where('sender_id', $targetUser->id)
            ->orWhere('receiver_id', $targetUser->id)
            ->with(['sender', 'receiver'])
            ->orderByDesc('date')
            ->get()
            ->map(function ($trans) {
                return [
                    'id' => $trans->id,
                    'sender_name' => $trans->sender?->name,
                    'receiver_name' => $trans->receiver?->name,
                    'amount' => $trans->amount,
                    'transaction_type' => $trans->transaction_type,
                    'mode' => $trans->mode,
                    'status' => $trans->status,
                    'date' => $this->safeFormatDate($trans->date, 'Y-m-d H:i'),
                ];
            })
            ->values();

        return Inertia::render('Admin/UserDetail', [
            'user' => $userData,
            'transactions' => $userTransactions,
        ]);
    }

    /**
     * Display agency detail page
     */
    public function agencyDetail($agencyId): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/AgencyDetail', [
                'agency' => null,
            ]);
        }

        $agency = User::where('id', $agencyId)
            ->where('user_type', 'agency')
            ->with(['profile', 'agencySpaces.country', 'agencySpaces.city', 'ads.space'])
            ->first();

        if (!$agency) {
            return Inertia::render('Admin/AgencyDetail', [
                'agency' => null,
            ]);
        }

        // Gather comprehensive agency data
        $ads = $agency->ads;
        $adIds = $ads->pluck('id');

        $agencyData = [
            'id' => $agency->id,
            'name' => $agency->name,
            'email' => $agency->email,
            'phone' => $agency->phone,
            'status' => $agency->status,
            'status_label' => $this->getUserStatusLabel($agency->status),
            'logo' => $agency->profile?->logo,
            'description' => $agency->profile?->description,
            'slogan' => $agency->profile?->slogan,
            'country' => $agency->country,
            'city' => $agency->city,
            'address' => $agency->address,
            'merchant_code' => $agency->merchant_code,
            'created_at' => $agency->created_at->format('Y-m-d H:i'),
            'updated_at' => $agency->updated_at->format('Y-m-d H:i'),
            'stats' => [
                'total_ads' => $ads->count(),
                'active_ads' => $ads->where('status', 'valid')->count(),
                'pending_ads' => $ads->where('status', 'pending')->count(),
                'blocked_ads' => $ads->where('status', 'blocked')->count(),
                'total_views' => $ads->sum('views_count'),
                'total_contacts' => $adIds->count() > 0 ? Contact::whereIn('ad_id', $adIds)->count() : 0,
                'total_favorites' => $adIds->count() > 0 ? Favorite::whereIn('ad_id', $adIds)->count() : 0,
                'total_revenue' => Transaction::where('sender_id', $agency->id)
                    ->where('status', 'success')
                    ->sum('amount'),
            ],
            'spaces' => $agency->agencySpaces()->get()->map(function ($space) {
                return [
                    'id' => $space->id,
                    'name' => $space->name,
                    'email' => $space->email,
                    'phone' => $space->phone,
                    'address' => $space->address,
                    'country' => $space->country,
                    'city' => $space->city,
                    'merchant_code' => $space->merchant_code,
                ];
            })->values(),
            'subscription' => $this->formatAgencySubscription($agency),
            'all_subscriptions' => $agency->subscriptions()
                ->get()
                ->map(function ($sub) {
                    $pivot = $sub->pivot;
                    $endDate = \Carbon\Carbon::parse($pivot->end_date);
                    $isActive = $pivot->status === 1 && $endDate > now();
                    $isExpired = $endDate <= now();

                    return [
                        'id' => $sub->id,
                        'label' => $sub->label,
                        'amount' => $sub->amount,
                        'start_date' => $this->safeFormatDate($pivot->start_date, 'Y-m-d'),
                        'end_date' => $this->safeFormatDate($pivot->end_date, 'Y-m-d'),
                        'status' => $isActive ? 'active' : ($isExpired ? 'expired' : 'inactive'),
                        'status_label' => $isActive ? 'Valide' : ($isExpired ? 'Expiré' : 'Inactif'),
                    ];
                })
                ->sortByDesc('end_date')
                ->values(),
        ];

        // Detailed ads with views, reports, and contacts
        $detailedAds = $ads->map(function ($ad) {
            $views = View::where('ad_id', $ad->id)->with('user')->get()->map(function ($view) {
                return [
                    'id' => $view->id,
                    'user_name' => $view->user->name,
                    'user_email' => $view->user->email,
                    'created_at' => $view->created_at->format('Y-m-d H:i'),
                ];
            })->values();

            $reports = Report::where('ad_id', $ad->id)->with('user')->get()->map(function ($report) {
                return [
                    'id' => $report->id,
                    'reason' => $report->reason,
                    'user_name' => $report->user?->name,
                    'user_email' => $report->user?->email,
                    'status' => $report->status,
                    'status_label' => $this->getReportStatusLabel($report->status),
                    'created_at' => $report->created_at->format('Y-m-d H:i'),
                ];
            })->values();

            $contacts = Contact::where('ad_id', $ad->id)->with('user')->get()->map(function ($contact) {
                return [
                    'id' => $contact->id,
                    'user_name' => $contact->user?->name,
                    'user_email' => $contact->user?->email,
                    'created_at' => $contact->created_at->format('Y-m-d H:i'),
                ];
            })->values();

            return [
                'id' => $ad->id,
                'title' => $ad->title,
                'status' => $ad->status,
                'space_name' => $ad->space?->name,
                'views_count' => $ad->views_count,
                'created_at' => $ad->created_at->format('Y-m-d H:i'),
                'views' => $views,
                'reports' => $reports,
                'contacts' => $contacts,
            ];
        })->sortByDesc('created_at')->values();

        // Agency transactions
        $transactions = Transaction::where('sender_id', $agency->id)
            ->orWhere('receiver_id', $agency->id)
            ->with(['sender', 'receiver'])
            ->orderByDesc('date')
            ->get()
            ->map(function ($trans) {
                return [
                    'id' => $trans->id,
                    'sender_name' => $trans->sender?->name,
                    'receiver_name' => $trans->receiver?->name,
                    'amount' => $trans->amount,
                    'transaction_type' => $trans->transaction_type,
                    'mode' => $trans->mode,
                    'status' => $trans->status,
                    'date' => $this->safeFormatDate($trans->date, 'Y-m-d H:i'),
                ];
            })
            ->values();

        return Inertia::render('Admin/AgencyDetail', [
            'agency' => $agencyData,
            'ads' => $detailedAds,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Display payments/transactions page
     */
    public function payments(Request $request): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/Payments', [
                'transactions' => [],
                'filters' => [],
            ]);
        }

        $query = Transaction::with(['sender', 'receiver']);

        // Search filtering
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('sender', function ($subQ) use ($search) {
                    $subQ->where('name', 'like', "%$search%");
                })
                ->orWhereHas('receiver', function ($subQ) use ($search) {
                    $subQ->where('name', 'like', "%$search%");
                });
            });
        }

        // Type filtering
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('transaction_type', $request->type);
        }

        // Status filtering
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Mode filtering
        if ($request->has('mode') && $request->mode !== 'all') {
            $query->where('mode', $request->mode);
        }

        // Date range filtering
        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'date');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $transactions = $query->paginate(20);

        $transactions->getCollection()->transform(function ($t) {
            return [
                'id' => $t->id,
                'sender_id' => $t->sender_id,
                'sender_name' => $t->sender?->name,
                'receiver_id' => $t->receiver_id,
                'receiver_name' => $t->receiver?->name,
                'amount' => $t->amount,
                'transaction_type' => $t->transaction_type,
                'mode' => $t->mode,
                'status' => $t->status,
                'date' => $t->date->format('Y-m-d H:i'),
            ];
        });

        // Statistics - Use independent queries for each calculation to avoid query mutation issues
        $baseQuery = Transaction::where('status', 'success');

        // Apply date filters to statistics if provided
        $dateFrom = $request->has('date_from') ? $request->date_from : null;
        $dateTo = $request->has('date_to') ? $request->date_to : null;

        // Total amount and transactions (including filtered results)
        $stats = [
            'total_amount' => $baseQuery->clone()
                ->when($dateFrom, fn($q) => $q->where('date', '>=', $dateFrom))
                ->when($dateTo, fn($q) => $q->where('date', '<=', $dateTo))
                ->sum('amount'),
            'total_transactions' => $baseQuery->clone()
                ->when($dateFrom, fn($q) => $q->where('date', '>=', $dateFrom))
                ->when($dateTo, fn($q) => $q->where('date', '<=', $dateTo))
                ->count(),
            'today' => $baseQuery->clone()
                ->where('date', '>=', now()->startOfDay())
                ->sum('amount'),
            'week' => $baseQuery->clone()
                ->where('date', '>=', now()->startOfWeek())
                ->sum('amount'),
            'month' => $baseQuery->clone()
                ->where('date', '>=', now()->startOfMonth())
                ->sum('amount'),
            'by_type' => [
                'subscription' => $baseQuery->clone()
                    ->where('transaction_type', 'subscription')
                    ->when($dateFrom, fn($q) => $q->where('date', '>=', $dateFrom))
                    ->when($dateTo, fn($q) => $q->where('date', '<=', $dateTo))
                    ->sum('amount'),
                'boost' => $baseQuery->clone()
                    ->where('transaction_type', 'boost')
                    ->when($dateFrom, fn($q) => $q->where('date', '>=', $dateFrom))
                    ->when($dateTo, fn($q) => $q->where('date', '<=', $dateTo))
                    ->sum('amount'),
            ],
        ];

        return Inertia::render('Admin/Payments', [
            'transactions' => $transactions,
            'filters' => [
                'search' => $request->get('search', ''),
                'type' => $request->get('type', 'all'),
                'status' => $request->get('status', 'all'),
                'mode' => $request->get('mode', 'all'),
                'date_from' => $request->get('date_from', ''),
                'date_to' => $request->get('date_to', ''),
                'sort_by' => $request->get('sort_by', 'date'),
                'sort_order' => $request->get('sort_order', 'desc'),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Display active boosts page
     */
    public function boosts(Request $request): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/Boosts', [
                'boosts' => [],
                'filters' => [],
            ]);
        }

        $query = AdBoost::with(['ad', 'boost', 'ad.user'])->whereHas('boost');

        // Filtering
        if ($request->has('status') && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->where('end_date', '>', now());
            } elseif ($request->status === 'expired') {
                $query->where('end_date', '<=', now());
            }
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('ad', function ($q) use ($search) {
                $q->where('title', 'like', "%$search%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $boosts = $query->paginate(20);

        $boosts->getCollection()->transform(function ($boost) {
            return [
                'id' => $boost->id,
                'ad_id' => $boost->ad_id,
                'ad_title' => $boost->ad?->title,
                'agency_id' => $boost->ad?->user_id,
                'agency_name' => $boost->ad?->user?->name,
                'boost_package' => $boost->boost?->label,
                'boost_level' => $boost->boost?->priority_level,
                'status' => now() < $boost->end_date ? 'active' : 'expired',
                'start_date' => $boost->start_date->format('Y-m-d'),
                'end_date' => $boost->end_date->format('Y-m-d'),
                'amount' => $boost->boost?->amount,
                'cost' => $boost->boost?->amount,
                'currency' => 'XFA',
            ];
        });

        $stats = [
            'total_active' => AdBoost::where('end_date', '>', now())->count(),
            'total_expired' => AdBoost::where('end_date', '<=', now())->count(),
            'total_revenue' => Transaction::where('transaction_type', 'boost')
                ->where('status', 'success')
                ->sum('amount'),
        ];

        return Inertia::render('Admin/Boosts', [
            'boosts' => $boosts,
            'filters' => [
                'status' => $request->get('status', 'all'),
                'search' => $request->get('search', ''),
                'sort_by' => $request->get('sort_by', 'created_at'),
                'sort_order' => $request->get('sort_order', 'desc'),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Display reports/moderation page
     */
    public function reports(Request $request): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/Reports', [
                'reports' => [],
                'filters' => [],
            ]);
        }

        $query = Report::with(['ad', 'user']);

        // Filtering
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('ad', function ($q) use ($search) {
                $q->where('title', 'like', "%$search%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $reports = $query->paginate(20);

        $reports->getCollection()->transform(function ($report) {
            return [
                'id' => $report->id,
                'ad_id' => $report->ad_id,
                'ad_title' => $report->ad?->title,
                'user_id' => $report->user_id,
                'user' => $report->user ? ['id' => $report->user->id, 'name' => $report->user->name] : null,
                'reason' => $report->reason,
                'status' => $report->status,
                'created_at' => $report->created_at->format('Y-m-d H:i'),
                'updated_at' => $report->updated_at->format('Y-m-d H:i'),
            ];
        });

        $stats = [
            'total' => Report::count(),
            'pending' => Report::where('status', 'pending')->count(),
            'resolved' => Report::where('status', 'resolved')->count(),
            'rejected' => Report::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
            'filters' => [
                'status' => $request->get('status', 'all'),
                'search' => $request->get('search', ''),
                'sort_by' => $request->get('sort_by', 'created_at'),
                'sort_order' => $request->get('sort_order', 'desc'),
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Display report detail page
     */
    public function reportDetail($id): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/ReportDetail', [
                'report' => null,
                'ad' => null,
                'creator' => null,
                'agency' => null,
            ]);
        }

        $report = Report::with(['ad', 'user'])->find($id);

        if (!$report) {
            return Inertia::render('Admin/ReportDetail', [
                'report' => null,
                'ad' => null,
                'creator' => null,
                'agency' => null,
            ]);
        }

        $ad = $report->ad;
        $creator = $ad ? $ad->user : null;
        $agency = $creator ? $creator : null;

        // Get ad features
        $features = $ad ? $ad->features()->get() : [];

        $reportData = [
            'id' => $report->id,
            'ad_id' => $report->ad_id,
            'user_id' => $report->user_id,
            'reason' => $report->reason,
            'status' => $report->status,
            'created_at' => $report->created_at->format('Y-m-d H:i'),
            'updated_at' => $report->updated_at->format('Y-m-d H:i'),
            'reporter' => $report->user ? [
                'id' => $report->user->id,
                'name' => $report->user->name,
                'email' => $report->user->email,
            ] : null,
        ];

        $adData = $ad ? [
            'id' => $ad->id,
            'title' => $ad->title,
            'description' => $ad->description,
            'price' => $ad->price,
            'price_description' => $ad->price_description,
            'address' => $ad->address,
            'main_photo' => $ad->main_photo,
            'status' => $ad->status,
            'created_at' => $ad->created_at->format('Y-m-d H:i'),
            'contact_phone' => $ad->contact_phone,
            'contact_email' => $ad->contact_email,
            'views_count' => $ad->views_count,
        ] : null;

        $creatorData = $creator ? [
            'id' => $creator->id,
            'name' => $creator->name,
            'email' => $creator->email,
            'phone' => $creator->phone,
            'user_type' => $creator->user_type,
        ] : null;

        $agencyData = $agency ? [
            'id' => $agency->id,
            'name' => $agency->name,
            'email' => $agency->email,
            'phone' => $agency->phone,
            'address' => $agency->address,
        ] : null;

        $featuresData = $features->map(function ($feature) {
            return [
                'id' => $feature->id,
                'label' => $feature->label,
                'photo' => $feature->photo,
            ];
        })->toArray();

        return Inertia::render('Admin/ReportDetail', [
            'report' => $reportData,
            'ad' => $adData,
            'features' => $featuresData,
            'creator' => $creatorData,
            'agency' => $agencyData,
        ]);
    }

    /**
     * Display statistics/analytics page
     */
    public function statistics(Request $request): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/Statistics', [
                'stats' => [],
                'charts' => [],
            ]);
        }

        $period = $request->get('period', 'month');
        $dateFrom = match ($period) {
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'quarter' => now()->startOfQuarter(),
            'year' => now()->startOfYear(),
            default => now()->startOfMonth(),
        };
        $dateTo = now();

        // User growth data
        $userGrowth = User::where('created_at', '>=', $dateFrom)
            ->where('created_at', '<=', $dateTo)
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw("COUNT(*) as count")
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

        // Ad growth data
        $adGrowth = Ad::where('created_at', '>=', $dateFrom)
            ->where('created_at', '<=', $dateTo)
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw("COUNT(*) as count")
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

        // Revenue growth data
        $revenueGrowth = Transaction::where('status', 'success')
            ->where('created_at', '>=', $dateFrom)
            ->where('created_at', '<=', $dateTo)
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw('SUM(amount) as amount')
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

        // Ad status breakdown
        $adStatus = [
            'valid' => Ad::where('status', 'valid')->count(),
            'pending' => Ad::where('status', 'pending')->count(),
            'blocked' => Ad::where('status', 'blocked')->count(),
        ];

        // User type breakdown
        $userTypes = [
            'visitor' => User::where('user_type', 'visitor')->count(),
            'agency' => User::where('user_type', 'agency')->count(),
            'employee' => User::where('user_type', 'employee')->count(),
        ];

        // Most viewed ads
        $topAds = Ad::orderByDesc('views_count')
            ->with('user')
            ->limit(10)
            ->get(['id', 'title', 'user_id', 'views_count', 'status'])
            ->map(function ($ad) {
                return [
                    'title' => $ad->title,
                    'agency' => $ad->user?->name,
                    'views' => $ad->views_count,
                    'status' => $ad->status,
                ];
            });

        // Top agencies by revenue
        $topAgencies = User::where('user_type', 'agency')
            ->selectRaw('users.id, users.name')
            ->selectRaw('COUNT(ads.id) as ads_count')
            ->selectRaw('SUM(ads.views_count) as total_views')
            ->leftJoin('ads', 'ads.user_id', '=', 'users.id')
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_views')
            ->limit(10)
            ->get();

        $stats = [
            'period' => $period,
            'total_users' => User::count(),
            'total_ads' => Ad::count(),
            'total_views' => View::count(),
            'total_contacts' => Contact::count(),
            'total_revenue' => Transaction::where('status', 'success')->sum('amount'),
            'pending_reports' => Report::where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Statistics', [
            'stats' => $stats,
            'filters' => [
                'period' => $period,
            ],
            'charts' => [
                'userGrowth' => $userGrowth,
                'adGrowth' => $adGrowth,
                'revenueGrowth' => $revenueGrowth,
                'adStatus' => $adStatus,
                'userTypes' => $userTypes,
                'topAds' => $topAds,
                'topAgencies' => $topAgencies,
            ],
        ]);
    }

    /**
     * Display subscription plans management page
     */
    public function subscriptions(Request $request): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/SubscriptionPlans', [
                'plans' => [],
                'stats' => [],
            ]);
        }

        $plans = Subscription::with('users')
            ->orderBy('id')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'label' => $plan->label,
                    'amount' => $plan->amount,
                    'max_ads' => $plan->max_ads,
                    'max_spaces' => $plan->max_spaces,
                    'duration_days' => $plan->duration_days,
                    'is_active' => $plan->is_active,
                    'active_subscriptions' => $plan->users()
                        ->where('user_subscriptions.status', 1)
                        ->where('user_subscriptions.end_date', '>', now())
                        ->count(),
                    'features' => [
                        'Multi-space management' => true,
                        'Employee management' => true,
                        'Ad boosting' => true,
                        'Analytics' => true,
                    ],
                ];
            });

        // Statistics
        $stats = [
            'total_plans' => Subscription::count(),
            'active_subscriptions' => UserSubscription::where('status', 1)
                ->where('end_date', '>', now())
                ->count(),
            'expired_subscriptions' => UserSubscription::where('end_date', '<=', now())->count(),
            'total_revenue' => Transaction::where('transaction_type', 'subscription')
                ->where('status', 'success')
                ->sum('amount'),
        ];

        return Inertia::render('Admin/SubscriptionPlans', [
            'plans' => $plans,
            'stats' => $stats,
        ]);
    }

    /**
     * Display boost packages management page
     */
    public function boostPackages(Request $request): Response
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return Inertia::render('Admin/BoostPackages', [
                'packages' => [],
                'stats' => [],
            ]);
        }

        $packages = Boost::orderBy('priority_level')
            ->get()
            ->map(function ($boost) {
                return [
                    'id' => $boost->id,
                    'label' => $boost->label,
                    'amount' => $boost->amount,
                    'priority_level' => $boost->priority_level,
                    'duration_days' => $boost->duration_days,
                    'active_boosts' => AdBoost::where('boost_id', $boost->id)
                        ->where('end_date', '>', now())
                        ->count(),
                ];
            });

        // Statistics
        $stats = [
            'total_packages' => Boost::count(),
            'active_boosts' => AdBoost::where('end_date', '>', now())->count(),
            'expired_boosts' => AdBoost::where('end_date', '<=', now())->count(),
            'total_revenue' => Transaction::where('transaction_type', 'boost')
                ->where('status', 'success')
                ->sum('amount'),
        ];

        return Inertia::render('Admin/BoostPackages', [
            'packages' => $packages,
            'stats' => $stats,
        ]);
    }

    /**
     * Helper method to get user status label
     */
    private function getUserStatusLabel($status): string
    {
        return match ($status) {
            1 => 'Validé',
            2 => 'En attente',
            3 => 'Bloqué',
            default => 'Inconnu',
        };
    }

    /**
     * Get admin dashboard overview (JSON)
     */
    public function overview(): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'users' => [
                'total' => User::count(),
                'visitors' => User::where('user_type', 'visitor')->count(),
                'agencies' => User::where('user_type', 'agency')->count(),
                'employees' => User::where('user_type', 'employee')->count(),
                'active' => User::where('status', 1)->count(),
                'pending' => User::where('status', 2)->count(),
                'blocked' => User::where('status', 3)->count(),
            ],
            'ads' => [
                'total' => Ad::count(),
                'valid' => Ad::where('status', 'valid')->count(),
                'pending' => Ad::where('status', 'pending')->count(),
                'blocked' => Ad::where('status', 'blocked')->count(),
            ],
            'revenue' => [
                'total' => Transaction::where('status', 'success')->sum('amount'),
                'today' => Transaction::where('status', 'success')
                    ->where('created_at', '>=', now()->startOfDay())
                    ->sum('amount'),
            ],
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Update user status (block, pending, valid)
     */
    public function updateUserStatus(Request $request, $userId): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:1,2,3',
        ]);

        $targetUser = User::find($userId);

        if (!$targetUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        $targetUser->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Statut de l\'utilisateur mis à jour',
            'data' => [
                'id' => $targetUser->id,
                'status' => $targetUser->status,
                'status_label' => $this->getUserStatusLabel($targetUser->status),
            ],
        ]);
    }

    /**
     * Update ad status (pending, valid, blocked)
     */
    public function updateAdStatus(Request $request, $adId): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,valid,blocked',
        ]);

        $ad = Ad::find($adId);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Annonce non trouvée'
            ], 404);
        }

        $ad->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Statut de l\'annonce mis à jour',
            'data' => [
                'id' => $ad->id,
                'status' => $ad->status,
                'status_label' => $this->getAdStatusLabel($ad->status),
            ],
        ]);
    }

    /**
     * Helper method to safely format dates (handles both string and Carbon instances)
     */
    private function safeFormatDate($date, $format = 'Y-m-d'): string
    {
        if (is_null($date)) {
            return '';
        }

        // If it's already a string in the right format, return it as-is
        if (is_string($date)) {
            // Check if it's already formatted correctly (simple check)
            if (preg_match('/^\d{4}-\d{2}-\d{2}/', $date)) {
                return substr($date, 0, 10);
            }
            // Otherwise parse and format
            return \Carbon\Carbon::parse($date)->format($format);
        }

        // If it's a Carbon instance, format it
        if ($date instanceof \Carbon\Carbon) {
            return $date->format($format);
        }

        // Fallback: try to parse as string
        return \Carbon\Carbon::parse($date)->format($format);
    }

    /**
     * Helper method to format agency subscription data
     */
    private function formatAgencySubscription($agency)
    {
        $activeSubscription = $agency->subscriptions()
            ->wherePivot('status', 1)
            ->where('user_subscriptions.end_date', '>', now())
            ->first();

        if (!$activeSubscription) {
            return null;
        }

        return [
            'id' => $activeSubscription->id,
            'label' => $activeSubscription->label,
            'amount' => $activeSubscription->amount,
            'start_date' => $this->safeFormatDate($activeSubscription->pivot->start_date, 'Y-m-d'),
            'end_date' => $this->safeFormatDate($activeSubscription->pivot->end_date, 'Y-m-d'),
            'status' => 'active',
            'status_label' => 'Valide',
        ];
    }

    /**
     * Helper method to get ad status label
     */
    private function getAdStatusLabel($status): string
    {
        return match ($status) {
            'pending' => 'En attente',
            'valid' => 'Valide',
            'blocked' => 'Bloquée',
            default => 'Inconnu',
        };
    }

    /**
     * Helper method to get report status label
     */
    private function getReportStatusLabel($status): string
    {
        return match ($status) {
            'pending' => 'En attente',
            'resolved' => 'Résolu',
            'rejected' => 'Rejeté',
            default => 'En attente',
        };
    }

    /**
     * Update report status
     */
    public function updateReportStatus(Request $request, $reportId): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,resolved,rejected',
        ]);

        $report = Report::find($reportId);

        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Signalement non trouvé'
            ], 404);
        }

        $report->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Statut du signalement mis à jour',
            'data' => [
                'id' => $report->id,
                'status' => $report->status,
                'status_label' => $this->getReportStatusLabel($report->status),
            ],
        ]);
    }

    /**
     * Create a new subscription plan
     */
    public function storeSubscription(Request $request)
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'label' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'max_ads' => 'required|integer|min:1',
            'max_spaces' => 'required|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ]);

        $subscription = Subscription::create([
            'label' => $request->label,
            'amount' => $request->amount,
            'duration_days' => $request->duration_days,
            'max_ads' => $request->max_ads,
            'max_spaces' => $request->max_spaces,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect('/admin/abonnements')->with('success', 'Plan d\'abonnement créé avec succès');
    }

    /**
     * Update an existing subscription plan
     */
    public function updateSubscription(Request $request, $id)
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $subscription = Subscription::find($id);

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Plan d\'abonnement non trouvé'
            ], 404);
        }

        $request->validate([
            'label' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'max_ads' => 'required|integer|min:1',
            'max_spaces' => 'required|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ]);

        $subscription->update([
            'label' => $request->label,
            'amount' => $request->amount,
            'duration_days' => $request->duration_days,
            'max_ads' => $request->max_ads,
            'max_spaces' => $request->max_spaces,
            'is_active' => $request->is_active ?? $subscription->is_active,
        ]);

        return redirect('/admin/abonnements')->with('success', 'Plan d\'abonnement mis à jour avec succès');
    }

    /**
     * Delete a subscription plan
     */
    public function deleteSubscription(Request $request, $id)
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $subscription = Subscription::find($id);

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Plan d\'abonnement non trouvé'
            ], 404);
        }

        $subscription->delete();

        return redirect('/admin/abonnements')->with('success', 'Plan d\'abonnement supprimé avec succès');
    }

    /**
     * Create a new boost package
     */
    public function storeBoost(Request $request)
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $request->validate([
            'label' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'priority_level' => 'required|integer|in:1,2,3',
        ]);

        $boost = Boost::create([
            'label' => $request->label,
            'amount' => $request->amount,
            'duration_days' => $request->duration_days,
            'priority_level' => $request->priority_level,
        ]);

        return redirect('/admin/packs-boost')->with('success', 'Pack de boost créé avec succès');
    }

    /**
     * Update an existing boost package
     */
    public function updateBoost(Request $request, $id)
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $boost = Boost::find($id);

        if (!$boost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pack de boost non trouvé'
            ], 404);
        }

        $request->validate([
            'label' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'priority_level' => 'required|integer|in:1,2,3',
        ]);

        $boost->update([
            'label' => $request->label,
            'amount' => $request->amount,
            'duration_days' => $request->duration_days,
            'priority_level' => $request->priority_level,
        ]);

        return redirect('/admin/packs-boost')->with('success', 'Pack de boost mis à jour avec succès');
    }

    /**
     * Delete a boost package
     */
    public function deleteBoost(Request $request, $id)
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $boost = Boost::find($id);

        if (!$boost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pack de boost non trouvé'
            ], 404);
        }

        $boost->delete();

        return redirect('/admin/packs-boost')->with('success', 'Pack de boost supprimé avec succès');
    }
}
