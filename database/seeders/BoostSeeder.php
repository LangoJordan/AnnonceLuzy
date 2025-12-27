<?php

namespace Database\Seeders;

use App\Models\Boost;
use Illuminate\Database\Seeder;

class BoostSeeder extends Seeder
{
    public function run(): void
    {
        // Boost 7 days - Standard
        Boost::firstOrCreate(
            ['label' => 'Boost 7 jours'],
            [
                'amount' => 999, // 9.99 euros
                'duration_days' => 7,
                'priority_level' => 1
            ]
        );

        // Boost 7 days - Premium
        Boost::firstOrCreate(
            ['label' => 'Boost 7 jours Premium'],
            [
                'amount' => 1999, // 19.99 euros
                'duration_days' => 7,
                'priority_level' => 2
            ]
        );

        // Boost 14 days - Standard
        Boost::firstOrCreate(
            ['label' => 'Boost 14 jours'],
            [
                'amount' => 1799, // 17.99 euros
                'duration_days' => 14,
                'priority_level' => 1
            ]
        );

        // Boost 14 days - Premium
        Boost::firstOrCreate(
            ['label' => 'Boost 14 jours Premium'],
            [
                'amount' => 3499, // 34.99 euros
                'duration_days' => 14,
                'priority_level' => 2
            ]
        );

        // Boost 30 days - Standard
        Boost::firstOrCreate(
            ['label' => 'Boost 30 jours'],
            [
                'amount' => 3299, // 32.99 euros
                'duration_days' => 30,
                'priority_level' => 1
            ]
        );

        // Boost 30 days - Premium
        Boost::firstOrCreate(
            ['label' => 'Boost 30 jours Premium'],
            [
                'amount' => 6499, // 64.99 euros
                'duration_days' => 30,
                'priority_level' => 2
            ]
        );

        // Boost 30 days - Elite
        Boost::firstOrCreate(
            ['label' => 'Boost 30 jours Elite'],
            [
                'amount' => 9999, // 99.99 euros
                'duration_days' => 30,
                'priority_level' => 3
            ]
        );

        // Boost 90 days - Premium
        Boost::firstOrCreate(
            ['label' => 'Boost 90 jours Premium'],
            [
                'amount' => 17999, // 179.99 euros
                'duration_days' => 90,
                'priority_level' => 2
            ]
        );

        $this->command->info('Boosts seeded successfully!');
    }
}
