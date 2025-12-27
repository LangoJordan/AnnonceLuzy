<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
   

    /**
     * Get the authenticated user's profile
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Profile not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $profile,
        ]);
    }

    /**
     * Get a specific user's profile (public)
     */
    public function show($id): JsonResponse
    {
        $profile = Profile::with('user')->find($id);

        if (!$profile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Profile not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $profile,
        ]);
    }

    /**
     * Create a new profile for authenticated user
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->profile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Profile already exists. Use update method instead.',
            ], 400);
        }

        $validated = $request->validate([
            'description' => 'nullable|string|max:1000',
            'slogan' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('profiles', 'public');
        }

        $profile = Profile::create([
            'user_id' => $user->id,
            'description' => $validated['description'] ?? null,
            'slogan' => $validated['slogan'] ?? null,
            'photo' => $photoPath,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile created successfully',
            'data' => $profile,
        ], 201);
    }

    /**
     * Update the authenticated user's profile
     */
    public function update(Request $request): JsonResponse
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Profile not found. Create one first.',
            ], 404);
        }

        $validated = $request->validate([
            'description' => 'nullable|string|max:1000',
            'slogan' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($request->hasFile('photo')) {
            if ($profile->photo && Storage::disk('public')->exists($profile->photo)) {
                Storage::disk('public')->delete($profile->photo);
            }
            $validated['photo'] = $request->file('photo')->store('profiles', 'public');
        }

        $profile->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => $profile,
        ]);
    }

    /**
     * Delete the authenticated user's profile (restore to default)
     */
    public function destroy(): JsonResponse
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Profile not found',
            ], 404);
        }

        if ($profile->photo && Storage::disk('public')->exists($profile->photo)) {
            Storage::disk('public')->delete($profile->photo);
        }

        $profile->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Profile deleted successfully',
        ]);
    }

    /**
     * Get user by profile (reverse lookup)
     */
    public function getByUser($userId): JsonResponse
    {
        $profile = Profile::where('user_id', $userId)->first();

        if (!$profile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Profile not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $profile,
        ]);
    }
}
