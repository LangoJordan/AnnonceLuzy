<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VisitorMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || $user->user_type !== 'visitor') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Visitor access required.'
            ], 403);
        }

        return $next($request);
    }
}
