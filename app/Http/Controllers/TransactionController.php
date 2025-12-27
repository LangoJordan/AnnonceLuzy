<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    /**
     * Get all transactions (admin only)
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin' && $user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $query = Transaction::with(['sender', 'receiver']);

        if ($request->has('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('mode')) {
            $query->where('mode', $request->mode);
        }

        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $transactions = $query->latest('date')->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $transactions,
        ]);
    }

    /**
     * Get a specific transaction
     */
    public function show($id): JsonResponse
    {
        $transaction = Transaction::with(['sender', 'receiver'])->find($id);

        if (!$transaction) {
            return response()->json([
                'status' => 'error',
                'message' => 'Transaction not found'
            ], 404);
        }

        $user = Auth::user();
        if ($transaction->sender_id !== $user->id && $transaction->receiver_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $transaction,
        ]);
    }

    /**
     * Get user's transaction history
     */
    public function getMyTransactions(Request $request): JsonResponse
    {
        $user = Auth::user();

        $query = Transaction::where(function ($q) use ($user) {
            $q->where('sender_id', $user->id)
              ->orWhere('receiver_id', $user->id);
        })->with(['sender', 'receiver']);

        if ($request->has('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $transactions = $query->latest('date')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $transactions,
        ]);
    }

    /**
     * Record a new transaction
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'receiver_id' => 'nullable|exists:users,id',
            'amount' => 'required|integer|min:1',
            'mode' => 'required|string|in:momo,card,bank,cash',
            'transaction_type' => 'required|in:boost,subscription',
            'reference' => 'nullable|string|max:255',
        ]);

        $transaction = Transaction::create([
            'sender_id' => $user->id,
            'receiver_id' => $validated['receiver_id'] ?? null,
            'amount' => $validated['amount'],
            'mode' => $validated['mode'],
            'status' => 'pending',
            'transaction_type' => $validated['transaction_type'],
            'date' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Transaction recorded',
            'data' => $transaction,
        ], 201);
    }

    /**
     * Update transaction status (admin only)
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'status' => 'error',
                'message' => 'Transaction not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:success,failed,pending',
        ]);

        $transaction->update(['status' => $validated['status']]);

        return response()->json([
            'status' => 'success',
            'message' => 'Transaction status updated',
            'data' => $transaction,
        ]);
    }

    /**
     * Get transaction statistics
     */
    public function getStatistics(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin' && $user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $dateFrom = $request->has('date_from') ? $request->date_from : now()->subMonths(1);
        $dateTo = $request->has('date_to') ? $request->date_to : now();

        $query = Transaction::whereBetween('date', [$dateFrom, $dateTo]);

        $stats = [
            'total_transactions' => $query->count(),
            'successful_transactions' => $query->where('status', 'success')->count(),
            'failed_transactions' => $query->where('status', 'failed')->count(),
            'pending_transactions' => $query->where('status', 'pending')->count(),
            'total_revenue' => $query->where('status', 'success')->sum('amount'),
            'by_type' => [
                'boost' => $query->where('transaction_type', 'boost')->sum('amount'),
                'subscription' => $query->where('transaction_type', 'subscription')->sum('amount'),
            ],
            'by_mode' => $query->select('mode', DB::raw('SUM(amount) as total'))
                ->where('status', 'success')
                ->groupBy('mode')
                ->pluck('total', 'mode'),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Get transactions by date range
     */
    public function getByDateRange(Request $request): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin' && $user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);

        $transactions = Transaction::with(['sender', 'receiver'])
            ->whereBetween('date', [$validated['date_from'], $validated['date_to']])
            ->latest('date')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $transactions,
        ]);
    }

    /**
     * Export transactions as CSV (admin only)
     */
    public function export(Request $request)
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);

        $transactions = Transaction::with(['sender', 'receiver'])
            ->whereBetween('date', [$validated['date_from'], $validated['date_to']])
            ->latest('date')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=transactions.csv',
        ];

        $callback = function() use ($transactions) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Sender', 'Receiver', 'Amount', 'Mode', 'Type', 'Status', 'Date']);

            foreach ($transactions as $transaction) {
                fputcsv($file, [
                    $transaction->id,
                    $transaction->sender->name,
                    $transaction->receiver ? $transaction->receiver->name : 'N/A',
                    $transaction->amount,
                    $transaction->mode,
                    $transaction->transaction_type,
                    $transaction->status,
                    $transaction->date->format('Y-m-d H:i:s'),
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
