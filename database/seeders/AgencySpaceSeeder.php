<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AgencySpace;
use App\Models\Subscription;
use Illuminate\Database\Seeder;

class AgencySpaceSeeder extends Seeder
{
    public function run(): void
    {
        $agencies = User::where('user_type', 'agency')->get();
        $subscriptions = Subscription::all();
        $countries = \App\Models\Country::all();
        $cities = \App\Models\City::all();

        if ($agencies->isEmpty() || $subscriptions->isEmpty()) {
            $this->command->warn('UserSeeder and SubscriptionSeeder must be run before AgencySpaceSeeder');
            return;
        }

        $spaceNames = [
            'Siège Social', 'Filiale Paris', 'Succursale Lyon', 'Bureau Marseille',
            'Magasin Toulouse', 'Showroom Bordeaux', 'Centre Lille', 'Agence Nantes',
            'Bureau Strasbourg', 'Antenne Bordeaux', 'Desk Montpellier', 'Zone Grenoble'
        ];

        $spaceIndex = 0;
        $subscriptionCount = 0;

        foreach ($agencies as $agency) {
            // Create 2-4 commercial spaces for each agency
            $spaceCount = rand(2, 4);
            $spaces = [];
            
            for ($i = 0; $i < $spaceCount; $i++) {
                $space = AgencySpace::firstOrCreate(
                    ['merchant_code' => 'SPACE_' . str_pad(++$spaceIndex, 4, '0', STR_PAD_LEFT)],
                    [
                        'agency_id' => $agency->id,
                        'name' => $spaceNames[$i % count($spaceNames)] . ' - ' . $agency->name,
                        'email' => 'space' . $spaceIndex . '@' . str_replace(' ', '', strtolower($agency->name)) . '.com',
                        'phone' => '+33' . (600000000 + $spaceIndex * 10000) % 999999999,
                        'country_id' => $countries->random()->id,
                        'city_id' => $cities->random()->id,
                        'address' => rand(1, 999) . ' ' . ['Rue', 'Avenue', 'Boulevard', 'Chemin'][rand(0, 3)] . ' Test ' . $spaceIndex,
                        'status' => true,
                    ]
                );
                $spaces[] = $space;
            }

            // Create multiple subscriptions with VARIED states for each agency
            
            // 1. ACTIVE SUBSCRIPTION (Current, valid)
            $activeSubscription = $subscriptions->random();
            $agency->subscriptions()->attach($activeSubscription, [
                'start_date' => now()->subDays(rand(5, 20))->startOfDay(),
                'end_date' => now()->addDays(rand(10, 60))->startOfDay(),
                'status' => 1
            ]);
            $subscriptionCount++;

            // 2. EXPIRED SUBSCRIPTION (Old, expired)
            if (rand(0, 1)) {
                $expiredSubscription = $subscriptions->random();
                $agency->subscriptions()->attach($expiredSubscription, [
                    'start_date' => now()->subDays(rand(90, 180))->startOfDay(),
                    'end_date' => now()->subDays(rand(10, 60))->startOfDay(), // Already expired
                    'status' => 0 // Expired/Inactive
                ]);
                $subscriptionCount++;
            }

            // 3. NEW/FUTURE SUBSCRIPTION (Starting soon)
            if (rand(0, 1)) {
                $futureSubscription = $subscriptions->random();
                $agency->subscriptions()->attach($futureSubscription, [
                    'start_date' => now()->addDays(rand(5, 30))->startOfDay(),
                    'end_date' => now()->addDays(rand(35, 90))->startOfDay(),
                    'status' => 0 // Not yet active
                ]);
                $subscriptionCount++;
            }

            // 4. ADDITIONAL EXPIRED SUBSCRIPTION (For history)
            if (rand(0, 1)) {
                $oldExpiredSubscription = $subscriptions->random();
                $agency->subscriptions()->attach($oldExpiredSubscription, [
                    'start_date' => now()->subDays(rand(200, 300))->startOfDay(),
                    'end_date' => now()->subDays(rand(100, 150))->startOfDay(),
                    'status' => 0
                ]);
                $subscriptionCount++;
            }

            // 5. ALTERNATIVE ACTIVE SUBSCRIPTION (Multiple current plans)
            if (rand(0, 1)) {
                $altActiveSubscription = $subscriptions->random();
                $agency->subscriptions()->attach($altActiveSubscription, [
                    'start_date' => now()->subDays(rand(1, 10))->startOfDay(),
                    'end_date' => now()->addDays(rand(20, 80))->startOfDay(),
                    'status' => 1
                ]);
                $subscriptionCount++;
            }
        }

        $this->command->info('✅ Agency spaces and multi-state subscriptions seeded successfully!');
        $this->command->info("   Created: " . ($spaceIndex) . " commercial spaces");
        $this->command->info("   Subscriptions: $subscriptionCount with varied states:");
        $this->command->info("   - Active subscriptions (current, valid)");
        $this->command->info("   - Expired subscriptions (old, inactive)");
        $this->command->info("   - Future subscriptions (not yet started)");
    }
}
