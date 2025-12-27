<?php

namespace App\Http\Controllers;

use App\Models\AdFeature;
use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AdFeatureController extends Controller
{
   

    /**
     * Get all features for an ad
     */
    public function index($adId, Request $request): JsonResponse
    {
        $ad = Ad::find($adId);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        $features = $ad->features()
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $features,
        ]);
    }

    /**
     * Get a specific ad feature
     */
    public function show($adId, $featureId): JsonResponse
    {
        $ad = Ad::find($adId);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        $feature = AdFeature::where('ad_id', $adId)
            ->find($featureId);

        if (!$feature) {
            return response()->json([
                'status' => 'error',
                'message' => 'Feature not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $feature,
        ]);
    }

    /**
     * Create a new ad feature
     */
    public function store($adId, Request $request): JsonResponse
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
                'message' => 'Not authorized to add features to this ad'
            ], 403);
        }

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('ad-features', 'public');
        }

        $feature = AdFeature::create([
            'ad_id' => $ad->id,
            'label' => $validated['label'],
            'photo' => $photoPath,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Feature added successfully',
            'data' => $feature,
        ], 201);
    }

    /**
     * Update an ad feature
     */
    public function update($adId, $featureId, Request $request): JsonResponse
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
                'message' => 'Not authorized to update features for this ad'
            ], 403);
        }

        $feature = AdFeature::where('ad_id', $adId)->find($featureId);

        if (!$feature) {
            return response()->json([
                'status' => 'error',
                'message' => 'Feature not found'
            ], 404);
        }

        $validated = $request->validate([
            'label' => 'sometimes|required|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->hasFile('photo')) {
            if ($feature->photo && Storage::disk('public')->exists($feature->photo)) {
                Storage::disk('public')->delete($feature->photo);
            }
            $validated['photo'] = $request->file('photo')->store('ad-features', 'public');
        }

        $feature->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Feature updated successfully',
            'data' => $feature,
        ]);
    }

    /**
     * Delete an ad feature
     */
    public function destroy($adId, $featureId): JsonResponse
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
                'message' => 'Not authorized to delete features for this ad'
            ], 403);
        }

        $feature = AdFeature::where('ad_id', $adId)->find($featureId);

        if (!$feature) {
            return response()->json([
                'status' => 'error',
                'message' => 'Feature not found'
            ], 404);
        }

        if ($feature->photo && Storage::disk('public')->exists($feature->photo)) {
            Storage::disk('public')->delete($feature->photo);
        }

        $feature->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Feature deleted successfully',
        ]);
    }
}
