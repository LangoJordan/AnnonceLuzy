<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Get all countries and cities for random assignment
        $countries = \App\Models\Country::all();
        $cities = \App\Models\City::all();

        if ($countries->isEmpty() || $cities->isEmpty()) {
            $this->command->warn('LocationSeeder must be run before UserSeeder');
            return;
        }

        $password = Hash::make('qwertyuiop');

        // Create Administrator
        $admin = User::firstOrCreate(
            ['email' => 'admin@plateforme.com'],
            [
                'name' => 'Administrateur Principal',
                'password' => $password,
                'phone' => '+33612345678',
                'country_id' => $countries->random()->id,
                'city_id' => $cities->random()->id,
                'user_type' => 'admin',
                'status' => true,
            ]
        );

        Profile::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'description' => 'Administrateur de la plateforme d\'annonces',
                'slogan' => 'Gestion et modération'
            ]
        );

        // Create Agencies (with profiles)
        $agencyNames = [
            ['name' => 'Immo Pro Solutions', 'email' => 'contact@immopro.com'],
            ['name' => 'Auto Excellence', 'email' => 'contact@autoexcel.com'],
            ['name' => 'Tech Store Plus', 'email' => 'info@techstore.com'],
            ['name' => 'Meubles & Design', 'email' => 'contact@meubles.com'],
            ['name' => 'Mode Boutique', 'email' => 'sales@modebout.com'],
            ['name' => 'Services Experts', 'email' => 'contact@servexperts.com'],
            ['name' => 'Sports Pro Shop', 'email' => 'info@sportspro.com'],
            ['name' => 'Emploi Services', 'email' => 'recrutement@emploi.com'],
        ];

        $agencies = [];
        foreach ($agencyNames as $index => $agencyData) {
            $agency = User::firstOrCreate(
                ['email' => $agencyData['email']],
                [
                    'name' => $agencyData['name'],
                    'password' => $password,
                    'phone' => '+33' . (600000000 + $index * 1000000) % 999999999,
                    'country_id' => $countries->random()->id,
                    'city_id' => $cities->random()->id,
                    'merchant_code' => 'MERCH_' . strtoupper(substr($agencyData['name'], 0, 4)) . '_' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                    'user_type' => 'agency',
                    'status' => true,
                ]
            );

            // Create profile for agency
            Profile::firstOrCreate(
                ['user_id' => $agency->id],
                [
                    'description' => 'Agence professionnelle spécialisée dans ' . strtolower($agencyData['name']),
                    'slogan' => 'Excellence et qualité de service',
                    'photo' => 'https://via.placeholder.com/200?text=' . urlencode($agencyData['name']),
                ]
            );

            $agencies[] = $agency;
        }

        // Create Visitors
        $visitorNames = [
            'Jean Dupont', 'Marie Martin', 'Pierre Bernard', 'Sophie Lefebvre',
            'Luc Moreau', 'Anne Girard', 'Marc Laurent', 'Isabelle Bonnet',
            'Thomas Renard', 'Claire Marchand', 'Antoine Fournier', 'Nathalie Leduc',
            'Nicolas Chevalier', 'Virginie Arnould', 'Olivier Rousseau', 'Laure Gagnon',
            'Stéphane Blanchard', 'Michèle Royer', 'Benjamin Gérard', 'Valerie Petit',
            'François Hubert', 'Dominique Baudet', 'Xavier Boulanger', 'Éléonore Leclerc',
            'Laurent Roux', 'Francoise Arnaud', 'Yves Mahieux', 'Monique Fontaine',
            'Philippe Benoit', 'Jacqueline Rivière', 'Jacques Henry', 'Sylviane Dauphin',
            'Alain Blanc', 'Yvette Texier', 'Robert Faure', 'Christiane Brunet',
            'Étienne Moulin', 'Bernadette Maillard', 'Claude Tissot', 'Paulette Gaudin',
        ];

        foreach ($visitorNames as $index => $name) {
            $email = 'visitor' . str_pad($index + 1, 3, '0', STR_PAD_LEFT) . '@example.com';
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => $password,
                    'phone' => '+33' . (700000000 + $index * 100000) % 999999999,
                    'country_id' => $countries->random()->id,
                    'city_id' => $cities->random()->id,
                    'user_type' => 'visitor',
                    'status' => true,
                ]
            );

            // Create profile for visitor
            Profile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'description' => 'Visiteur intéressé par les annonces ' . ($index % 2 === 0 ? 'immobilières' : 'automobiles'),
                    'photo' => 'https://via.placeholder.com/150?text=' . urlencode(substr($name, 0, 1)),
                ]
            );
        }

        $this->command->info('Users seeded successfully! (' . (1 + count($agencies) + count($visitorNames)) . ' users created)');
    }
}
