<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        try {
            Auth::guard('web')->logout();

            // Invalidate session and regenerate token
            $request->session()->invalidate();

            // Create a new session with a fresh token
            $request->session()->regenerateToken();

            return redirect('/')->with('status', 'Déconnexion réussie');
        } catch (\Exception $e) {
            // Even if logout fails due to session issues, still redirect home
            // This prevents the user from being stuck on the logout page
            \Log::error('Logout error: ' . $e->getMessage());
            return redirect('/')->with('error', 'Session fermée');
        }
    }
}
