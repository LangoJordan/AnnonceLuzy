<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth')->except(['show']);
    // }

    /**
     * Get authenticated user with profile and subscriptions
     */
    public function me(): JsonResponse
    {
        $user = Auth::user()->load(['profile', 'subscriptions', 'agencySpaces']);

        return response()->json([
            'status' => 'success',
            'data' => $user,
        ]);
    }

    /**
     * Search for users to assign as employees
     * Agencies can search for existing users to assign as employees
     */
    public function search(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Only agencies can search for employees
        if ($user->user_type !== 'agency' && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ]);
        }

        $users = User::where(function ($q) use ($query) {
            $q->where('name', 'like', '%' . $query . '%')
              ->orWhere('email', 'like', '%' . $query . '%');
        })
        ->where('user_type', '!=', 'admin') // Don't assign admins as employees
        ->where('status', true) // Only active users
        ->limit(10)
        ->get([
            'id',
            'name',
            'email',
            'phone',
            'user_type',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $users->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'phone' => $u->phone,
                    'user_type' => $u->user_type,
                ];
            }),
        ]);
    }

    /**
     * Get a specific user profile (public view)
     */
    public function show($id): JsonResponse
    {
        $user = User::with(['profile', 'ads' => function ($q) {
            $q->where('status', 'valid')->limit(10);
        }])->find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $user,
                'is_agency' => $user->user_type === 'agency',
                'total_ads' => $user->ads()->where('status', 'valid')->count(),
            ]
        ]);
    }

    /**
     * Update user profile information
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'country_id' => 'nullable|exists:countries,id',
            'city_id' => 'nullable|exists:cities,id',
            'address' => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => $user->load(['profile', 'country', 'city']),
        ]);
    }

    /**
     * Update user password
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password updated successfully',
        ]);
    }

    /**
     * Get all users (admin only)
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $query = User::with(['profile', 'subscriptions']);

        if ($request->has('type')) {
            $query->where('user_type', $request->type);
        }

        if ($request->has('status') !== null) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $users,
        ]);
    }

    /**
     * Update user status (admin only)
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $admin = Auth::user();

        if ($admin->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|boolean',
            'reason' => 'nullable|string',
        ]);

        $user->update(['status' => $validated['status']]);

        return response()->json([
            'status' => 'success',
            'message' => 'User status updated',
            'data' => $user,
        ]);
    }

    /**
     * Change user type (admin only)
     */
    public function changeType(Request $request, $id): JsonResponse
    {
        $admin = Auth::user();

        if ($admin->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        $validated = $request->validate([
            'user_type' => 'required|in:visitor,agency,employee,admin,manager',
        ]);

        $user->update(['user_type' => $validated['user_type']]);

        return response()->json([
            'status' => 'success',
            'message' => 'User type updated',
            'data' => $user,
        ]);
    }

    /**
     * Create a new manager (admin only)
     */
    public function createManager(Request $request): JsonResponse
    {
        $admin = Auth::user();

        if ($admin->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
            'phone' => 'nullable|string|max:20',
            'country_id' => 'nullable|exists:countries,id',
            'city_id' => 'nullable|exists:cities,id',
            'address' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'country_id' => $validated['country_id'] ?? null,
            'city_id' => $validated['city_id'] ?? null,
            'address' => $validated['address'] ?? null,
            'user_type' => 'manager',
            'status' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Manager created successfully',
            'data' => $user->load(['country', 'city']),
        ], 201);
    }

    /**
     * Get user statistics (admin/manager)
     */
    public function getStatistics(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'total_users' => User::count(),
            'total_visitors' => User::where('user_type', 'visitor')->count(),
            'total_agencies' => User::where('user_type', 'agency')->count(),
            'total_active_users' => User::where('status', true)->count(),
            'total_inactive_users' => User::where('status', false)->count(),
            'new_users_today' => User::where('created_at', '>=', now()->startOfDay())->count(),
            'new_users_week' => User::where('created_at', '>=', now()->startOfWeek())->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Delete user account (admin only or self)
     */
    public function destroy(Request $request, $id = null): JsonResponse
    {
        $user = Auth::user();
        $targetUser = $id ? User::find($id) : $user;

        if (!$targetUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        if ($targetUser->id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($targetUser->user_type === 'admin' && $targetUser->id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete admin users'
            ], 403);
        }

        $targetUser->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User deleted successfully',
        ]);
    }
}
