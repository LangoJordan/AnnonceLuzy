<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Transaction;
use App\Models\AdBoost;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $agencies = User::where('user_type', 'agency')->get();
        $adBoosts = AdBoost::with('ad')->get();

        if ($agencies->isEmpty()) {
            $this->command->warn('UserSeeder must be run before TransactionSeeder');
            return;
        }

        $transactionCount = 0;
        $statuses = ['success', 'pending', 'failed'];

        // Create subscription transactions for agencies
        foreach ($agencies as $agency) {
            // Each agency gets 1-3 subscription transactions
            $subscriptionCount = rand(1, 3);
            
            for ($i = 0; $i < $subscriptionCount; $i++) {
                $status = $statuses[rand(0, 2)];
                $amount = rand(2999, 29999); // Between 29.99 and 299.99 euros
                
                Transaction::create([
                    'sender_id' => $agency->id,
                    'receiver_id' => null, // Platform receives it
                    'amount' => $amount,
                    'mode' => 'card', // or 'transfer', 'paypal'
                    'status' => $status,
                    'transaction_type' => 'subscription',
                    'date' => now()->subDays(rand(1, 180))
                ]);
                $transactionCount++;
            }
        }

        // Create boost transactions for agencies (based on their boosts)
        foreach ($adBoosts as $boostRecord) {
            $ad = $boostRecord->ad;
            
            // Create transaction for boost
            if (rand(0, 1)) { // 50% of boosts have recorded transactions
                $status = $boostRecord->active ? 'success' : (rand(0, 1) ? 'pending' : 'failed');
                
                Transaction::create([
                    'sender_id' => $ad->user_id,
                    'receiver_id' => null, // Platform receives it
                    'amount' => rand(999, 19999), // Between 9.99 and 199.99 euros
                    'mode' => ['card', 'transfer', 'paypal'][rand(0, 2)],
                    'status' => $status,
                    'transaction_type' => 'boost',
                    'date' => now()->subDays(rand(1, 180))
                ]);
                $transactionCount++;
            }
        }

        // Create some failed/pending transactions for variety
        foreach ($agencies as $agency) {
            $failedCount = rand(0, 2);
            for ($i = 0; $i < $failedCount; $i++) {
                Transaction::create([
                    'sender_id' => $agency->id,
                    'receiver_id' => null,
                    'amount' => rand(500, 10000),
                    'mode' => ['card', 'transfer', 'paypal'][rand(0, 2)],
                    'status' => 'failed',
                    'transaction_type' => rand(0, 1) ? 'subscription' : 'boost',
                    'date' => now()->subDays(rand(1, 180))
                ]);
                $transactionCount++;
            }
        }

        $this->command->info("Transactions seeded successfully! ($transactionCount transactions created)");
    }
}
