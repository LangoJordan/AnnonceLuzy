<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class VisitorHistoryActionsController extends Controller
{
    public function clearHistory(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect('/login');
        }

        // Delete all views for the user
        $user->views()->delete();

        return redirect()->back()->with('success', 'Historique complètement effacé');
    }

    public function removeItem(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return redirect('/login');
        }

        // Delete specific view
        $user->views()->where('ad_id', $id)->delete();

        return redirect()->back()->with('success', 'Annonce supprimée de l\'historique');
    }
}
