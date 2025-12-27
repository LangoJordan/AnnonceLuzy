<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;
use App\Models\User;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Only check if user is authenticated
        if (!auth()->check()) {
            return $next($request);
        }

        $user = auth()->user();

        // If user status is 1 (active), allow access
        if ($user->status == 1) {
            return $next($request);
        }

        // Get status description
        $statusDescription = match($user->status) {
            2 => 'Compte en cours d\'analyse',
            3 => 'Compte bloqué',
            default => 'Accès refusé'
        };

        // Get an admin to display contact info
        $admin = User::where('user_type', 'admin')
            ->where('status', 1)
            ->first();

        // Render error page with user status info
        return Inertia::render('Error', [
            'status' => 403,
            'statusCode' => $user->status,
            'statusDescription' => $statusDescription,
            'admin' => $admin ? [
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
            ] : null,
            'user' => $user,
        ]);
    }
}
