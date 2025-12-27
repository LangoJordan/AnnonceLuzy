<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\City;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class VisitorProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $profile = $user->profile;

        // Get user statistics
        $favoritesCount = $user->favorites()->count();
        $viewsCount = $user->views()->count();
        $contactsCount = $user->contacts()->count();
        $memberSince = $user->created_at->year;

        // Get available countries and cities
        $countries = Country::where('is_active', true)->get(['id', 'name', 'code', 'phone_code']);
        $cities = City::where('is_active', true)->get(['id', 'name', 'country_id', 'code', 'region']);

        return Inertia::render('Visitor/Profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'country' => $user->country?->name ?? '',
                'city' => $user->city?->name ?? '',
                'address' => $user->address ?? '',
                'country_id' => $user->country_id,
                'city_id' => $user->city_id,
            ],
            'profile' => [
                'photo' => $profile?->photo ?? null,
                'description' => $profile?->description ?? '',
                'slogan' => $profile?->slogan ?? '',
            ],
            'stats' => [
                [
                    'label' => 'Favoris',
                    'value' => $favoritesCount,
                    'icon' => 'Heart',
                ],
                [
                    'label' => 'Historique',
                    'value' => $viewsCount,
                    'icon' => 'Eye',
                ],
                [
                    'label' => 'Contacts',
                    'value' => $contactsCount,
                    'icon' => 'Bell',
                ],
                [
                    'label' => 'Membre depuis',
                    'value' => $memberSince,
                    'icon' => 'Calendar',
                ],
            ],
            'countries' => $countries,
            'cities' => $cities,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        // Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'country_id' => 'nullable|exists:countries,id',
            'city_id' => 'nullable|exists:cities,id',
            'description' => 'nullable|string|max:1000',
            'slogan' => 'nullable|string|max:255',
        ]);

        // Update user data
        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? $user->phone,
            'address' => $validated['address'] ?? $user->address,
            'country_id' => $validated['country_id'] ?? $user->country_id,
            'city_id' => $validated['city_id'] ?? $user->city_id,
        ]);

        // Update or create profile
        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'description' => $validated['description'] ?? '',
                'slogan' => $validated['slogan'] ?? '',
            ]
        );

        return redirect()->back()->with('success', 'Profil mis à jour avec succès');
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Mot de passe mis à jour avec succès');
    }

    public function destroy(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'password' => 'required|current_password',
        ]);

        // Delete all related data
        $user->favorites()->delete();
        $user->views()->delete();
        $user->reports()->delete();
        $user->contacts()->delete();
        $user->profile()->delete();

        // Delete user
        $user->delete();

        Auth::logout();

        return redirect('/')->with('success', 'Compte supprimé avec succès');
    }
}
