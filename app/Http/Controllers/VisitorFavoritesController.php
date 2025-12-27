<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;
use App\Models\Subcategory;

class VisitorFavoritesController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get all favorites with associated ad details
        $favoritesCollection = $user->favorites()
            ->with([
                'ad' => function ($q) {
                    $q->select('id', 'title', 'price', 'price_description', 'category_id', 'subcategory_id', 'city_id', 'views_count', 'user_id', 'main_photo')
                      ->with(['category:id,name', 'subcategory:id,name', 'city:id,name', 'user:id,name']);
                }
            ])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($favorite) => [
                'id' => $favorite->ad->id,
                'title' => $favorite->ad->title,
                'category' => $favorite->ad->category?->name ?? 'Non catégorisé',
                'categoryId' => $favorite->ad->category?->id,
                'subcategory' => $favorite->ad->subcategory?->name ?? 'Non spécifié',
                'subcategoryId' => $favorite->ad->subcategory?->id,
                'location' => $favorite->ad->city?->name ?? 'Non défini',
                'price' => $favorite->ad->price ? $favorite->ad->price . '€' : ($favorite->ad->price_description ?? 'Sur demande'),
                'image' => $favorite->ad->main_photo,
                'agency' => $favorite->ad->user?->name ?? 'Annonceur',
                'views' => $favorite->ad->views_count ?? 0,
                'rating' => 4.8,
                'addedAt' => $favorite->created_at->format('Y-m-d'),
                'badge' => rand(0, 1) ? 'À la une' : null,
            ]);

        // Get all categories and subcategories for filter
        $categories = Category::with('subcategories:id,category_id,name')->get(['id', 'name']);

        return Inertia::render('Visitor/Favorites', [
            'user' => $user,
            'favorites' => $favoritesCollection,
            'categories' => $categories,
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $user->favorites()->where('ad_id', $id)->delete();

        return redirect()->back()->with('success', 'Annonce retirée de vos favoris');
    }
}
