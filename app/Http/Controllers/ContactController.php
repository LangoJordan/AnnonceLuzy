<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Ad;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth')->except(['store']);
    // }

    /**
     * Get all contacts for an ad
     */
    public function getAdContacts($adId, Request $request): JsonResponse
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
                'message' => 'Unauthorized'
            ], 403);
        }

        $contacts = $ad->contacts()
            ->with('user.profile')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $contacts,
            'total_contacts' => $ad->contacts()->count(),
        ]);
    }

    /**
     * Record a contact/inquiry for an ad
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ad_id' => 'required|exists:ads,id',
        ]);

        $ad = Ad::find($validated['ad_id']);

        if (!$ad) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ad not found'
            ], 404);
        }

        // For authenticated users, record their ID; for guests, store NULL
        $userId = Auth::check() ? Auth::id() : null;

        // Create a new contact record each time (allow multiple identical contacts)
        $contact = Contact::create(
            [
                'ad_id' => $ad->id,
                'user_id' => $userId,
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Contact recorded',
            'data' => $contact,
        ], 201);
    }

    /**
     * Get a specific contact
     */
    public function show($id): JsonResponse
    {
        $user = Auth::user();
        $contact = Contact::with('user.profile')->find($id);

        if (!$contact) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contact not found'
            ], 404);
        }

        $ad = $contact->ad;
        if ($ad->user_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $contact,
        ]);
    }

    /**
     * Delete a contact
     */
    public function destroy($id): JsonResponse
    {
        $user = Auth::user();
        $contact = Contact::with('ad')->find($id);

        if (!$contact) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contact not found'
            ], 404);
        }

        if ($contact->ad->user_id !== $user->id && $user->user_type !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $contact->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Contact deleted',
        ]);
    }

    /**
     * Get user's sent contacts
     */
    public function getMyContacts(Request $request): JsonResponse
    {
        $user = Auth::user();

        $contacts = $user->contacts
            ->with(['ad' => function ($q) {
                $q->with(['user.profile', 'space']);
            }])
            ->latest()
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $contacts,
        ]);
    }

    /**
     * Get contact statistics for an ad
     */
    public function getAdStatistics($adId): JsonResponse
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
                'message' => 'Unauthorized'
            ], 403);
        }

        $contacts = $ad->contacts()->get();

        $stats = [
            'total_contacts' => $contacts->count(),
            'contacts_today' => $contacts->filter(function ($contact) {
                return $contact->created_at->isToday();
            })->count(),
            'contacts_week' => $contacts->filter(function ($contact) {
                return $contact->created_at->isCurrentWeek();
            })->count(),
            'contacts_month' => $contacts->filter(function ($contact) {
                return $contact->created_at->isCurrentMonth();
            })->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }

    /**
     * Get contacts dashboard statistics (admin)
     */
    public function getDashboardStatistics(): JsonResponse
    {
        $user = Auth::user();

        if ($user->user_type !== 'admin' && $user->user_type !== 'manager') {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $stats = [
            'total_contacts' => Contact::count(),
            'today_contacts' => Contact::where('created_at', '>=', now()->startOfDay())->count(),
            'week_contacts' => Contact::where('created_at', '>=', now()->startOfWeek())->count(),
            'month_contacts' => Contact::where('created_at', '>=', now()->startOfMonth())->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats,
        ]);
    }
}
