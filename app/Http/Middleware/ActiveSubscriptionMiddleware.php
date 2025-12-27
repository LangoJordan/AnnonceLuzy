<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActiveSubscriptionMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // Only check for agencies and employees
        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return $next($request);
        }

        // Get the agency context
        if ($user->user_type === 'agency') {
            $agency = $user;
        } else {
            // For employees, find their employer
            $agency = \App\Models\User::whereHas('agencySpaces.employeePositions', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })->first();

            if (!$agency) {
                return redirect()->route('home');
            }
        }

        // Check if agency has active subscription
        $hasActiveSubscription = $agency->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->exists();

        // Allow access to subscription pages without active subscription
        $subscriptionRoutes = [
            'agency.subscriptions',
            'agency.subscription-renew',
            'agency.subscription-purchase',
            'profile.edit',
            'profile.update',
        ];

        $routeName = $request->route()?->getName();

        if (!$hasActiveSubscription && $routeName && !in_array($routeName, $subscriptionRoutes)) {
            return redirect()->route('agency.subscription-renew');
        }

        return $next($request);
    }
}
