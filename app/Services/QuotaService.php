<?php

namespace App\Services;

use App\Models\User;
use App\Models\Ad;
use App\Models\AgencySpace;
use App\Models\Subscription;
use Carbon\Carbon;

class QuotaService
{
    /**
     * Get active subscription for a user
     */
    public function getActiveSubscription(User $user): ?Subscription
    {
        return $user->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->first();
    }

    /**
     * Count active (non-trash) ads for a user
     */
    public function countActiveAds(User $user): int
    {
        $subscription = $this->getActiveSubscription($user);
        
        if (!$subscription) {
            return 0;
        }

        return $user->ads()
            ->where('status', '!=', 'trash')
            ->count();
    }

    /**
     * Count active spaces (status = true) for an agency
     */
    public function countActiveSpaces(User $agency): int
    {
        if ($agency->user_type !== 'agency') {
            return 0;
        }

        return $agency->agencySpaces()
            ->where('status', true)
            ->count();
    }

    /**
     * Get remaining ads quota for a user
     */
    public function getAdQuotaRemaining(User $user): ?int
    {
        $subscription = $this->getActiveSubscription($user);
        
        if (!$subscription) {
            return null;
        }

        $activeAdsCount = $this->countActiveAds($user);
        return max(0, $subscription->max_ads - $activeAdsCount);
    }

    /**
     * Get remaining spaces quota for an agency
     */
    public function getSpaceQuotaRemaining(User $agency): ?int
    {
        if ($agency->user_type !== 'agency') {
            return null;
        }

        $subscription = $this->getActiveSubscription($agency);
        
        if (!$subscription) {
            return null;
        }

        $activeSpacesCount = $this->countActiveSpaces($agency);
        return max(0, $subscription->max_spaces - $activeSpacesCount);
    }

    /**
     * Check if user can create a new ad
     */
    public function canCreateAd(User $user): bool
    {
        $subscription = $this->getActiveSubscription($user);
        
        if (!$subscription) {
            return false;
        }

        $activeAdsCount = $this->countActiveAds($user);
        return $activeAdsCount < $subscription->max_ads;
    }

    /**
     * Check if agency can create a new space
     */
    public function canCreateSpace(User $agency): bool
    {
        if ($agency->user_type !== 'agency') {
            return false;
        }

        $subscription = $this->getActiveSubscription($agency);
        
        if (!$subscription) {
            return false;
        }

        $activeSpacesCount = $this->countActiveSpaces($agency);
        return $activeSpacesCount < $subscription->max_spaces;
    }

    /**
     * Enforce quota limits when subscription changes or downgrades
     * Automatically moves surplus ads to trash and deactivates surplus spaces
     */
    public function enforceQuotaDowngrade(User $user, Subscription $newSubscription): void
    {
        // Get active ads count (excluding trash)
        $activeAdsCount = $this->countActiveAds($user);
        
        // If exceeding new ad quota, move surplus to trash
        if ($activeAdsCount > $newSubscription->max_ads) {
            $adsSurplus = $activeAdsCount - $newSubscription->max_ads;
            
            // Get ads to move to trash (oldest first)
            $adsToTrash = $user->ads()
                ->where('status', '!=', 'trash')
                ->orderBy('created_at', 'asc')
                ->limit($adsSurplus)
                ->get();
            
            foreach ($adsToTrash as $ad) {
                $ad->update(['status' => 'trash']);
            }
        }

        // Get active spaces count (status = true)
        $activeSpacesCount = $this->countActiveSpaces($user);
        
        // If exceeding new space quota, deactivate surplus spaces
        if ($activeSpacesCount > $newSubscription->max_spaces) {
            $spacesSurplus = $activeSpacesCount - $newSubscription->max_spaces;
            
            // Get spaces to deactivate (oldest first)
            $spacesToDeactivate = $user->agencySpaces()
                ->where('status', true)
                ->orderBy('created_at', 'asc')
                ->limit($spacesSurplus)
                ->get();
            
            foreach ($spacesToDeactivate as $space) {
                // Deactivate space
                $space->update(['status' => false]);
                
                // Move all ads in this space to trash
                $space->ads()
                    ->where('status', '!=', 'trash')
                    ->update(['status' => 'trash']);
            }
        }
    }

    /**
     * Attempt to reactivate an ad from trash
     * Only succeeds if status is 'trash' and quota allows
     */
    public function reactivateAd(Ad $ad): bool
    {
        // Can only reactivate if currently in trash
        if ($ad->status !== 'trash') {
            return false;
        }

        $user = $ad->user;
        
        // Check if user has active subscription
        if (!$this->getActiveSubscription($user)) {
            return false;
        }

        // Check if quota allows
        if (!$this->canCreateAd($user)) {
            return false;
        }

        // Reactivate to pending status
        $ad->update(['status' => 'pending']);
        
        return true;
    }

    /**
     * Attempt to reactivate a space from inactive
     * Only succeeds if status is false and quota allows
     */
    public function reactivateSpace(AgencySpace $space): bool
    {
        // Can only reactivate if currently inactive
        if ($space->status !== false) {
            return false;
        }

        $agency = $space->agency;
        
        // Check if agency user type is correct
        if ($agency->user_type !== 'agency') {
            return false;
        }

        // Check if agency has active subscription
        if (!$this->getActiveSubscription($agency)) {
            return false;
        }

        // Check if quota allows
        if (!$this->canCreateSpace($agency)) {
            return false;
        }

        // Reactivate space
        $space->update(['status' => true]);
        
        return true;
    }

    /**
     * Get quota information for a user/agency
     */
    public function getQuotaInfo(User $user): array
    {
        $subscription = $this->getActiveSubscription($user);
        
        if (!$subscription) {
            return [
                'has_active_subscription' => false,
                'max_ads' => 0,
                'max_spaces' => 0,
                'active_ads' => 0,
                'active_spaces' => 0,
                'remaining_ads' => 0,
                'remaining_spaces' => 0,
            ];
        }

        $activeAds = $this->countActiveAds($user);
        $activeSpaces = $user->user_type === 'agency' ? $this->countActiveSpaces($user) : 0;

        return [
            'has_active_subscription' => true,
            'subscription_id' => $subscription->id,
            'subscription_label' => $subscription->label,
            'subscription_start' => $subscription->pivot->start_date,
            'subscription_end' => $subscription->pivot->end_date,
            'max_ads' => $subscription->max_ads,
            'max_spaces' => $subscription->max_spaces,
            'active_ads' => $activeAds,
            'active_spaces' => $activeSpaces,
            'remaining_ads' => max(0, $subscription->max_ads - $activeAds),
            'remaining_spaces' => max(0, $subscription->max_spaces - $activeSpaces),
        ];
    }
}
