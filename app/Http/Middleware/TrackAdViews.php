<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackAdViews
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if this is a request to an ad detail page
        if ($request->is('ads/*') && $request->getMethod() === 'GET' && !$request->is('ads/*/contact') && !$request->is('ads/*/signaler')) {
            // Extract ad ID from route
            $adId = $request->route('id');
            
            if ($adId) {
                // Store ad ID in request for potential use in controller
                $request->attributes->set('tracking_ad_id', $adId);
            }
        }

        return $next($request);
    }
}
