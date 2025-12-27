<?php

namespace App\Http\Controllers;

use App\Models\EmployeePosition;
use App\Models\AgencySpace;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class EmployeePositionController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    /**
     * Get all employee positions
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        $query = EmployeePosition::with(['user', 'space']);

        if ($user->user_type === 'agency') {
            $spaceIds = AgencySpace::where('agency_id', $user->id)->pluck('id');
            $query->whereIn('space_id', $spaceIds);
        } elseif ($user->user_type !== 'admin' && $user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($request->has('space_id')) {
            $query->where('space_id', $request->space_id);
        }

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $positions = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $positions,
        ]);
    }

    /**
     * Get a specific employee position
     */
    public function show($id): JsonResponse
    {
        $user = Auth::user();
        $position = EmployeePosition::with(['user', 'space'])->find($id);

        if (!$position) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee position not found'
            ], 404);
        }

        $space = $position->space;
        if ($space->agency_id !== $user->id && $user->user_type !== 'admin' && $user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $position,
        ]);
    }

    /**
     * Create a new employee (user + position assignment)
     * This endpoint creates a new user account and assigns them to one or more spaces
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'agency' && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:employee,commercial,manager',
            'space_ids' => 'required|array|min:1',
            'space_ids.*' => 'exists:agency_spaces,id',
        ]);

        // Check authorization for all spaces
        foreach ($validated['space_ids'] as $spaceId) {
            $space = AgencySpace::find($spaceId);
            if ($space->agency_id !== $user->id && $user->user_type !== 'admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Not authorized to assign employees to space: ' . $space->name
                ], 403);
            }
        }

        try {
            // Create the user
            $newUser = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'user_type' => 'employee',
                'status' => true,
            ]);

            // Assign to spaces
            $positions = [];
            foreach ($validated['space_ids'] as $spaceId) {
                $position = EmployeePosition::create([
                    'user_id' => $newUser->id,
                    'space_id' => $spaceId,
                    'role' => $validated['role'],
                ]);
                $positions[] = $position;
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Employee created and assigned successfully',
                'data' => [
                    'user' => $newUser,
                    'positions' => $positions,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create employee: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update employee position
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = Auth::user();
        $position = EmployeePosition::find($id);

        if (!$position) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee position not found'
            ], 404);
        }

        $space = $position->space;
        if ($space->agency_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'role' => 'required|string|in:manager,sales,support,viewer',
        ]);

        $position->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Employee position updated successfully',
            'data' => $position->load(['user', 'space']),
        ]);
    }

    /**
     * Remove employee from position
     */
    public function destroy($id): JsonResponse
    {
        $user = Auth::user();
        $position = EmployeePosition::find($id);

        if (!$position) {
            return response()->json([
                'status' => 'error',
                'message' => 'Employee position not found'
            ], 404);
        }

        $space = $position->space;
        if ($space->agency_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $position->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Employee removed successfully',
        ]);
    }

    /**
     * Get employees by space
     */
    public function getBySpace($spaceId): JsonResponse
    {
        $space = AgencySpace::find($spaceId);

        if (!$space) {
            return response()->json([
                'status' => 'error',
                'message' => 'Space not found'
            ], 404);
        }

        $positions = EmployeePosition::with('user')
            ->where('space_id', $spaceId)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $positions,
        ]);
    }

    /**
     * Get my agency employees
     */
    public function myEmployees(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'agency') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $spaceIds = AgencySpace::where('agency_id', $user->id)->pluck('id');

        $positions = EmployeePosition::with(['user', 'space'])
            ->whereIn('space_id', $spaceIds)
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $positions,
        ]);
    }
}
