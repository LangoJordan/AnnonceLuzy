<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ad;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AgencyViewController extends Controller
{
    /**
     * Display an agency's public profile
     */
    public function show($id)
    {
        // Fetch the agency (user with type 'agency')
        $agency = User::where('id', $id)
            ->where('user_type', 'agency')
            ->with([
                'profile',
                'country:id,name,code',
                'city:id,name,code,region,country_id',
                'agencySpaces' => function ($q) {
                    $q->where('status', true)
                      ->with(['country:id,name,code', 'city:id,name,code,region,country_id']);
                },
                'subscriptions' => function ($q) {
                    $q->wherePivot('status', true)
                      ->where('user_subscriptions.end_date', '>', now());
                },
            ])
            ->first();

        // If agency doesn't exist or is not an agency, return unavailable page
        if (!$agency) {
            return Inertia::render('Agency/Unavailable', [
                'message' => 'Agence non trouvée',
                'user' => auth()->user(),
            ]);
        }

        // Check if agency status is 1 (active)
        if ($agency->status != 1) {
            // Get an admin to display contact info
            $admin = User::where('user_type', 'admin')
                ->where('status', 1)
                ->first();

            // Determine status description
            $statusDescription = match($agency->status) {
                2 => 'Compte en cours d\'analyse',
                3 => 'Compte bloqué',
                default => 'Accès refusé'
            };

            return Inertia::render('Error', [
                'status' => 403,
                'statusCode' => $agency->status,
                'statusDescription' => $statusDescription,
                'admin' => $admin ? [
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'phone' => $admin->phone,
                ] : null,
                'user' => auth()->user(),
            ]);
        }

        // Check if agency has an active and valid subscription
        $hasActiveSubscription = $agency->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->exists();

        if (!$hasActiveSubscription) {
            return Inertia::render('Agency/Unavailable', [
                'message' => 'Cette agence n\'a pas d\'abonnement actif. Veuillez réessayer ultérieurement.',
                'user' => auth()->user(),
            ]);
        }

        // Get agency's ads with prioritization
        $ads = Ad::with(['city:id,name', 'category:id,name', 'space:id,name'])
            ->where('user_id', $agency->id)
            ->where('status', 'valid')
            ->select([
                'id',
                'title',
                'price',
                'space_id',
                'city_id',
                'category_id',
                'main_photo',
                'views_count',
                'created_at',
                DB::raw('CASE
                    WHEN EXISTS (SELECT 1 FROM ad_boosts WHERE ad_id = ads.id AND end_date > NOW() AND active = 1) THEN 1
                    WHEN EXISTS (SELECT 1 FROM user_subscriptions WHERE user_id = ads.user_id AND status = 1 AND end_date > NOW()) THEN 2
                    ELSE 3
                END AS priority_tier'),
            ])
            ->orderBy('priority_tier', 'asc')
            ->orderBy('views_count', 'desc')
            ->limit(12)
            ->get()
            ->map(function ($ad) {
                $boost = $ad->boosts()
                    ->where('end_date', '>', now())
                    ->where('active', 1)
                    ->first();

                return [
                    'id' => $ad->id,
                    'title' => $ad->title,
                    'price' => $ad->price,
                    'city' => $ad->city?->name,
                    'category' => $ad->category?->name,
                    'main_photo' => $ad->main_photo,
                    'views_count' => $ad->views_count,
                    'created_at' => $ad->created_at->format('Y-m-d'),
                    'tier_badge' => $boost ? 'boost' : null,
                    'tier_label' => $boost ? 'Boost Premium' : null,
                    'space' => $ad->space ? [
                        'id' => $ad->space->id,
                        'name' => $ad->space->name,
                    ] : null,
                ];
            })
            ->toArray();

        // Get active subscription if exists
        $activeSubscription = $agency->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->first();

        // Transform commercial spaces data
        $spacesData = $agency->agencySpaces
            ->map(function ($space) {
                return [
                    'id' => $space->id,
                    'name' => $space->name,
                    'email' => $space->email,
                    'phone' => $space->phone,
                    'address' => $space->address,
                    'country' => $space->country?->name,
                    'city' => $space->city?->name,
                    'ads_count' => $space->ads()->where('status', 'valid')->count(),
                ];
            })
            ->toArray();

        // Transform agency data
        $agencyData = [
            'id' => $agency->id,
            'name' => $agency->name,
            'email' => $agency->email,
            'phone' => $agency->phone,
            'address' => $agency->address,
            'country' => $agency->country?->name,
            'city' => $agency->city?->name,
            'user_type' => $agency->user_type,
            'status' => $agency->status,
            'profile' => $agency->profile ? [
                'photo' => $agency->profile->photo,
                'description' => $agency->profile->description,
                'slogan' => $agency->profile->slogan,
                'address' => $agency->profile->address,
            ] : null,
            'subscription' => $activeSubscription && $activeSubscription->pivot->end_date ? [
                'name' => $activeSubscription->name,
                'tier' => $activeSubscription->name,
                'end_date' => is_string($activeSubscription->pivot->end_date) ? Carbon::parse($activeSubscription->pivot->end_date)->format('Y-m-d') : $activeSubscription->pivot->end_date->format('Y-m-d'),
            ] : null,
            'spaces_count' => count($spacesData),
            'ads_count' => count($ads),
            'spaces' => $spacesData,
        ];

        return Inertia::render('Agency/View', [
            'agency' => $agencyData,
            'ads' => $ads,
            'user' => auth()->user(),
        ]);
    }
}
