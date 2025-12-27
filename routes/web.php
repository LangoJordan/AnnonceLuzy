<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AgencyDashboardController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminSetupController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\AdShowController;
use App\Http\Controllers\AgencyViewController;
use App\Http\Controllers\VisitorDashboardController;
use App\Http\Controllers\VisitorFavoritesController;
use App\Http\Controllers\VisitorHistoryController;
use App\Http\Controllers\VisitorProfileController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AgencySelectionController;
use App\Http\Middleware\CheckUserStatus;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', [SearchController::class, 'home'])->name('home');

Route::get('/ads', [SearchController::class, 'search'])->name('ads.index');
Route::get('/search', [SearchController::class, 'search'])->name('search');

Route::get('/ads/{id}', [AdShowController::class, 'show'])->name('ads.show');

Route::get('/ads/{id}/contact', function ($id) {
    return Inertia::render('ContactAd', [
        'adId' => $id,
    ]);
})->name('ads.contact');

Route::get('/ads/{id}/signaler', function ($id) {
    // Load ad with relationships to country and city
    $ad = \App\Models\Ad::with([
        'country:id,name,code',
        'city:id,name,code,region,country_id'
    ])->where('status', 'valid')->findOrFail($id);

    $user = \Illuminate\Support\Facades\Auth::user();

    // Get location info from relationships
    $cityName = $ad->city?->name ?? null;
    $countryName = $ad->country?->name ?? null;

    // Build location string
    $location = '';
    if ($cityName && $countryName) {
        $location = "{$cityName}, {$countryName}";
    } elseif ($cityName) {
        $location = $cityName;
    } elseif ($countryName) {
        $location = $countryName;
    }

    // Transform ad data for frontend - Photo, Address, Location (NO PRICE)
    $transformedAd = [
        'id' => $ad->id,
        'title' => $ad->title,
        'description' => $ad->description,
        'main_photo' => $ad->main_photo, // URL to the photo
        'address' => $ad->address,
        'city_name' => $cityName,
        'country_name' => $countryName,
        'location' => $location,
        'views_count' => $ad->views_count,
        'created_at' => $ad->created_at?->format('Y-m-d'),
    ];

    return Inertia::render('ReportAd', [
        'ad' => $transformedAd,
        'user' => $user ? [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ] : null,
    ]);
})->name('ads.report');

Route::get('/agencies/{id}', [AgencyViewController::class, 'show'])->name('agencies.view');

// Agency Routes
Route::middleware(['auth', CheckUserStatus::class, 'active_subscription', 'ensure_agency_selection'])->group(function () {
    Route::get('/agence', [AgencyDashboardController::class, 'index'])->name('agency.dashboard');

    Route::get('/agence/annonces', [AgencyDashboardController::class, 'annonceShow'])->name('agency.ads');

    Route::get('/agence/annonces/create', [AgencyDashboardController::class, 'adCreateForm'])
        ->name('agency.ad-create');

    Route::post('/agence/annonces', [AgencyDashboardController::class, 'storeAd'])
        ->name('ads.store');

    Route::get('/agence/annonces/{id}/edit', [AgencyDashboardController::class, 'adEdit'])
        ->name('agency.ad-edit');

    Route::patch('/agence/annonces/{id}', [AgencyDashboardController::class, 'updateAd'])
        ->name('agency.ad-update');

    Route::delete('/agence/annonces/{id}', [AgencyDashboardController::class, 'deleteAd'])
        ->name('agency.ad-delete');

    Route::get('/agence/espaces', [AgencyDashboardController::class, 'spaceManagement'])
        ->name('agency.spaces');

    Route::get('/agence/users/search', [AgencyDashboardController::class, 'searchUsersForAssignment'])
        ->name('agency.users-search');

    Route::get('/agence/espaces/{id}', [AgencyDashboardController::class, 'spaceDetail'])
        ->name('agency.space-details');

    Route::post('/agence/espaces', [AgencyDashboardController::class, 'storeSpace'])
        ->name('agency.space-store');

    Route::patch('/agence/espaces/{id}', [AgencyDashboardController::class, 'updateSpace'])
        ->name('agency.space-update');

    Route::delete('/agence/espaces/{id}', [AgencyDashboardController::class, 'deleteSpace'])
        ->name('agency.space-delete');

    Route::get('/agence/employes', [AgencyDashboardController::class, 'employeeManagement'])
        ->name('agency.employees');

    Route::post('/agence/employes', [AgencyDashboardController::class, 'storeEmployee'])
        ->name('agency.employee-store');

    Route::post('/agence/employes/assign', [AgencyDashboardController::class, 'assignEmployee'])
        ->name('agency.employee-assign');

    Route::post('/agence/employes/assign-multiple', [AgencyDashboardController::class, 'assignMultipleEmployees'])
        ->name('agency.employee-assign-multiple');

    Route::patch('/agence/employes/{id}', [AgencyDashboardController::class, 'updateEmployee'])
        ->name('agency.employee-update');

    Route::delete('/agence/employes/{id}', [AgencyDashboardController::class, 'deleteEmployee'])
        ->name('agency.employee-delete');

    Route::get('/agence/profil', [AgencyDashboardController::class, 'profileUpdate'])
        ->name('agency.profile');

    Route::patch('/agence/profil', [AgencyDashboardController::class, 'updateProfile'])
        ->name('agency.profile-update');

    Route::get('/agence/commerciaux', [AgencyDashboardController::class, 'commercials'])
        ->name('agency.commercials');

    Route::get('/agence/analytiques', [AgencyDashboardController::class, 'analytics'])
        ->name('agency.analytics');

    Route::get('/agence/annonces/{id}', [AgencyDashboardController::class, 'adDetails'])
        ->name('agency.ad-details');

    Route::get('/agence/annonces/{id}/boost', [AgencyDashboardController::class, 'boostAd'])
        ->name('agency.boost-ad');

    Route::post('/agence/annonces/{id}/boost', [AgencyDashboardController::class, 'purchaseBoost'])
        ->name('agency.boost-purchase');
});

