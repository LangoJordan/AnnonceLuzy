<?php

namespace App\Observers;

use App\Models\Ad;
use App\Models\View;
use Illuminate\Support\Facades\Auth;

class AdObserver
{
    /**
     * Handle the Ad "retrieved" event - triggered when an ad is fetched from database
     * This automatically tracks views when an ad detail is loaded
     */
    public function retrieved(Ad $ad): void
    {
        // Note: This is a read-only operation, so we need to be careful
        // We only track when explicitly called from the controller
    }

    /**
     * Handle the Ad "creating" event.
     */
    public function creating(Ad $ad): void
    {
        // Initialize view count if not set
        if (is_null($ad->views_count)) {
            $ad->views_count = 0;
        }
    }

    /**
     * Handle the Ad "updating" event.
     */
    public function updating(Ad $ad): void
    {
        // Can add custom logic for updates if needed
    }

    /**
     * Handle the Ad "deleting" event - cascade delete related views
     */
    public function deleting(Ad $ad): void
    {
        // Delete all views associated with this ad
        View::where('ad_id', $ad->id)->delete();
    }

    /**
     * Handle the Ad "restored" event - restore views if using soft deletes
     */
    public function restored(Ad $ad): void
    {
        // Logic for restoring if using soft deletes
    }

    /**
     * Handle the Ad "force deleted" event - force delete views
     */
    public function forceDeleted(Ad $ad): void
    {
        // Ensure views are deleted (in case of force delete)
        View::where('ad_id', $ad->id)->forceDelete();
    }
}
