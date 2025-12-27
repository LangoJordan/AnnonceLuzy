<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\UserSubscription;
use App\Models\Transaction;
use App\Services\QuotaService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth')->except(['index', 'show']);
    // }

    /**
     * Get all available subscriptions
     */
    public function index(Request $request): JsonResponse
    {
        $subscriptions = Subscription::paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $subscriptions,
        ]);
    }

    /**
     * Get a specific subscription
     */
    public function show($id): JsonResponse
    {
        $subscription = Subscription::find($id);

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Subscription not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $subscription,
        ]);
    }

    /**
     * Create a new subscription (admin only)
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
            'max_ads' => 'required|integer|min:1',
            'duration_days' => 'required|integer|min:1',
        ]);

        $subscription = Subscription::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Subscription created successfully',
            'data' => $subscription,
        ], 201);
    }

    /**
     * Update a subscription (admin only)
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

        $subscription = Subscription::find($id);

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Subscription not found'
            ], 404);
        }

        $validated = $request->validate([
            'label' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|integer|min:1',
            'max_ads' => 'sometimes|required|integer|min:1',
            'duration_days' => 'sometimes|required|integer|min:1',
        ]);

        $subscription->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Subscription updated successfully',
            'data' => $subscription,
        ]);
    }

    /**
     * Delete a subscription (admin only)
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

        $subscription = Subscription::find($id);

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Subscription not found'
            ], 404);
        }

        $subscription->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Subscription deleted successfully',
        ]);
    }

    /**
     * Get user's active subscription
     */
    public function getActive(): JsonResponse
    {
        $user = Auth::user();

        $activeSubscription = $user->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->first();

        if (!$activeSubscription) {
            return response()->json([
                'status' => 'success',
                'data' => null,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $activeSubscription->id,
                'label' => $activeSubscription->label,
                'amount' => $activeSubscription->amount,
                'max_ads' => $activeSubscription->max_ads,
                'duration_days' => $activeSubscription->duration_days,
                'pivot' => [
                    'start_date' => $activeSubscription->pivot->start_date,
                    'end_date' => $activeSubscription->pivot->end_date,
                    'status' => $activeSubscription->pivot->status,
                ]
            ],
        ]);
    }

    /**
     * Get user's subscription history
     */
    public function getHistory(Request $request): JsonResponse
    {
        $user = Auth::user();

        $subscriptions = $user->subscriptions
            ->with('subscription')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $subscriptions,
        ]);
    }

    /**
     * Subscribe user to a subscription (requires payment)
     */
    public function subscribe(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
        ]);

        if ($user->user_type !== 'agency') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only agencies can subscribe'
            ], 403);
        }

        $subscription = Subscription::find($validated['subscription_id']);

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Subscription not found'
            ], 404);
        }

        $existingActive = $user->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->first();

        if ($existingActive) {
            return response()->json([
                'status' => 'error',
                'message' => 'User already has an active subscription'
            ], 409);
        }

        $startDate = now();
        $endDate = now()->addDays($subscription->duration_days);

        $user->subscriptions()->attach($subscription->id, [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Subscription request created. Awaiting payment confirmation.',
            'data' => [
                'subscription_id' => $subscription->id,
                'label' => $subscription->label,
                'amount' => $subscription->amount,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'duration_days' => $subscription->duration_days,
                'max_ads' => $subscription->max_ads,
            ]
        ]);
    }

    /**
     * Activate user subscription after payment
     */
    public function activate(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'transaction_id' => 'nullable|string',
        ]);

        $subscription = $user->subscriptions()
            ->where('subscription_id', $validated['subscription_id'])
            ->wherePivot('status', false)
            ->first();

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pending subscription not found'
            ], 404);
        }

        $user->subscriptions()->updateExistingPivot($subscription->id, [
            'status' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Subscription activated successfully',
            'data' => $subscription->load('pivot'),
        ]);
    }

    /**
     * Cancel user subscription
     */
    public function cancel(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
        ]);

        $subscription = $user->subscriptions()
            ->where('subscription_id', $validated['subscription_id'])
            ->wherePivot('status', true)
            ->first();

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Active subscription not found'
            ], 404);
        }

        $user->subscriptions()->updateExistingPivot($subscription->id, [
            'status' => false,
            'end_date' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Subscription cancelled successfully',
        ]);
    }

    /**
     * Get subscription statistics (admin only)
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
            'total_subscriptions' => Subscription::count(),
            'total_active' => UserSubscription::where('status', true)
                ->where('end_date', '>', now())
                ->count(),
            'total_pending' => UserSubscription::where('status', false)
                ->where('end_date', '>', now())
                ->count(),
            'total_expired' => UserSubscription::where('end_date', '<=', now())->count(),
            'total_revenue' => UserSubscription::where('status', true)
                ->where('end_date', '>', now())
                ->get()
                ->sum(function ($us) {
                    return $us->subscription->amount;
                }),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Purchase a subscription (with payment simulation)
     */
    public function purchase(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'agency') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only agencies can purchase subscriptions'
            ], 403);
        }

        $validated = $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'payment_method' => 'required|in:simulated',
            'card_number' => 'nullable|string',
            'card_holder' => 'nullable|string',
        ]);

        $subscription = Subscription::find($validated['subscription_id']);

        if (!$subscription) {
            return response()->json([
                'status' => 'error',
                'message' => 'Subscription not found'
            ], 404);
        }

        // Check if user already has an active subscription
        $existingActive = $user->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->first();

        if ($existingActive && $existingActive->id !== $subscription->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You already have an active subscription. Please cancel it first.'
            ], 409);
        }

        try {
            // Simulate payment processing
            $paymentResult = $this->simulatePayment($validated['payment_method'], $subscription->amount);

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
                'amount' => $subscription->amount,
                'mode' => 'simulated',
                'status' => 'success',
                'transaction_type' => 'subscription',
                'date' => now(),
            ]);

            // Create or update subscription for user
            $startDate = now();
            $endDate = now()->addDays($subscription->duration_days);

            // Check if there's a pending subscription that needs activation
            $pendingSubscription = $user->subscriptions()
                ->where('subscription_id', $subscription->id)
                ->wherePivot('status', false)
                ->first();

            if ($pendingSubscription) {
                // Update existing pending subscription
                $user->subscriptions()->updateExistingPivot($subscription->id, [
                    'status' => true,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]);
            } else {
                // Create new subscription
                $user->subscriptions()->attach($subscription->id, [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'status' => true,
                ]);
            }

            // Enforce quota limits for the new subscription
            // This will automatically deactivate surplus ads/spaces if the new subscription has lower limits
            $quotaService = new QuotaService();
            $quotaService->enforceQuotaDowngrade($user, $subscription);

            return response()->json([
                'status' => 'success',
                'message' => 'Subscription purchased and activated successfully',
                'data' => [
                    'transaction_id' => $transaction->id,
                    'subscription_id' => $subscription->id,
                    'label' => $subscription->label,
                    'amount' => $subscription->amount,
                    'start_date' => $startDate->format('Y-m-d'),
                    'end_date' => $endDate->format('Y-m-d'),
                    'duration_days' => $subscription->duration_days,
                    'max_ads' => $subscription->max_ads,
                    'max_spaces' => $subscription->max_spaces,
                    'status' => 'active',
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
