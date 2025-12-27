<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAgencySelection
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Skip if user is not authenticated
        if (!$user) {
            return $next($request);
        }

        // Admin and Manager don't need agency selection
        if (in_array($user->user_type, ['admin', 'manager'])) {
            return $next($request);
        }

        // Agency users don't need this middleware
        if ($user->user_type === 'agency') {
            return $next($request);
        }

        // For employees/visitors with agency positions
        if ($user->employeePositions()->exists()) {
            // Check if they have a selected agency
            if (!session('selected_agency_id') || !session('selected_space_id')) {
                return redirect()->route('select-agency.show');
            }

            // Verify the selected agency/space still exists and user has access
            $position = $user->employeePositions()
                ->with('space')
                ->whereHas('space', function ($query) {
                    $query->where('agency_id', session('selected_agency_id'))
                        ->where('id', session('selected_space_id'));
                })
                ->first();

            // If selection is invalid, clear it and redirect
            if (!$position) {
                session()->forget(['selected_agency_id', 'selected_space_id']);
                return redirect()->route('select-agency.show');
            }

            // Store the selected agency and space IDs in the request for easy access in controllers
            $request->attributes->set('selected_agency_id', session('selected_agency_id'));
            $request->attributes->set('selected_space_id', session('selected_space_id'));
        }

        return $next($request);
    }
}
