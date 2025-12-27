<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AgencyMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || $user->user_type !== 'agency') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized. Agency access required.'
            ], 403);
        }

        return $next($request);
    }
}
