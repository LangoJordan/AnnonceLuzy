<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MyAgenciesController extends Controller
{
    /**
     * Display all agencies assigned to the current user
     */
    public function index(): Response
    {
        $user = Auth::user();

        $agencies = [];
        $selectedAgency = null;

        // Only employees/visitors with agency positions can access this
        if ($user->employeePositions()->exists()) {
            // Get all unique agencies where this user has positions
            $agencies = $user->employeePositions()
                ->with(['space' => function ($query) {
                    $query->select('id', 'agency_id', 'name')
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

            // Get selected agency from session
            if (session('selected_agency_id')) {
                $selectedAgencyUser = \App\Models\User::find(session('selected_agency_id'));
                if ($selectedAgencyUser) {
                    $selectedAgency = [
                        'id' => $selectedAgencyUser->id,
                        'name' => $selectedAgencyUser->name,
                    ];
                }
            }
        }

        return Inertia::render('MyAgencies', [
            'user' => $user,
            'agencies' => $agencies,
            'selectedAgency' => $selectedAgency,
        ]);
    }
}
