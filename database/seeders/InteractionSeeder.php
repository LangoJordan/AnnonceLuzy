<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Ad;
use App\Models\Favorite;
use App\Models\View;
use App\Models\Contact;
use App\Models\Report;
use App\Models\Boost;
use App\Models\AdBoost;
use Illuminate\Database\Seeder;

class InteractionSeeder extends Seeder
{
    public function run(): void
    {
        $visitors = User::where('user_type', 'visitor')->get();
        $ads = Ad::where('status', 'valid')->get();
        $boosts = Boost::all();

        if ($visitors->isEmpty() || $ads->isEmpty()) {
            $this->command->warn('UserSeeder and AdSeeder must be run before InteractionSeeder');
            return;
        }

        $favoriteCount = 0;
        $viewCount = 0;
        $contactCount = 0;
        $reportCount = 0;
        $activeBoostCount = 0;
        $expiredBoostCount = 0;
        $inactiveBoostCount = 0;

        // Create favorites with higher diversity
        foreach ($visitors->take(30) as $visitor) {
            $visitorAds = $ads->random(rand(5, 15));
            foreach ($visitorAds as $ad) {
                if (!Favorite::where('user_id', $visitor->id)->where('ad_id', $ad->id)->exists()) {
                    Favorite::create([
                        'user_id' => $visitor->id,
                        'ad_id' => $ad->id
                    ]);
                    $favoriteCount++;
                }
            }
        }

        // Create massive views from visitors
        foreach ($ads as $ad) {
            // Views from logged-in visitors (20-100 per ad)
            $loggedInViews = rand(20, 100);
            $viewCount += $loggedInViews;
            
            for ($i = 0; $i < $loggedInViews; $i++) {
                View::create([
                    'ad_id' => $ad->id,
                    'user_id' => $visitors->random()->id
                ]);
            }
            
            // Anonymous views (10-60 per ad)
            $anonViews = rand(10, 60);
            $viewCount += $anonViews;
            
            for ($i = 0; $i < $anonViews; $i++) {
                View::create([
                    'ad_id' => $ad->id,
                    'user_id' => null
                ]);
            }
        }

        // Create contacts from visitors
        foreach ($ads as $ad) {
            $contactors = $visitors->random(rand(2, 8));
            foreach ($contactors as $visitor) {
                if (!Contact::where('user_id', $visitor->id)->where('ad_id', $ad->id)->exists()) {
                    Contact::create([
                        'user_id' => $visitor->id,
                        'ad_id' => $ad->id
                    ]);
                    $contactCount++;
                }
            }
        }

        // Create reports on a subset of ads
        $reportReasons = [
            'Contenu dupliqué', 'Annonce frauduleuse', 'Contact inapproprié',
            'Image offensive', 'Prix suspect', 'Information incorrecte',
            'Arnaque potentielle', 'Publicité cachée', 'Contenu adulte',
            'Spamming', 'Perte de temps', 'Qualité insuffisante'
        ];

        $reportedAds = $ads->random(floor(count($ads) * 0.15)); // Report ~15% of ads
        foreach ($reportedAds as $ad) {
            $reporters = $visitors->random(rand(1, 4));
            foreach ($reporters as $visitor) {
                if (!Report::where('user_id', $visitor->id)->where('ad_id', $ad->id)->exists()) {
                    Report::create([
                        'user_id' => $visitor->id,
                        'ad_id' => $ad->id,
                        'reason' => $reportReasons[array_rand($reportReasons)],
                        'status' => ['pending', 'reviewed', 'dismissed', 'resolved'][rand(0, 3)]
                    ]);
                    $reportCount++;
                }
            }
        }

        // Add VARIED boost states to ads
        $totalAdsForBoosts = count($ads);
        $boostTargetPercentage = 0.45; // 45% of ads get boosts
        $boostAds = $ads->random(max(1, floor($totalAdsForBoosts * $boostTargetPercentage)));

        foreach ($boostAds as $ad) {
            $boost = $boosts->random();
            
            // Vary boost states
            $boostState = rand(1, 100);
            
            if ($boostState <= 50) {
                // ACTIVE BOOST (Current, ongoing)
                $startDate = now()->subDays(rand(2, 10));
                $endDate = $startDate->clone()->addDays($boost->duration_days);
                
                AdBoost::create([
                    'ad_id' => $ad->id,
                    'boost_id' => $boost->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'active' => true
                ]);
                $activeBoostCount++;
                
            } elseif ($boostState <= 75) {
                // EXPIRED BOOST (Already finished)
                $startDate = now()->subDays(rand(30, 90));
                $endDate = $startDate->clone()->addDays($boost->duration_days);
                
                AdBoost::create([
                    'ad_id' => $ad->id,
                    'boost_id' => $boost->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'active' => false
                ]);
                $expiredBoostCount++;
                
            } else {
                // INACTIVE BOOST (Pending or disabled)
                $startDate = now()->addDays(rand(5, 30));
                $endDate = $startDate->clone()->addDays($boost->duration_days);
                
                AdBoost::create([
                    'ad_id' => $ad->id,
                    'boost_id' => $boost->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'active' => false
                ]);
                $inactiveBoostCount++;
            }
        }

        $this->command->info("✅ Massive interactions and varied boost states seeded!");
        $this->command->info("   Favorites: $favoriteCount");
        $this->command->info("   Views: $viewCount (authenticated + anonymous)");
        $this->command->info("   Contacts: $contactCount");
        $this->command->info("   Reports: $reportCount (with varied statuses)");
        $this->command->info("   Boosts:");
        $this->command->info("   - Active: $activeBoostCount (current/ongoing)");
        $this->command->info("   - Expired: $expiredBoostCount (finished)");
        $this->command->info("   - Inactive: $inactiveBoostCount (pending/disabled)");
    }
}
