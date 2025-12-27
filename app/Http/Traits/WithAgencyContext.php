<?php

namespace App\Http\Traits;

use Illuminate\Support\Facades\Auth;
use App\Models\AgencySpace;
use App\Models\User;

trait WithAgencyContext
{
    /**
     * Get selected agency data for frontend display
     */
    protected function getSelectedAgencyData()
    {
        $user = Auth::user();
        $selectedAgencyData = null;
        $availableAgencies = [];

        // If employee/visitor with positions
        if ($user->employeePositions()->exists()) {
            // Get available agencies
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
                        ])->toArray(),
                    ];
                })
                ->values()
                ->toArray();

            $availableAgencies = $agencies;

            // Get selected agency from session
            if (session('selected_agency_id') && session('selected_space_id')) {
                $selectedAgencyId = session('selected_agency_id');
                $selectedSpaceId = session('selected_space_id');
                
                $selectedAgency = User::find($selectedAgencyId);
                $selectedSpace = AgencySpace::find($selectedSpaceId);
                
                if ($selectedAgency && $selectedSpace) {
                    $selectedAgencyData = [
                        'id' => $selectedAgency->id,
                        'name' => $selectedAgency->name,
                        'spaceName' => $selectedSpace->name,
                    ];
                }
            }
        }

        return [
            'selectedAgency' => $selectedAgencyData,
            'availableAgencies' => $availableAgencies,
        ];
    }
}
