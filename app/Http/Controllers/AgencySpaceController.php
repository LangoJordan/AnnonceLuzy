<?php

namespace App\Http\Controllers;

use App\Models\AgencySpace;
use App\Models\User;
use App\Services\QuotaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AgencySpaceController extends Controller
{
    

    /**
     * Get all agency spaces
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        $query = AgencySpace::with(['agency', 'ads', 'employeePositions']);

        if ($user->user_type === 'agency') {
            $query->where('agency_id', $user->id);
        } elseif ($user->user_type !== 'admin' && $user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        if ($request->has('agency_id')) {
            $query->where('agency_id', $request->agency_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $spaces = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $spaces,
        ]);
    }

    /**
     * Get a specific agency space
     */
    public function show($id): JsonResponse
    {
        $user = Auth::user();
        $space = AgencySpace::with(['agency', 'ads', 'employeePositions.user'])->find($id);

        if (!$space) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agency space not found'
            ], 404);
        }

        if ($space->agency_id !== $user->id && $user->user_type !== 'admin' && $user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $space,
            'stats' => [
                'total_ads' => $space->ads()->count(),
                'active_ads' => $space->ads()->where('status', 'valid')->count(),
                'pending_ads' => $space->ads()->where('status', 'pending')->count(),
                'employees' => $space->employeePositions()->count(),
            ]
        ]);
    }

    /**
     * Create a new agency space (agency only)
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'agency') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only agencies can create spaces'
            ], 403);
        }

        // Check subscription and space quota
        $quotaService = new QuotaService();
        $activeSubscription = $quotaService->getActiveSubscription($user);

        if (!$activeSubscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Active subscription required to create spaces'
            ], 403);
        }

        if (!$quotaService->canCreateSpace($user)) {
            $remaining = $quotaService->getSpaceQuotaRemaining($user);
            return response()->json([
                'status' => 'error',
                'message' => "Maximum spaces limit reached for your subscription. You can have a maximum of {$activeSubscription->max_spaces} spaces.",
                'remaining_quota' => $remaining,
                'max_quota' => $activeSubscription->max_spaces,
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'country_id' => 'required|exists:countries,id',
            'city_id' => 'required|exists:cities,id',
            'address' => 'required|string|max:255',
            'merchant_code' => 'nullable|string|max:255',
        ]);

        if (empty($validated['merchant_code'])) {
            $merchantCode = strtoupper(Str::random(10));
            while (AgencySpace::where('merchant_code', $merchantCode)->exists()) {
                $merchantCode = strtoupper(Str::random(10));
            }
            $validated['merchant_code'] = $merchantCode;
        } else {
            if (AgencySpace::where('merchant_code', $validated['merchant_code'])
                ->where('id', '!=', $request->route('id'))
                ->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This merchant code is already in use'
                ], 409);
            }
        }

        $space = AgencySpace::create([
            'agency_id' => $user->id,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'country_id' => $validated['country_id'],
            'city_id' => $validated['city_id'],
            'address' => $validated['address'],
            'merchant_code' => $validated['merchant_code'],
            'status' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Agency space created successfully',
            'data' => $space->load(['country', 'city']),
        ], 201);
    }

    /**
     * Update an agency space
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = Auth::user();
        $space = AgencySpace::find($id);

        if (!$space) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agency space not found'
            ], 404);
        }

        if ($space->agency_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'country_id' => 'sometimes|required|exists:countries,id',
            'city_id' => 'sometimes|required|exists:cities,id',
            'address' => 'sometimes|required|string|max:255',
            'merchant_code' => 'nullable|string|max:255',
            'status' => 'nullable|boolean',
        ]);

        if (isset($validated['merchant_code']) && !empty($validated['merchant_code'])) {
            if (AgencySpace::where('merchant_code', $validated['merchant_code'])
                ->where('id', '!=', $space->id)
                ->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This merchant code is already in use'
                ], 409);
            }
        }

        $space->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Agency space updated successfully',
            'data' => $space->load(['country', 'city']),
        ]);
    }

    /**
     * Delete an agency space
     */
    public function destroy($id): JsonResponse
    {
        $user = Auth::user();
        $space = AgencySpace::find($id);

        if (!$space) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agency space not found'
            ], 404);
        }

        if ($space->agency_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $space->ads()->delete();
        $space->employeePositions()->delete();
        $space->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Agency space deleted successfully',
        ]);
    }

    /**
     * Get spaces by agency
     */
    public function getByAgency($agencyId): JsonResponse
    {
        $spaces = AgencySpace::with('ads')
            ->where('agency_id', $agencyId)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $spaces,
        ]);
    }

    /**
     * Regenerate merchant code
     */
    public function regenerateMerchantCode($id): JsonResponse
    {
        $user = Auth::user();
        $space = AgencySpace::find($id);

        if (!$space) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agency space not found'
            ], 404);
        }

        if ($space->agency_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $merchantCode = strtoupper(Str::random(10));

        while (AgencySpace::where('merchant_code', $merchantCode)->exists()) {
            $merchantCode = strtoupper(Str::random(10));
        }

        $space->update(['merchant_code' => $merchantCode]);

        return response()->json([
            'status' => 'success',
            'message' => 'Merchant code regenerated',
            'data' => $space,
        ]);
    }

    /**
     * Get space statistics
     */
    public function getStatistics($id): JsonResponse
    {
        $user = Auth::user();
        $space = AgencySpace::find($id);

        if (!$space) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agency space not found'
            ], 404);
        }

        if ($space->agency_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $ads = $space->ads()->get();

        $stats = [
            'total_ads' => $ads->count(),
            'active_ads' => $ads->where('status', 'valid')->count(),
            'pending_ads' => $ads->where('status', 'pending')->count(),
            'blocked_ads' => $ads->where('status', 'blocked')->count(),
            'total_views' => $ads->sum('views_count'),
            'total_favorites' => $ads->sum(function ($ad) {
                return $ad->favorites()->count();
            }),
            'total_contacts' => $ads->sum(function ($ad) {
                return $ad->contacts()->count();
            }),
            'employees' => $space->employeePositions()->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Reactivate a space from inactive if quota allows
     */
    public function reactivate($id): JsonResponse
    {
        $user = Auth::user();
        $space = AgencySpace::find($id);

        if (!$space) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agency space not found'
            ], 404);
        }

        if ($space->agency_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Not authorized to reactivate this space'
            ], 403);
        }

        if ($space->status !== false) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only inactive spaces can be reactivated'
            ], 400);
        }

        $quotaService = new QuotaService();

        // Check if agency has active subscription
        $activeSubscription = $quotaService->getActiveSubscription($user);
        if (!$activeSubscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Active subscription required to reactivate spaces'
            ], 403);
        }

        // Check if quota allows
        if (!$quotaService->canCreateSpace($user)) {
            $remaining = $quotaService->getSpaceQuotaRemaining($user);
            return response()->json([
                'status' => 'error',
                'message' => "Cannot reactivate space. You have reached your quota of {$activeSubscription->max_spaces} active spaces.",
                'remaining_quota' => $remaining,
                'max_quota' => $activeSubscription->max_spaces,
            ], 403);
        }

        // Reactivate space
        $space->update(['status' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Space reactivated successfully',
            'data' => $space->load(['country', 'city']),
        ]);
    }
}
