<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Transaction;
use App\Models\AdBoost;
use App\Models\UserSubscription;
use Illuminate\Database\Seeder;

class AdvancedTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $agencies = User::where('user_type', 'agency')->get();
        $adBoosts = AdBoost::with('ad')->get();
        $userSubscriptions = UserSubscription::where('user_id', '!=', null)->get();

        if ($agencies->isEmpty()) {
            $this->command->warn('UserSeeder must be run before AdvancedTransactionSeeder');
            return;
        }

        $transactionCount = 0;
        $statuses = ['success', 'pending', 'failed'];
        $modes = ['card', 'transfer', 'paypal', 'crypto', 'bank_wire'];

        // 1. Create subscription transaction history
        foreach ($agencies as $agency) {
            // Create 3-8 subscription transactions per agency
            $subscriptionTransactionCount = rand(3, 8);
            
            for ($i = 0; $i < $subscriptionTransactionCount; $i++) {
                $status = $statuses[rand(0, 2)];
                $amount = rand(2999, 29999); // Between €29.99 and €299.99
                $mode = $modes[rand(0, count($modes) - 1)];
                
                // Spread transactions over time (last 12 months)
                $daysAgo = rand(1, 365);
                
                Transaction::create([
                    'sender_id' => $agency->id,
                    'receiver_id' => null, // Platform receives
                    'amount' => $amount,
                    'mode' => $mode,
                    'status' => $status,
                    'transaction_type' => 'subscription',
                    'date' => now()->subDays($daysAgo)
                ]);
                $transactionCount++;
            }
        }

        // 2. Create boost transactions with massive variation
        foreach ($adBoosts as $boostRecord) {
            $ad = $boostRecord->ad;
            
            // Create transaction for each boost with probability
            if (rand(1, 100) <= 85) { // 85% of boosts have transaction records
                
                // Determine status based on boost state
                if ($boostRecord->active && $boostRecord->end_date > now()) {
                    // Active boost = likely successful
                    $status = rand(1, 100) <= 95 ? 'success' : 'pending';
                } else {
                    // Expired boost = could be successful, failed, or pending
                    $status = $statuses[rand(0, 2)];
                }
                
                $mode = $modes[rand(0, count($modes) - 1)];
                $amount = rand(999, 19999); // Between €9.99 and €199.99
                
                Transaction::create([
                    'sender_id' => $ad->user_id,
                    'receiver_id' => null, // Platform receives
                    'amount' => $amount,
                    'mode' => $mode,
                    'status' => $status,
                    'transaction_type' => 'boost',
                    'date' => now()->subDays(rand(1, 180))
                ]);
                $transactionCount++;
            }
        }

        // 3. Create failed/retry transaction history
        foreach ($agencies as $agency) {
            // 0-2 failed attempts per agency
            $failedAttempts = rand(0, 2);
            
            for ($i = 0; $i < $failedAttempts; $i++) {
                Transaction::create([
                    'sender_id' => $agency->id,
                    'receiver_id' => null,
                    'amount' => rand(500, 10000),
                    'mode' => $modes[rand(0, count($modes) - 1)],
                    'status' => 'failed',
                    'transaction_type' => rand(0, 1) ? 'subscription' : 'boost',
                    'date' => now()->subDays(rand(1, 365))
                ]);
                $transactionCount++;
            }
        }

        // 4. Create pending transactions (under processing)
        $agenciesToCreate = max(1, floor(count($agencies) * 0.4)); // 40% of agencies
        foreach ($agencies->random($agenciesToCreate) as $agency) {
            $pendingCount = rand(1, 2);
            
            for ($i = 0; $i < $pendingCount; $i++) {
                Transaction::create([
                    'sender_id' => $agency->id,
                    'receiver_id' => null,
                    'amount' => rand(2999, 19999),
                    'mode' => $modes[rand(0, count($modes) - 1)],
                    'status' => 'pending',
                    'transaction_type' => rand(0, 1) ? 'subscription' : 'boost',
                    'date' => now()->subDays(rand(0, 7)) // Recent pending
                ]);
                $transactionCount++;
            }
        }

        // 5. Create high-value transaction records
        foreach ($agencies->random(max(1, floor(count($agencies) * 0.3))) as $agency) {
            $highValueCount = rand(1, 2);
            
            for ($i = 0; $i < $highValueCount; $i++) {
                Transaction::create([
                    'sender_id' => $agency->id,
                    'receiver_id' => null,
                    'amount' => rand(50000, 150000), // High value €500-€1500
                    'mode' => 'bank_wire',
                    'status' => $statuses[rand(0, 2)],
                    'transaction_type' => 'subscription',
                    'date' => now()->subDays(rand(1, 180))
                ]);
                $transactionCount++;
            }
        }

        // 6. Statistics reporting
        $successCount = Transaction::where('status', 'success')->count();
        $failedCount = Transaction::where('status', 'failed')->count();
        $pendingCount = Transaction::where('status', 'pending')->count();
        $boostTxCount = Transaction::where('transaction_type', 'boost')->count();
        $subscriptionTxCount = Transaction::where('transaction_type', 'subscription')->count();

        $this->command->info("✅ Advanced transaction seeding completed!");
        $this->command->info("   Total Transactions: $transactionCount");
        $this->command->info("   Statuses:");
        $this->command->info("   - Success: $successCount");
        $this->command->info("   - Failed: $failedCount");
        $this->command->info("   - Pending: $pendingCount");
        $this->command->info("   Types:");
        $this->command->info("   - Subscriptions: $subscriptionTxCount");
        $this->command->info("   - Boosts: $boostTxCount");
        $this->command->info("   Modes: card, transfer, paypal, crypto, bank_wire");
        $this->command->info("   Time Range: Last 12 months");
    }
}
