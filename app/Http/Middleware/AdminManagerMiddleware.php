<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminManagerMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || !in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Admin or Manager access required.'
            ], 403);
        }

        return $next($request);
    }
}
