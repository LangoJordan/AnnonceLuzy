<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VisitorHistoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get user's view history with aggregated data
        $historyCollection = DB::table('views')
            ->where('views.user_id', $user->id)
            ->join('ads', 'views.ad_id', '=', 'ads.id')
            ->leftJoin('categories', 'ads.category_id', '=', 'categories.id')
            ->leftJoin('cities', 'ads.city_id', '=', 'cities.id')
            ->leftJoin('users as publishers', 'ads.user_id', '=', 'publishers.id')
            ->select(
                'ads.id',
                'ads.title',
                'ads.price',
                'ads.price_description',
                'ads.views_count',
                'ads.main_photo',
                'categories.name as category',
                'cities.name as location',
                'publishers.name as agency',
                DB::raw('COUNT(views.id) as view_count'),
                DB::raw('MAX(views.created_at) as viewedAt')
            )
            ->groupBy('ads.id')
            ->orderByDesc('viewedAt')
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'category' => $item->category ?? 'Non catégorisé',
                'location' => $item->location ?? 'Non défini',
                'price' => $item->price ? $item->price . '€' : ($item->price_description ?? 'Sur demande'),
                'image' => $item->main_photo,
                'agency' => $item->agency ?? 'Annonceur',
                'views' => $item->views_count ?? 0,
                'rating' => 4.8,
                'viewedAt' => date('Y-m-d H:i', strtotime($item->viewedAt)),
                'viewCount' => $item->view_count ?? 1,
            ]);

        return Inertia::render('Visitor/History', [
            'user' => $user,
            'history' => $historyCollection,
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $user->views()->where('ad_id', $id)->delete();

        return redirect()->back()->with('success', 'Annonce supprimée de l\'historique');
    }

    public function clearAll()
    {
        $user = Auth::user();
        $user->views()->delete();

        return redirect()->back()->with('success', 'Historique complètement effacé');
    }
}
