<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AdminSetupController extends Controller
{
    /**
     * Show admin setup page
     */
    public function index(): Response
    {
        $user = Auth::user();
        
        return Inertia::render('AdminSetup', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'user_type' => $user->user_type,
                'status' => $user->status,
                'is_admin' => in_array($user->user_type, ['admin', 'manager']),
            ],
        ]);
    }

    /**
     * Make current user an admin via Inertia POST
     */
    public function makeAdmin(Request $request): Response
    {
        $user = Auth::user();
        
        // Make the user admin
        $user->update([
            'user_type' => 'admin',
            'status' => 1, // Active
        ]);

        // Redirect to admin dashboard with success message
        return Inertia::render('AdminSetup', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'user_type' => $user->user_type,
                'status' => $user->status,
                'is_admin' => true,
            ],
            'success' => true,
            'message' => 'Vous êtes maintenant administrateur! Redirection en cours...',
        ]);
    }
}