// Subscription routes - accessible without active subscription
Route::middleware(['auth', CheckUserStatus::class])->group(function () {
    Route::get('/agence/abonnements', [AgencyDashboardController::class, 'subscriptions'])
        ->name('agency.subscriptions');

    Route::get('/agence/abonnements/renouveler', [AgencyDashboardController::class, 'subscriptionPayment'])
        ->name('agency.subscription-renew');

    Route::post('/agence/abonnements/renouveler', [AgencyDashboardController::class, 'renewSubscription'])
        ->name('agency.subscription-purchase');
});

// Admin Setup Routes - Before making user admin
Route::middleware(['auth', CheckUserStatus::class])->group(function () {
    Route::get('/admin-setup', [AdminSetupController::class, 'index'])->name('admin.setup');
    Route::post('/admin-setup/make', [AdminSetupController::class, 'makeAdmin'])->name('admin.setup.make');
});

// Agency Selection Routes - For employees and visitors with agency positions
Route::middleware(['auth', CheckUserStatus::class])->group(function () {
    Route::get('/select-agency', [AgencySelectionController::class, 'show'])->name('select-agency.show');
    Route::post('/select-agency', [AgencySelectionController::class, 'select'])->name('select-agency.select');
    Route::post('/clear-agency-selection', [AgencySelectionController::class, 'clearSelection'])->name('select-agency.clear');
});

