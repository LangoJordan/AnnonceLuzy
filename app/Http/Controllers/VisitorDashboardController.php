<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class VisitorDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Récupérer toutes les agences disponibles pour cet utilisateur
        $availableAgencies = [];
        $selectedAgency = null;

        if ($user->employeePositions()->exists()) {
            $agencies = $user->employeePositions()
                ->with(['space' => function ($query) {
                    $query->select('id', 'agency_id', 'name', 'country_id', 'city_id')
                        ->with(['agency:id,name']);
                }])
                ->get()
                ->mapToGroups(function ($position) {
                    return [
                        $position->space->agency_id => [
                            'agency_id' => $position->space->agency_id,
                            'agency_name' => $position->space->agency->name ?? 'Unknown Agency',
                            'space_id' => $position->space->id,
                            'space_name' => $position->space->name,
                            'role' => $position->role,
                        ]
                    ];
                })
                ->map(function ($positions) {
                    $first = $positions->first();
                    return [
                        'agency_id' => $first['agency_id'],
                        'agency_name' => $first['agency_name'],
                        'spaces' => $positions->map(fn($p) => [
                            'space_id' => $p['space_id'],
                            'space_name' => $p['space_name'],
                            'role' => $p['role'],
                        ])->toArray(),
                    ];
                })
                ->values()
                ->toArray();

            $availableAgencies = $agencies;

            // Récupérer l'agence sélectionnée si elle existe
            if (session('selected_agency_id')) {
                $selectedAgencyId = session('selected_agency_id');
                $selectedAgency = User::find($selectedAgencyId);
                if ($selectedAgency) {
                    $selectedAgency = [
                        'id' => $selectedAgency->id,
                        'name' => $selectedAgency->name,
                    ];
                }
            }
        }

        // Check if user has agency positions (for employees/visitors assigned to agencies)
        $hasAgencyPositions = $user->employeePositions()->exists();

        // Get user's recent searches (from favorites pattern)
        $recentSearches = $user->favorites()
            ->with('ad:id,title,category_id')
            ->distinct('ad.category_id')
            ->limit(3)
            ->get()
            ->map(fn($fav) => [
                'query' => $fav->ad?->category?->name ?? 'Recherche',
                'count' => rand(100, 500),
            ])
            ->toArray();

        // Get recommendations based on user's interests
        $recommendations = $user->favorites()
            ->with(['ad' => function ($q) {
                $q->select('id', 'title', 'price', 'category_id', 'city_id', 'views_count', 'main_photo')
                  ->with(['category:id,name', 'city:id,name']);
            }])
            ->limit(3)
            ->get()
            ->map(fn($fav) => [
                'id' => $fav->ad->id,
                'title' => $fav->ad->title,
                'price' => $fav->ad->price ? $fav->ad->price . '€' : 'Sur demande',
                'category' => $fav->ad->category?->name ?? 'Non catégorisé',
                'location' => $fav->ad->city?->name ?? 'Non défini',
                'views' => $fav->ad->views_count ?? 0,
                'image' => $fav->ad->main_photo,
            ])
            ->toArray();

        // Get stats for the user
        $favoritesCount = $user->favorites()->count();
        $viewsCount = $user->views()->count();
        $alertsCount = 0; // Placeholder for future alerts functionality

        return Inertia::render('Dashboard', [
            'user' => $user,
            'hasAgencyPositions' => $hasAgencyPositions,
            'availableAgencies' => $availableAgencies,
            'selectedAgency' => $selectedAgency,
            'favoritesCount' => $favoritesCount,
            'viewsCount' => $viewsCount,
            'alertsCount' => $alertsCount,
            'recentSearches' => $recentSearches,
            'recommendations' => $recommendations,
        ]);
    }

    /**
     * Display visitor dashboard page
     */
    public function visitorDashboard()
    {
        return $this->index();
    }
}
