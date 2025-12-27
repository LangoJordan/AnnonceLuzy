<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    /**
     * Get all reports (admin/manager only)
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $query = Report::with(['ad', 'user.profile']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('reason')) {
            $query->where('reason', 'like', '%' . $request->reason . '%');
        }

        $reports = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $reports,
        ]);
    }

    /**
     * Get a specific report
     */
    public function show($id): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $report = Report::with(['ad', 'user.profile'])->find($id);

        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $report,
        ]);
    }

    /**
     * Report an ad
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'ad_id' => 'required|exists:ads,id',
            'reason' => 'required|string|max:5000',
            'user_id' => 'nullable|integer',
        ]);

        $ad = Ad::find($validated['ad_id']);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        $userId = $validated['user_id'] ?? ($user?->id ?? 0);

        if ($userId !== 0) {
            $existing = Report::where('ad_id', $ad->id)
                ->where('user_id', $userId)
                ->where('created_at', '>=', now()->subDays(7))
                ->first();

            if ($existing) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You have already reported this ad recently'
                ], 409);
            }
        }

        $report = Report::create([
            'ad_id' => $ad->id,
            'user_id' => $userId,
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Report submitted successfully',
            'data' => $report,
        ], 201);
    }

    /**
     * Update report status (admin/manager only)
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $report = Report::find($id);

        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,resolved,dismissed',
            'notes' => 'nullable|string|max:1000',
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
            'message' => 'Report status updated',
            'data' => $report,
        ]);
    }

    /**
     * Get reports for an ad
     */
    public function getAdReports($adId, Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!in_array($user->user_type, ['admin', 'manager'])) {
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

        $reports = $ad->reports()
            ->with('user.profile')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $reports,
            'total_reports' => $ad->reports()->count(),
        ]);
    }

    /**
     * Get user's submitted reports
     */
    public function getMyReports(Request $request): JsonResponse
    {
        $user = Auth::user();

        $reports = $user->reports
            ->with(['ad' => function ($q) {
                $q->with('user.profile');
            }])
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $reports,
        ]);
    }

    /**
     * Get report statistics (admin only)
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
            'total_reports' => Report::count(),
            'pending_reports' => Report::where('status', 'pending')->count(),
            'resolved_reports' => Report::where('status', 'resolved')->count(),
            'dismissed_reports' => Report::where('status', 'dismissed')->count(),
            'by_reason' => Report::select('reason')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('reason')
                ->pluck('count', 'reason'),
            'recent_reports' => Report::with(['ad', 'user.profile'])
                ->latest()
                ->limit(10)
                ->get(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Delete a report (admin only)
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

        $report = Report::find($id);

        if (!$report) {
            return response()->json([
                'status' => 'error',
                'message' => 'Report not found'
            ], 404);
        }

        $report->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Report deleted',
        ]);
    }
}
