<?php

namespace App\Services;

use App\Models\View;
use App\Models\Ad;
use Illuminate\Support\Facades\Auth;

class ViewTrackingService
{
    /**
     * Track a view for an ad (authenticated or anonymous)
     *
     * @param Ad $ad
     * @param bool $incrementCount
     * @return View|null
     */
    public static function trackView(Ad $ad, bool $incrementCount = true): ?View
    {
        // Always increment view count
        if ($incrementCount) {
            $ad->increment('views_count');
        }

        // Track in database only if user is authenticated
        if (!Auth::check()) {
            return null;
        }

        $user = Auth::user();

        // Create or get existing view record for authenticated user
        $view = View::firstOrCreate(
            [
                'ad_id' => $ad->id,
                'user_id' => $user->id,
            ],
            [
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        return $view;
    }

    /**
     * Track a view without user authentication (anonymous view)
     * 
     * @param Ad $ad
     * @return void
     */
    public static function trackAnonymousView(Ad $ad): void
    {
        // Just increment the view count for anonymous views
        $ad->increment('views_count');
    }

    /**
     * Get user's view history
     * 
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUserHistory(int $limit = 50)
    {
        if (!Auth::check()) {
            return collect();
        }

        return Auth::user()->views()
            ->with(['ad' => function ($q) {
                $q->select('id', 'title', 'price', 'category_id', 'city_id', 'views_count')
                  ->with(['category:id,name', 'city:id,name']);
            }])
            ->latest('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Clear user's view history
     * 
     * @return int
     */
    public static function clearUserHistory(): int
    {
        if (!Auth::check()) {
            return 0;
        }

        return Auth::user()->views()->delete();
    }

    /**
     * Remove a specific view from user history
     * 
     * @param int $adId
     * @return bool
     */
    public static function removeFromHistory(int $adId): bool
    {
        if (!Auth::check()) {
            return false;
        }

        return (bool) Auth::user()->views()
            ->where('ad_id', $adId)
            ->delete();
    }
}
