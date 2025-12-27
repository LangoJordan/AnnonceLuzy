<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use App\Models\AgencySpace;
use App\Services\QuotaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;


class AdController extends Controller
{
   

    /**
     * List all ads with pagination and filtering
     */
    public function index(Request $request): JsonResponse
    {
        $query = Ad::with(['user', 'space', 'features', 'boosts'])
                    ->where('status', 'valid');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'recent':
                    $query->latest();
                    break;
                case 'views':
                    $query->orderBy('views_count', 'desc');
                    break;
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                default:
                    $query->latest();
            }
        } else {
            $query->latest();
        }

        $ads = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $ads,
            'pagination' => [
                'current_page' => $ads->currentPage(),
                'total' => $ads->total(),
                'per_page' => $ads->perPage(),
                'last_page' => $ads->lastPage(),
            ]
        ]);
    }

    /**
     * Get a specific ad with all relations
     */
    public function show($id): JsonResponse
    {
        $ad = Ad::with(['user.profile', 'space', 'features', 'boosts', 'favorites', 'contacts', 'reports'])
                ->find($id);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        $ad->increment('views_count');

        if (Auth::check()) {
            \App\Models\View::firstOrCreate([
                'ad_id' => $ad->id,
                'user_id' => Auth::id(),
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $ad,
            'is_favorite' => Auth::check() ? Auth::user()->favorites->where('ad_id', $ad->id)->exists() : false,
        ]);
    }

    /**
     * Search ads by title, description, and category
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        $ads = Ad::with(['user.profile', 'space', 'features'])
                ->where('status', 'valid')
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', '%' . $query . '%')
                      ->orWhere('description', 'like', '%' . $query . '%')
                      ->orWhere('category', 'like', '%' . $query . '%');
                })
                ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $ads,
        ]);
    }

    /**
     * Create a new ad (requires auth and active subscription for agencies)
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Authentication required'
            ], 401);
        }

        if ($user->user_type === 'agency') {
            $quotaService = new QuotaService();
            $activeSubscription = $quotaService->getActiveSubscription($user);

            if (!$activeSubscription) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Active subscription required to create ads'
                ], 403);
            }

            if (!$quotaService->canCreateAd($user)) {
                $remaining = $quotaService->getAdQuotaRemaining($user);
                return response()->json([
                    'status' => 'error',
                    'message' => "Maximum ads limit reached for your subscription. You can have a maximum of {$activeSubscription->max_ads} active ads.",
                    'remaining_quota' => $remaining,
                    'max_quota' => $activeSubscription->max_ads,
                ], 403);
            }
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'price' => 'nullable|integer|min:0',
            'price_description' => 'nullable|string|max:100',
            'country_id' => 'required|exists:countries,id',
            'city_id' => 'required|exists:cities,id',
            'address' => 'nullable|string|max:255',
            'main_photo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'space_id' => 'nullable|exists:agency_spaces,id',
        ]);

        if ($validated['space_id']) {
            $space = AgencySpace::find($validated['space_id']);
            if ($space->agency_id !== $user->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Not authorized to use this space'
                ], 403);
            }
        }

        $photoPath = $request->file('main_photo')->store('ads', 'public');

        $ad = Ad::create([
            'user_id' => $user->id,
            'space_id' => $validated['space_id'] ?? null,
            'country_id' => $validated['country_id'],
            'city_id' => $validated['city_id'],
            'address' => $validated['address'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'price' => $validated['price'] ?? 0,
            'price_description' => $validated['price_description'],
            'main_photo' => $photoPath,
            'status' => $user->user_type === 'admin' ? 'valid' : 'pending',
            'views_count' => 0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Ad created successfully',
            'data' => $ad->load(['user.profile', 'space', 'country', 'city']),
        ], 201);
    }

    /**
     * Update an existing ad
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = Auth::user();
        $ad = Ad::find($id);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        if ($ad->user_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Not authorized to update this ad'
            ], 403);
        }

        $rules = [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|max:100',
            'price' => 'nullable|integer|min:0',
            'price_description' => 'nullable|string|max:100',
            'country_id' => 'sometimes|required|exists:countries,id',
            'city_id' => 'sometimes|required|exists:cities,id',
            'address' => 'nullable|string|max:255',
            'main_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ];

        if ($user->user_type === 'admin') {
            $rules['status'] = 'nullable|in:valid,blocked,pending';
        }

        $validated = $request->validate($rules);

        if ($request->hasFile('main_photo')) {
            if ($ad->main_photo && Storage::disk('public')->exists($ad->main_photo)) {
                Storage::disk('public')->delete($ad->main_photo);
            }
            $validated['main_photo'] = $request->file('main_photo')->store('ads', 'public');
        }

        $ad->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Ad updated successfully',
            'data' => $ad->load(['user.profile', 'space', 'country', 'city']),
        ]);
    }

    /**
     * Delete an ad
     */
    public function destroy($id): JsonResponse
    {
        $user = Auth::user();
        $ad = Ad::find($id);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        if ($ad->user_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Not authorized to delete this ad'
            ], 403);
        }

        if ($ad->main_photo && Storage::disk('public')->exists($ad->main_photo)) {
            Storage::disk('public')->delete($ad->main_photo);
        }

        $ad->features()->delete();
        $ad->boosts()->detach();
        $ad->favorites()->delete();
        $ad->views()->delete();
        $ad->contacts()->delete();
        $ad->reports()->delete();

        $ad->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Ad deleted successfully',
        ]);
    }

    /**
     * Get ads by category with count
     */
    public function getCategories(): JsonResponse
    {
        $categories = Ad::where('status', 'valid')
            ->select('category')
            ->distinct()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $categories,
        ]);
    }

    /**
     * Get pending ads for validation (admin/manager only)
     */
    public function getPending(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $ads = Ad::with(['user.profile', 'space'])
                ->where('status', 'pending')
                ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $ads,
        ]);
    }

    /**
     * Validate or reject a pending ad (admin/manager)
     */
    public function validate(Request $request, $id): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $ad = Ad::find($id);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:valid,blocked',
            'reason' => 'nullable|string',
        ]);

        $ad->update(['status' => $validated['status']]);

        return response()->json([
            'status' => 'success',
            'message' => 'Ad status updated',
            'data' => $ad,
        ]);
    }

    /**
     * Get user's own ads
     */
    public function myAds(Request $request): JsonResponse
    {
        $user = Auth::user();
        $ads = $user->ads
                ->with(['features', 'boosts', 'favorites', 'views'])
                ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $ads,
        ]);
    }

    /**
     * Reactivate an ad from trash if quota allows
     */
    public function reactivate($id): JsonResponse
    {
        $user = Auth::user();
        $ad = Ad::find($id);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        if ($ad->user_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Not authorized to reactivate this ad'
            ], 403);
        }

        if ($ad->status !== 'trash') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only ads in trash can be reactivated'
            ], 400);
        }

        $quotaService = new QuotaService();

        // Check if user has active subscription
        $activeSubscription = $quotaService->getActiveSubscription($user);
        if (!$activeSubscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Active subscription required to reactivate ads'
            ], 403);
        }

        // Check if quota allows
        if (!$quotaService->canCreateAd($user)) {
            $remaining = $quotaService->getAdQuotaRemaining($user);
            return response()->json([
                'status' => 'error',
                'message' => "Cannot reactivate ad. You have reached your quota of {$activeSubscription->max_ads} active ads.",
                'remaining_quota' => $remaining,
                'max_quota' => $activeSubscription->max_ads,
            ], 403);
        }

        // Reactivate ad
        $ad->update(['status' => 'pending']);

        return response()->json([
            'status' => 'success',
            'message' => 'Ad reactivated successfully',
            'data' => $ad->load(['user.profile', 'space', 'country', 'city']),
        ]);
    }
}
