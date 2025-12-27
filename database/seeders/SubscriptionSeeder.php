<?php

namespace Database\Seeders;

use App\Models\Subscription;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        // Starter Plan
        Subscription::firstOrCreate(
            ['label' => 'Plan Starter'],
            [
                'amount' => 2999, // 29.99 euros
                'max_ads' => 5,
                'max_spaces' => 1,
                'duration_days' => 30,
                'is_active' => 1
            ]
        );

        // Professional Plan
        Subscription::firstOrCreate(
            ['label' => 'Plan Professionnel'],
            [
                'amount' => 7999, // 79.99 euros
                'max_ads' => 25,
                'max_spaces' => 3,
                'duration_days' => 30,
                'is_active' => 1
            ]
        );

        // Premium Plan
        Subscription::firstOrCreate(
            ['label' => 'Plan Premium'],
            [
                'amount' => 14999, // 149.99 euros
                'max_ads' => 100,
                'max_spaces' => 10,
                'duration_days' => 30,
                'is_active' => 1
            ]
        );

        // Enterprise Plan
        Subscription::firstOrCreate(
            ['label' => 'Plan Entreprise'],
            [
                'amount' => 29999, // 299.99 euros
                'max_ads' => 500,
                'max_spaces' => 50,
                'duration_days' => 30,
                'is_active' => 1
            ]
        );

        // Annual Starter Plan
        Subscription::firstOrCreate(
            ['label' => 'Plan Starter Annuel'],
            [
                'amount' => 29999, // 299.99 euros for yearly (saves 20%)
                'max_ads' => 5,
                'max_spaces' => 1,
                'duration_days' => 365,
                'is_active' => 1
            ]
        );

        // Annual Professional Plan
        Subscription::firstOrCreate(
            ['label' => 'Plan Professionnel Annuel'],
            [
                'amount' => 79999, // 799.99 euros for yearly (saves 20%)
                'max_ads' => 25,
                'max_spaces' => 3,
                'duration_days' => 365,
                'is_active' => 1
            ]
        );

        $this->command->info('Subscriptions seeded successfully!');
    }
}
