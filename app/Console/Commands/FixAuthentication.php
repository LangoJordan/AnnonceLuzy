<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class FixAuthentication extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fix-authentication';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix authentication issues (419 Page Expired, CSRF, sessions)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔧 Démarrage de la réparation de l\'authentification...');
        $this->newLine();

        // Step 1: Create sessions directory
        $this->info('📁 Création du dossier des sessions...');
        if (!File::exists(storage_path('framework/sessions'))) {
            File::makeDirectory(storage_path('framework/sessions'), 0755, true);
            $this->line('✅ Dossier créé : storage/framework/sessions');
        } else {
            $this->line('✅ Dossier existe déjà : storage/framework/sessions');
        }

        // Step 2: Clear sessions
        $this->info('🧹 Nettoyage des vieilles sessions...');
        $sessions = File::glob(storage_path('framework/sessions/*'));
        $deletedCount = 0;
        foreach ($sessions as $session) {
            if (File::isFile($session)) {
                File::delete($session);
                $deletedCount++;
            }
        }
        $this->line("✅ Supprimées {$deletedCount} sessions");

        // Step 3: Clear caches
        $this->info('🗑️ Nettoyage des caches...');
        $this->call('cache:clear');
        $this->call('config:clear');
        $this->call('view:clear');

        // Step 4: Display next steps
        $this->newLine();
        $this->info('✅ Réparation terminée!');
        $this->newLine();

        $this->warn('📋 Prochaines étapes:');
        $this->line('1. Vérifiez votre fichier .env:');
        $this->line('   SESSION_DRIVER=file');
        $this->newLine();
        $this->line('2. Recompiler les assets:');
        $this->line('   npm run dev');
        $this->newLine();
        $this->line('3. Tester la connexion à /login');
        $this->newLine();

        $this->info('💡 Pour plus d\'informations, consultez FIX_AUTHENTICATION_COMPLETE.md');
    }
}
