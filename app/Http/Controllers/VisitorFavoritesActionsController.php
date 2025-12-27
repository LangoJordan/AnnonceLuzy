<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class VisitorFavoritesActionsController extends Controller
{
    /**
     * Add an ad to favorites
     */
    public function add(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        Favorite::firstOrCreate(
            ['user_id' => $user->id, 'ad_id' => $id]
        );

        return response()->json(['success' => true, 'message' => 'Ajouté aux favoris']);
    }

    /**
     * Remove an ad from favorites
     */
    public function remove(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        Favorite::where('user_id', $user->id)
            ->where('ad_id', $id)
            ->delete();

        return response()->json(['success' => true, 'message' => 'Retiré des favoris']);
    }

    /**
     * Check if an ad is in user's favorites
     */
    public function check(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['isFavorite' => false]);
        }

        $isFavorite = Favorite::where('user_id', $user->id)
            ->where('ad_id', $id)
            ->exists();

        return response()->json(['isFavorite' => $isFavorite]);
    }
}
