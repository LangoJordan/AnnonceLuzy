<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed locations (countries and cities)
        $this->call(LocationSeeder::class);

        // 2. Seed categories and subcategories
        $this->call(CategorySeeder::class);

        // 3. Seed subscriptions (for agencies to use)
        $this->call(SubscriptionSeeder::class);

        // 4. Seed boosts (for ads to use)
        $this->call(BoostSeeder::class);

        // 5. Seed users (admin, agencies, and visitors)
        $this->call(UserSeeder::class);

        // 6. Seed agency spaces and assign subscriptions with varied states
        $this->call(AgencySpaceSeeder::class);

        // 7. Seed employee positions and managers
        $this->call(EmployeePositionSeeder::class);

        // 8. Seed massive advertisements with features (500+)
        $this->call(AdSeeder::class);

        // 9. Seed user interactions and ad boosts with varied states
        $this->call(InteractionSeeder::class);

        // 10. Seed advanced transactions with massive variations
        $this->call(AdvancedTransactionSeeder::class);
    }
}
