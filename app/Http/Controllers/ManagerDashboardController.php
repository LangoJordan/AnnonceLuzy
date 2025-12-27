<?php

namespace App\Http\Controllers;

use App\Models\Ad;
use App\Models\Report;
use App\Models\User;
use App\Models\AgencySpace;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ManagerDashboardController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    /**
     * Get manager dashboard overview
     */
    public function overview(): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'pending_validations' => Ad::where('status', 'pending')->count(),
            'pending_reports' => Report::where('status', 'pending')->count(),
            'total_agencies' => User::where('user_type', 'agency')->count(),
            'new_users_today' => User::where('created_at', '>=', now()->startOfDay())->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Get pending ads for validation
     */
    public function getPendingAds(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $ads = Ad::where('status', 'pending')
            ->with(['user.profile', 'space', 'features'])
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $ads,
            'total_pending' => Ad::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Validate or reject an ad
     */
    public function validateAd(Request $request, $adId): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $ad = Ad::find($adId);

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
     * Get pending reports
     */
    public function getPendingReports(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $reports = Report::where('status', 'pending')
            ->with(['ad.user', 'user.profile'])
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $reports,
            'total_pending' => Report::where('status', 'pending')->count(),
        ]);
    }

    /**
     * Handle a report
     */
    public function handleReport(Request $request, $reportId): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $report = Report::find($reportId);

        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:resolved,dismissed',
            'notes' => 'nullable|string',
        ]);

        $report->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
        ]);

        if ($validated['status'] === 'resolved') {
            $report->ad->update(['status' => 'blocked']);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Report handled',
            'data' => $report,
        ]);
    }

    /**
     * Get agencies list
     */
    public function getAgencies(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $agencies = User::where('user_type', 'agency')
            ->with(['profile', 'agencySpaces', 'subscriptions'])
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $agencies,
        ]);
    }

    /**
     * Get agency details
     */
    public function getAgencyDetails($agencyId): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $agency = User::where('user_type', 'agency')
            ->with(['profile', 'agencySpaces', 'ads', 'subscriptions'])
            ->find($agencyId);

        if (!$agency) {
            return response()->json([
                'status' => 'error',
                'message' => 'Agency not found'
            ], 404);
        }

        $stats = [
            'total_ads' => $agency->ads()->count(),
            'active_ads' => $agency->ads()->where('status', 'valid')->count(),
            'total_spaces' => $agency->agencySpaces()->count(),
            'active_subscription' => $agency->subscriptions()
                ->wherePivot('status', 'active')
                ->where('user_subscriptions.end_date', '>', now())
                ->first(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $agency,
            'stats' => $stats,
        ]);
    }

    /**
     * Get moderation statistics
     */
    public function getModerationStats(): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'pending_ads' => Ad::where('status', 'pending')->count(),
            'pending_reports' => Report::where('status', 'pending')->count(),
            'today_validations' => Ad::where('status', '!=', 'pending')
                ->where('updated_at', '>=', now()->startOfDay())
                ->count(),
            'resolved_today' => Report::where('status', 'resolved')
                ->where('updated_at', '>=', now()->startOfDay())
                ->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }
}
