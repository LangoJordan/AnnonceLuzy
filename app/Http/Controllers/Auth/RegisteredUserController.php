<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Affichage du formulaire
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'countries' => Country::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'phone_code']),

            'cities' => City::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'country_id']),
        ]);
    }

    /**
     * Enregistrement
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'user_type' => ['required', 'in:visitor,agency'],
            'name'      => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone'     => ['required', 'string', 'max:30'],
            'country_id' => ['required', 'exists:countries,id'],
            'city_id'   => ['required', 'exists:cities,id'],
            'address'   => ['nullable', 'string', 'max:255'],
            'password'  => ['required', 'confirmed', Rules\Password::defaults()],
            'terms'     => ['accepted'],
        ]);

        $status = $request->user_type === 'agency' ? 2 : 1;

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'phone'      => $request->phone,
            'country_id' => $request->country_id,
            'city_id'    => $request->city_id,
            'address'    => $request->address,
            'user_type'       => $request->user_type,
            'status'     => $status,
            'password'   => Hash::make($request->password),
        ]);

        event(new Registered($user));

        if ($status === 1) {
            Auth::login($user);
            return redirect()->route('dashboard');
        }
        // 2 en attente de validation pour les agences
        // 3 rejeté
        // 4 désactivé
        return redirect()->route('login')
            ->with('success', 'Votre compte agence est en cours de validation.');
    }
}
