<?php

namespace App\Http\Controllers;

use App\Models\Boost;
use App\Models\Ad;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BoostController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth')->except(['index', 'show']);
    // }

    /**
     * Get all available boosts
     */
    public function index(Request $request): JsonResponse
    {
        $boosts = Boost::paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $boosts,
        ]);
    }

    /**
     * Get a specific boost
     */
    public function show($id): JsonResponse
    {
        $boost = Boost::find($id);

        if (!$boost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Boost not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $boost,
        ]);
    }

    /**
     * Create a new boost (admin only)
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'amount' => 'required|integer|min:1',
            'duration_days' => 'required|integer|min:1',
            'priority_level' => 'required|integer|min:1',
        ]);

        $boost = Boost::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Boost created successfully',
            'data' => $boost,
        ], 201);
    }

    /**
     * Update a boost (admin only)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $boost = Boost::find($id);

        if (!$boost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Boost not found'
            ], 404);
        }

        $validated = $request->validate([
            'label' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|integer|min:1',
            'duration_days' => 'sometimes|required|integer|min:1',
            'priority_level' => 'sometimes|required|integer|min:1',
        ]);

        $boost->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Boost updated successfully',
            'data' => $boost,
        ]);
    }

    /**
     * Delete a boost (admin only)
     */
    public function destroy($id): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $boost = Boost::find($id);

        if (!$boost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Boost not found'
            ], 404);
        }

        $boost->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Boost deleted successfully',
        ]);
    }

    /**
     * Apply a boost to an ad (requires payment)
     */
    public function applyToAd(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'ad_id' => 'required|exists:ads,id',
            'boost_id' => 'required|exists:boosts,id',
        ]);

        $ad = Ad::find($validated['ad_id']);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        if ($ad->user_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Not authorized to boost this ad'
            ], 403);
        }

        $boost = Boost::find($validated['boost_id']);

        if (!$boost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Boost not found'
            ], 404);
        }

        $existing = $ad->boosts()
            ->where('boost_id', $boost->id)
            ->wherePivot('active', true)
            ->where('ad_boosts.end_date', '>', now())
            ->first();

        if ($existing) {
            return response()->json([
                'status' => 'error',
                'message' => 'This boost is already active on this ad'
            ], 409);
        }

        $startDate = now();
        $endDate = now()->addDays($boost->duration_days);

        $ad->boosts()->attach($boost->id, [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'active' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Boost queued. Awaiting payment confirmation.',
            'data' => [
                'boost_id' => $boost->id,
                'ad_id' => $ad->id,
                'amount' => $boost->amount,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'duration_days' => $boost->duration_days,
            ]
        ]);
    }

    /**
     * Activate boost on ad after payment
     */
    public function activateBoost(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'ad_id' => 'required|exists:ads,id',
            'boost_id' => 'required|exists:boosts,id',
        ]);

        $ad = Ad::find($validated['ad_id']);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        if ($ad->user_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Not authorized'
            ], 403);
        }

        $boost = $ad->boosts()
            ->where('boost_id', $validated['boost_id'])
            ->wherePivot('active', false)
            ->first();

        if (!$boost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pending boost not found'
            ], 404);
        }

        $ad->boosts()->updateExistingPivot($boost->id, ['active' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Boost activated successfully',
        ]);
    }

    /**
     * Get active boosts for an ad
     */
    public function getAdBoosts($adId): JsonResponse
    {
        $ad = Ad::find($adId);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        $boosts = $ad->boosts()
            ->wherePivot('active', true)
            ->where('ad_boosts.end_date', '>', now())
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $boosts,
        ]);
    }

    /**
     * Get boost history for an ad
     */
    public function getAdBoostHistory($adId, Request $request): JsonResponse
    {
        $ad = Ad::find($adId);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        $boosts = $ad->boosts()
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $boosts,
        ]);
    }

    /**
     * Cancel an active boost
     */
    public function cancelBoost(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'ad_id' => 'required|exists:ads,id',
            'boost_id' => 'required|exists:boosts,id',
        ]);

        $ad = Ad::find($validated['ad_id']);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        if ($ad->user_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Not authorized'
            ], 403);
        }

        $boost = $ad->boosts()
            ->where('boost_id', $validated['boost_id'])
            ->wherePivot('active', true)
            ->first();

        if (!$boost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Active boost not found'
            ], 404);
        }

        $ad->boosts()->updateExistingPivot($boost->id, [
            'active' => false,
            'end_date' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Boost cancelled successfully',
        ]);
    }

    /**
     * Get boost statistics (admin only)
     */
    public function getStatistics(): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'total_boosts' => Boost::count(),
            'active_boosts' => DB::table('ad_boosts')
                ->where('active', true)
                ->where('end_date', '>', now())
                ->count(),
            'total_boost_revenue' => \DB::table('ad_boosts')
                ->where('active', true)
                ->join('boosts', 'ad_boosts.boost_id', '=', 'boosts.id')
                ->sum('boosts.amount'),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Purchase a boost for an ad (with payment simulation)
     */
    public function purchase(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user || ($user->user_type !== 'agency' && $user->user_type !== 'employee')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'ad_id' => 'required|exists:ads,id',
            'boost_id' => 'required|exists:boosts,id',
            'payment_method' => 'required|in:simulated',
            'card_number' => 'nullable|string',
            'card_holder' => 'nullable|string',
        ]);

        $ad = Ad::find($validated['ad_id']);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        // Check authorization
        $isOwner = false;
        if ($user->user_type === 'agency') {
            $isOwner = $ad->user_id === $user->id;
        } elseif ($user->user_type === 'employee') {
            $isOwner = $ad->space_id && \App\Models\EmployeePosition::where('user_id', $user->id)
                ->where('space_id', $ad->space_id)
                ->exists();
        }

        if (!$isOwner) {
            return response()->json([
                'status' => 'error',
                'message' => 'Not authorized to boost this ad'
            ], 403);
        }

        $boost = Boost::find($validated['boost_id']);

        if (!$boost) {
            return response()->json([
                'status' => 'error',
                'message' => 'Boost not found'
            ], 404);
        }

        // Check for existing active boost
        $existingActive = $ad->boosts()
            ->where('boost_id', $boost->id)
            ->wherePivot('active', true)
            ->where('ad_boosts.end_date', '>', now())
            ->first();

        if ($existingActive) {
            return response()->json([
                'status' => 'error',
                'message' => 'This boost is already active on this ad'
            ], 409);
        }

        try {
            // Simulate payment processing
            $paymentResult = $this->simulatePayment($validated['payment_method'], $boost->amount);

            if (!$paymentResult['success']) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment failed: ' . $paymentResult['message']
                ], 402);
            }

            // Create transaction record
            $transaction = Transaction::create([
                'sender_id' => $user->id,
                'receiver_id' => null,
                'amount' => $boost->amount,
                'mode' => 'simulated',
                'status' => 'success',
                'transaction_type' => 'boost',
                'date' => now(),
            ]);

            // Apply and activate the boost
            $startDate = now();
            $endDate = now()->addDays($boost->duration_days);

            $ad->boosts()->attach($boost->id, [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'active' => true,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Boost purchased and activated successfully',
                'data' => [
                    'transaction_id' => $transaction->id,
                    'boost_id' => $boost->id,
                    'ad_id' => $ad->id,
                    'amount' => $boost->amount,
                    'start_date' => $startDate->format('Y-m-d H:i:s'),
                    'end_date' => $endDate->format('Y-m-d H:i:s'),
                    'duration_days' => $boost->duration_days,
                    'status' => 'activated',
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Payment processing failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Simulate payment processing
     */
    private function simulatePayment(string $method, float $amount): array
    {
        // Simulate payment processing with 95% success rate
        $randomValue = rand(1, 100);

        if ($randomValue > 95) {
            return [
                'success' => false,
                'message' => 'Simulated payment declined',
                'code' => 'PAYMENT_DECLINED'
            ];
        }

        // Simulate processing delay
        usleep(100000); // 100ms delay

        return [
            'success' => true,
            'message' => 'Payment processed successfully',
            'reference_id' => 'SIM-' . uniqid(),
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
