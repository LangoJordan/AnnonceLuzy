<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgencySelectionController extends Controller
{
    /**
     * Display the agency selection interface
     * For employees/visitors with multiple agency positions
     */
    public function show()
    {
        $user = Auth::user();

        // Get all unique agencies where this user has positions
        $agencies = $user->employeePositions()
            ->with(['space' => function ($query) {
                $query->select('id', 'agency_id', 'name', 'country_id', 'city_id')
                    ->with(['agency:id,name', 'country:id,name', 'city:id,name']);
            }])
            ->get()
            ->mapToGroups(function ($position) {
                return [
                    $position->space->agency_id => [
                        'agency_id' => $position->space->agency_id,
                        'agency_name' => $position->space->agency->name ?? 'Unknown Agency',
                        'space_id' => $position->space->id,
                        'space_name' => $position->space->name,
                        'location' => $this->formatLocation($position->space),
                        'role' => $position->role,
                    ]
                ];
            })
            ->map(function ($positions) {
                // Get the first space for this agency as the primary one
                $first = $positions->first();
                return [
                    'agency_id' => $first['agency_id'],
                    'agency_name' => $first['agency_name'],
                    'spaces' => $positions->map(fn($p) => [
                        'space_id' => $p['space_id'],
                        'space_name' => $p['space_name'],
                        'location' => $p['location'],
                        'role' => $p['role'],
                    ])->toArray(),
                ];
            })
            ->values()
            ->toArray();

        // Check if user has a selected agency in session
        $selectedAgencyId = session('selected_agency_id');
        $selectedSpaceId = session('selected_space_id');

        return Inertia::render('Auth/AgencySelection', [
            'user' => $user,
            'agencies' => $agencies,
            'selectedAgencyId' => $selectedAgencyId,
            'selectedSpaceId' => $selectedSpaceId,
        ]);
    }

    /**
     * Handle agency selection
     */
    public function select(Request $request)
    {
        $user = Auth::user();

        // Validate the request
        $validated = $request->validate([
            'agency_id' => 'required|integer',
            'space_id' => 'required|integer',
        ]);

        // Verify that the user actually has a position in this space
        $position = $user->employeePositions()
            ->with('space')
            ->whereHas('space', function ($query) use ($validated) {
                $query->where('agency_id', $validated['agency_id'])
                    ->where('id', $validated['space_id']);
            })
            ->first();

        if (!$position) {
            return back()->withErrors(['agency' => 'You do not have access to this agency']);
        }

        // Store the selected agency and space in session
        session([
            'selected_agency_id' => $validated['agency_id'],
            'selected_space_id' => $validated['space_id'],
        ]);

        // Redirect to agency dashboard
        return redirect()->route('agency.dashboard');
    }

    /**
     * Clear the selected agency from session
     */
    public function clearSelection(Request $request)
    {
        session()->forget(['selected_agency_id', 'selected_space_id']);
        return redirect()->route('dashboard');
    }

    /**
     * Helper function to format location
     */
    private function formatLocation($space): string
    {
        $parts = [];
        if ($space->city && $space->city->name) {
            $parts[] = $space->city->name;
        }
        if ($space->country && $space->country->name) {
            $parts[] = $space->country->name;
        }
        return implode(', ', $parts) ?: 'Unknown location';
    }
}
