<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    /**
     * Get user's favorite ads
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        $favorites = $user->favorites
            ->with(['ad' => function ($q) {
                $q->with(['user.profile', 'features', 'space']);
            }])
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $favorites,
            'count' => $user->favorites->count(),
        ]);
    }

    /**
     * Get specific favorite
     */
    public function show($id): JsonResponse
    {
        $user = Auth::user();
        $favorite = Favorite::where('user_id', $user->id)
            ->with(['ad' => function ($q) {
                $q->with(['user.profile', 'features', 'space']);
            }])
            ->find($id);

        if (!$favorite) {
            return response()->json([
                'status' => 'error',
                'message' => 'Favorite not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $favorite,
        ]);
    }

    /**
     * Add ad to favorites
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        // If user is not authenticated, return 401
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated',
            ], 401);
        }

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

        $existing = Favorite::where('user_id', $user->id)
            ->where('ad_id', $ad->id)
            ->first();

        if ($existing) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad already in favorites'
            ], 409);
        }

        $favorite = Favorite::create([
            'user_id' => $user->id,
            'ad_id' => $ad->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Ad added to favorites',
            'data' => $favorite,
        ], 201);
    }

    /**
     * Remove ad from favorites
     */
    public function destroy($id): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated',
            ], 401);
        }

        $favorite = Favorite::where('user_id', $user->id)->find($id);

        if (!$favorite) {
            return response()->json([
                'status' => 'error',
                'message' => 'Favorite not found'
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Ad removed from favorites',
        ]);
    }

    /**
     * Check if ad is favorited
     */
    public function checkFavorite($adId): JsonResponse
    {
        $user = Auth::user();

        $isFavorite = Favorite::where('user_id', $user->id)
            ->where('ad_id', $adId)
            ->exists();

        return response()->json([
            'status' => 'success',
            'is_favorite' => $isFavorite,
        ]);
    }

    /**
     * Remove favorite by ad id
     */
    public function removeByAdId($adId): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated',
            ], 401);
        }

        $favorite = Favorite::where('user_id', $user->id)
            ->where('ad_id', $adId)
            ->first();

        if (!$favorite) {
            return response()->json([
                'status' => 'error',
                'message' => 'Favorite not found'
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Ad removed from favorites',
        ]);
    }

    /**
     * Get favorite count for an ad
     */
    public function getAdFavoriteCount($adId): JsonResponse
    {
        $count = Favorite::where('ad_id', $adId)->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'ad_id' => $adId,
                'count' => $count,
            ]
        ]);
    }

    /**
     * Get ads favorited by user
     */
    public function getAds(Request $request): JsonResponse
    {
        $user = Auth::user();

        $ads = Ad::whereIn('id', function ($q) use ($user) {
            $q->select('ad_id')->from('favorites')->where('user_id', $user->id);
        })
        ->with(['user.profile', 'features', 'space'])
        ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $ads,
        ]);
    }

    /**
     * Store a favorite via web route (for Inertia)
     */
    public function storeWeb(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'ad_id' => 'required|integer|exists:ads,id',
        ]);

        $ad = Ad::find($validated['ad_id']);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        $existing = Favorite::where('user_id', $user->id)
            ->where('ad_id', $ad->id)
            ->first();

        if ($existing) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad already in favorites'
            ], 409);
        }

        $favorite = Favorite::create([
            'user_id' => $user->id,
            'ad_id' => $ad->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Ad added to favorites',
            'data' => $favorite,
        ], 201);
    }

    /**
     * Remove a favorite via web route (for Inertia)
     */
    public function removeWeb($adId): JsonResponse
    {
        $user = Auth::user();

        $favorite = Favorite::where('user_id', $user->id)
            ->where('ad_id', $adId)
            ->first();

        if (!$favorite) {
            return response()->json([
                'status' => 'error',
                'message' => 'Favorite not found'
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Ad removed from favorites',
        ]);
    }
}
