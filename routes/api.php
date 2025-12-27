<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdController;
use App\Http\Controllers\AdFeatureController;
use App\Http\Controllers\AgencySpaceController;
use App\Http\Controllers\BoostController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmployeePositionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ViewController;
use App\Http\Controllers\AgencyDashboardController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ManagerDashboardController;
use App\Http\Controllers\SearchController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth')->group(function () {

    Route::get('/me', [UserController::class, 'me']);
    Route::patch('/profile', [UserController::class, 'updateProfile']);
    Route::patch('/password', [UserController::class, 'updatePassword']);

    Route::apiResource('ads', AdController::class)->names('api.ads');
    Route::get('/ads/{id}/statistics', [AdController::class, 'getAdStatistics']);
    Route::get('/ads/search', [AdController::class, 'search']);
    Route::get('/my-ads', [AdController::class, 'myAds']);
    Route::get('/pending-ads', [AdController::class, 'getPending']);
    Route::post('/ads/{id}/validate', [AdController::class, 'validate']);
    Route::post('/ads/{id}/reactivate', [AdController::class, 'reactivate']);
    Route::get('/categories', [AdController::class, 'getCategories']);

    Route::apiResource('spaces', AgencySpaceController::class);
    Route::get('/spaces/{id}/statistics', [AgencySpaceController::class, 'getStatistics']);
    Route::get('/agency/{id}/spaces', [AgencySpaceController::class, 'getByAgency']);
    Route::post('/spaces/{id}/regenerate-merchant-code', [AgencySpaceController::class, 'regenerateMerchantCode']);
    Route::post('/spaces/{id}/reactivate', [AgencySpaceController::class, 'reactivate']);

    Route::apiResource('ad-features', AdFeatureController::class);
    Route::post('/ads/{id}/features', [AdFeatureController::class, 'store']);
    Route::delete('/ads/{adId}/features/{featureId}', [AdFeatureController::class, 'destroy']);

    Route::apiResource('boosts', BoostController::class)->only(['index', 'show']);
    Route::post('/boosts', [BoostController::class, 'store']);
    Route::patch('/boosts/{id}', [BoostController::class, 'update']);
    Route::delete('/boosts/{id}', [BoostController::class, 'destroy']);
    Route::post('/boosts/apply', [BoostController::class, 'applyToAd']);
    Route::post('/boosts/purchase', [BoostController::class, 'purchase']);
    Route::post('/boosts/activate', [BoostController::class, 'activateBoost']);
    Route::delete('/boosts/cancel', [BoostController::class, 'cancelBoost']);
    Route::get('/ads/{id}/boosts', [BoostController::class, 'getAdBoosts']);
    Route::get('/ads/{id}/boosts/history', [BoostController::class, 'getAdBoostHistory']);
    Route::get('/boosts/statistics', [BoostController::class, 'getStatistics']);

    Route::apiResource('contacts', ContactController::class)->only(['show', 'destroy']);
    Route::get('/ads/{id}/contacts', [ContactController::class, 'getAdContacts']);
    Route::get('/my-contacts', [ContactController::class, 'getMyContacts']);
    Route::get('/ads/{id}/contacts/statistics', [ContactController::class, 'getAdStatistics']);
    Route::get('/contacts/statistics', [ContactController::class, 'getDashboardStatistics']);

    Route::apiResource('favorites', FavoriteController::class)->only(['index', 'show', 'destroy']);
    Route::post('/favorites', [FavoriteController::class, 'store'])->name('api.favorites.store');
    Route::get('/favorites/ad/{id}/check', [FavoriteController::class, 'checkFavorite']);
    Route::delete('/favorites/ad/{id}', [FavoriteController::class, 'removeByAdId']);
    Route::get('/ads/{id}/favorites/count', [FavoriteController::class, 'getAdFavoriteCount']);
    Route::get('/favorites/ads', [FavoriteController::class, 'getAds']);

    Route::apiResource('reports', ReportController::class)->only(['index', 'show', 'destroy']);
    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/my-reports', [ReportController::class, 'getMyReports']);
    Route::patch('/reports/{id}/status', [ReportController::class, 'updateStatus']);
    Route::get('/ads/{id}/reports', [ReportController::class, 'getAdReports']);
    Route::get('/reports/statistics', [ReportController::class, 'getStatistics']);

    Route::apiResource('subscriptions', SubscriptionController::class)->only(['index', 'show']);
    Route::post('/subscriptions', [SubscriptionController::class, 'store']);
    Route::patch('/subscriptions/{id}', [SubscriptionController::class, 'update']);
    Route::delete('/subscriptions/{id}', [SubscriptionController::class, 'destroy']);
    Route::get('/subscriptions/active', [SubscriptionController::class, 'getActive']);
    Route::get('/subscriptions/history', [SubscriptionController::class, 'getHistory']);
    Route::post('/subscriptions/subscribe', [SubscriptionController::class, 'subscribe']);
    Route::post('/subscriptions/purchase', [SubscriptionController::class, 'purchase']);
    Route::post('/subscriptions/activate', [SubscriptionController::class, 'activate']);
    Route::post('/subscriptions/cancel', [SubscriptionController::class, 'cancel']);
    Route::get('/subscriptions/statistics', [SubscriptionController::class, 'getStatistics']);

    Route::apiResource('employees', EmployeePositionController::class);
    Route::get('/employees/space/{id}', [EmployeePositionController::class, 'getBySpace']);
    Route::get('/my-employees', [EmployeePositionController::class, 'myEmployees']);

    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/search', [UserController::class, 'search']);
    Route::get('/visitors/search', [UserController::class, 'search']);
    Route::patch('/users/{id}/status', [UserController::class, 'updateStatus']);
    Route::patch('/users/{id}/type', [UserController::class, 'changeType']);
    Route::post('/managers', [UserController::class, 'createManager']);
    Route::get('/users/statistics', [UserController::class, 'getStatistics']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::post('/views', [ViewController::class, 'recordView']);
    Route::get('/ads/{id}/views', [ViewController::class, 'getAdViews']);
    Route::get('/ads/{id}/views/statistics', [ViewController::class, 'getAdViewStatistics']);

    Route::apiResource('transactions', TransactionController::class)->only(['index', 'show']);

    Route::get('/agency/overview', [AgencyDashboardController::class, 'overview']);
    Route::get('/agency/ads', [AgencyDashboardController::class, 'getAds']);
    Route::get('/agency/spaces', [AgencyDashboardController::class, 'getSpaces']);
    Route::get('/agency/spaces/{id}/statistics', [AgencyDashboardController::class, 'getSpaceStatistics']);
    Route::get('/agency/employees', [AgencyDashboardController::class, 'getEmployees']);
    Route::get('/agency/analytics', [AgencyDashboardController::class, 'getPerformanceAnalytics']);
    Route::get('/agency/subscription', [AgencyDashboardController::class, 'getSubscription']);
    Route::get('/agency/activities', [AgencyDashboardController::class, 'getActivities']);

    Route::get('/admin/overview', [AdminDashboardController::class, 'overview']);
    Route::get('/admin/user-statistics', [AdminDashboardController::class, 'userStatistics']);

    Route::get('/manager/overview', [ManagerDashboardController::class, 'overview']);
});

Route::get('/countries', [LocationController::class, 'getCountries']);
Route::get('/cities', [LocationController::class, 'getAllCities']);
Route::get('/countries/{id}/cities', [LocationController::class, 'getCitiesByCountry']);
Route::get('/countries/code/{code}/cities', [LocationController::class, 'getCitiesByCountryCode']);
Route::get('/cities/search', [LocationController::class, 'searchCities']);
Route::get('/ads/search', [AdController::class, 'search']);
Route::get('/ads/categories', [AdController::class, 'getCategories']);
Route::get('/ads/{id}', [AdController::class, 'show']);
Route::get('/boosts', [BoostController::class, 'index']);
Route::get('/boosts/{id}', [BoostController::class, 'show']);
Route::get('/subscriptions', [SubscriptionController::class, 'index']);
Route::get('/subscriptions/{id}', [SubscriptionController::class, 'show']);

// Public contact tracking (no authentication required)
Route::post('/contacts', [ContactController::class, 'store']);

// Search endpoints
Route::get('/search', [SearchController::class, 'search']);
Route::get('/search/suggestions', [SearchController::class, 'getSuggestions']);
Route::get('/search/popular', [SearchController::class, 'getPopularSearches']);