// Admin Routes
Route::middleware(['auth', CheckUserStatus::class])->group(function () {
    Route::get('/admin', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

    Route::get('/admin/utilisateurs', [AdminDashboardController::class, 'users'])->name('admin.users');

    Route::get('/admin/utilisateurs/{id}', [AdminDashboardController::class, 'userDetail'])->name('admin.users.detail');

    Route::patch('/admin/utilisateurs/{id}/status', [AdminDashboardController::class, 'updateUserStatus'])->name('admin.users.status');

    Route::patch('/admin/annonces/{id}/status', [AdminDashboardController::class, 'updateAdStatus'])->name('admin.ads.status');

    Route::patch('/admin/signalements/{id}/status', [AdminDashboardController::class, 'updateReportStatus'])->name('admin.reports.status');

    Route::get('/admin/agences', [AdminDashboardController::class, 'agencies'])->name('admin.agencies');

    Route::get('/admin/agences/{id}', [AdminDashboardController::class, 'agencyDetail'])->name('admin.agencies.detail');

    Route::get('/admin/paiements', [AdminDashboardController::class, 'payments'])->name('admin.payments');

    Route::get('/admin/boosts', [AdminDashboardController::class, 'boosts'])->name('admin.boosts');

    Route::get('/admin/signalements', [AdminDashboardController::class, 'reports'])->name('admin.reports');

    Route::get('/admin/signalements/{id}', [AdminDashboardController::class, 'reportDetail'])->name('admin.report.detail');

    Route::get('/admin/statistiques', [AdminDashboardController::class, 'statistics'])->name('admin.statistics');

    Route::get('/admin/abonnements', [AdminDashboardController::class, 'subscriptions'])->name('admin.subscriptions');

    Route::get('/admin/packs-boost', [AdminDashboardController::class, 'boostPackages'])->name('admin.boost-packages');

    // Subscription CRUD routes
    Route::post('/admin/subscriptions/store', [AdminDashboardController::class, 'storeSubscription'])->name('admin.subscriptions.store');
    Route::post('/admin/subscriptions/{id}/update', [AdminDashboardController::class, 'updateSubscription'])->name('admin.subscriptions.update');
    Route::delete('/admin/subscriptions/{id}/delete', [AdminDashboardController::class, 'deleteSubscription'])->name('admin.subscriptions.delete');

    // Boost CRUD routes
    Route::post('/admin/boosts/store', [AdminDashboardController::class, 'storeBoost'])->name('admin.boosts.store');
    Route::post('/admin/boosts/{id}/update', [AdminDashboardController::class, 'updateBoost'])->name('admin.boosts.update');
    Route::delete('/admin/boosts/{id}/delete', [AdminDashboardController::class, 'deleteBoost'])->name('admin.boosts.delete');
});

// Manager Routes
Route::get('/manager', function () {
    return Inertia::render('Manager/Dashboard');
})->name('manager.dashboard');

Route::get('/manager/validation', function () {
    return Inertia::render('Manager/Validation');
})->name('manager.validation');

Route::get('/manager/agences', function () {
    return Inertia::render('Manager/Agencies');
})->name('manager.agencies');

Route::get('/manager/signalements', function () {
    return Inertia::render('Manager/Reports');
})->name('manager.reports');

// Visitor Routes (Protected by auth middleware)
Route::middleware(['auth', CheckUserStatus::class])->group(function () {
    Route::get('/dashboard', [VisitorDashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/visitor', [VisitorDashboardController::class, 'index'])->name('visitor.dashboard');

    Route::get('/mes-agences', [\App\Http\Controllers\MyAgenciesController::class, 'index'])->name('my-agencies');

    Route::get('/favoris', [VisitorFavoritesController::class, 'index'])->name('visitor.favorites');
    Route::delete('/favoris/{id}', [VisitorFavoritesController::class, 'destroy'])->name('visitor.favorites.destroy');

    // Favorites API endpoints for Inertia
    Route::post('/api/favoris', [FavoriteController::class, 'storeWeb'])->name('web.favorites.store');
    Route::delete('/api/favoris/{id}', [FavoriteController::class, 'removeWeb'])->name('web.favorites.remove');

    Route::get('/historique', [VisitorHistoryController::class, 'index'])->name('visitor.history');
    Route::delete('/historique/{id}', [VisitorHistoryController::class, 'destroy'])->name('visitor.history.destroy');
    Route::post('/historique/clear', [VisitorHistoryController::class, 'clearAll'])->name('visitor.history.clear');

    Route::get('/profil', [VisitorProfileController::class, 'index'])->name('visitor.profile');
    Route::patch('/profil', [VisitorProfileController::class, 'update'])->name('visitor.profile.update');
    Route::patch('/profil/password', [VisitorProfileController::class, 'updatePassword'])->name('visitor.profile.password');
    Route::delete('/profil', [VisitorProfileController::class, 'destroy'])->name('visitor.profile.destroy');
});

// Auth Routes - Agency Registration
Route::get('/register-agence', function () {
    return Inertia::render('Auth/AgencyRegister');
})->name('register.agency');

// Legal & Contact Routes
Route::get('/privacy', function () {
    return Inertia::render('Privacy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('Terms');
})->name('terms');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');
//test
Route::get('/Search', function () {
    return Inertia::render('Search');
})->name('Search');
Route::get('/Error', function () {
    return Inertia::render('Error');
})->name('Error');

// Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 404 Not Found - Fallback Route (must be last)
Route::fallback(function () {
    return Inertia::render('Error', [
        'status' => 404,
    ]);
})->name('fallback');

require __DIR__.'/auth.php';
