<?php

namespace App\Http\Controllers;

use App\Models\View;
use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ViewController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth')->except(['store']);
    // }

    /**
     * Record a view for an ad
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ad_id' => 'required|exists:ads,id',
        ]);

        $ad = Ad::find($validated['ad_id']);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        $userId = Auth::check() ? Auth::id() : null;

        $view = View::firstOrCreate(
            [
                'ad_id' => $ad->id,
                'user_id' => $userId,
            ]
        );

        $ad->increment('views_count');

        return response()->json([
            'status' => 'success',
            'message' => 'View recorded',
            'data' => $view,
        ], 201);
    }

    /**
     * Get all views for an ad
     */
    public function getAdViews($adId, Request $request): JsonResponse
    {
        $user = Auth::user();
        $ad = Ad::find($adId);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        if ($ad->user_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $views = $ad->views()
            ->with('user')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $views,
            'total_views' => $ad->views_count,
        ]);
    }

    /**
     * Get view statistics for an ad
     */
    public function getAdStatistics($adId): JsonResponse
    {
        $user = Auth::user();
        $ad = Ad::find($adId);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        if ($ad->user_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $views = $ad->views()->with('user')->get();

        $stats = [
            'total_views' => $ad->views_count,
            'unique_views' => $views->filter(function ($view) {
                return $view->user_id !== null;
            })->count(),
            'anonymous_views' => $views->filter(function ($view) {
                return $view->user_id === null;
            })->count(),
            'views_today' => $views->filter(function ($view) {
                return $view->created_at->isToday();
            })->count(),
            'views_week' => $views->filter(function ($view) {
                return $view->created_at->isCurrentWeek();
            })->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Get user's view history
     */
    public function getMyViews(Request $request): JsonResponse
    {
        $user = Auth::user();

        $views = $user->views
            ->with(['ad' => function ($q) {
                $q->with(['user.profile', 'features', 'space']);
            }])
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $views,
        ]);
    }

    /**
     * Get ad view statistics for admin dashboard
     */
    public function getDashboardStatistics(): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin' && $user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'total_views' => View::count(),
            'today_views' => View::where('created_at', '>=', now()->startOfDay())->count(),
            'week_views' => View::where('created_at', '>=', now()->startOfWeek())->count(),
            'month_views' => View::where('created_at', '>=', now()->startOfMonth())->count(),
            'top_ads' => Ad::select('id', 'title', 'views_count')
                ->orderBy('views_count', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Clear old views (admin only)
     */
    public function clearOldViews(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'days' => 'required|integer|min:1',
        ]);

        $cutoffDate = now()->subDays($validated['days']);

        $deleted = View::where('created_at', '<', $cutoffDate)->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Deleted $deleted old views",
        ]);
    }
}
