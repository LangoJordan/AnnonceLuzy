<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AgencySpace;
use App\Models\EmployeePosition;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class EmployeePositionSeeder extends Seeder
{
    public function run(): void
    {
        $agencies = User::where('user_type', 'agency')->get();
        $agencySpaces = AgencySpace::all();

        if ($agencies->isEmpty() || $agencySpaces->isEmpty()) {
            $this->command->warn('UserSeeder and AgencySpaceSeeder must be run before EmployeePositionSeeder');
            return;
        }

        $password = Hash::make('qwertyuiop');
        $roles = ['manager', 'commercial', 'admin', 'supervisor', 'coordinator', 'assistant', 'operator'];
        
        $employeeNames = [
            'Jean Martin', 'Sophie Bernard', 'Marc Dupont', 'Anne Lefebvre', 'Pierre Moreau',
            'Claire Girard', 'Luc Laurent', 'Isabelle Bonnet', 'Thomas Renard', 'Nathalie Marchand',
            'Antoine Fournier', 'Valérie Leduc', 'Nicolas Chevalier', 'Michèle Arnould',
            'Olivier Rousseau', 'Laure Gagnon', 'Stéphane Blanchard', 'Sandra Royer',
            'Benjamin Gérard', 'Dominique Petit', 'François Hubert', 'Yvette Baudet',
            'Xavier Boulanger', 'Éléonore Leclerc', 'Laurent Roux', 'Francoise Arnaud',
            'Yves Mahieux', 'Monique Fontaine', 'Philippe Benoit', 'Jacqueline Rivière',
            'Jacques Henry', 'Sylviane Dauphin', 'Alain Blanc', 'Yvette Texier',
            'Robert Faure', 'Christiane Brunet', 'Étienne Moulin', 'Bernadette Maillard',
            'Claude Tissot', 'Paulette Gaudin', 'Roger Mercier', 'Simone Gaston',
            'Serge Leconte', 'Gisèle Rousseau', 'Maurice Petit', 'Marguerite Renault',
            'André Lefevre', 'Jeanne Duval', 'Paul Moreau', 'Raymonde Garnier'
        ];

        $positionCount = 0;
        $employeeCount = 0;

        // Create employee positions and link them to spaces
        foreach ($agencies as $agencyIndex => $agency) {
            $agencySpacesForThisAgency = $agencySpaces->where('agency_id', $agency->id);
            
            if ($agencySpacesForThisAgency->isEmpty()) {
                continue;
            }

            // Create 3-6 employees per agency
            $employeesPerAgency = rand(3, 6);
            
            for ($e = 0; $e < $employeesPerAgency; $e++) {
                $employeeName = $employeeNames[($agencyIndex * 6 + $e) % count($employeeNames)];
                
                $employee = User::firstOrCreate(
                    ['email' => 'employee_' . str_pad($agencyIndex, 2, '0', STR_PAD_LEFT) . '_' . str_pad($e, 2, '0', STR_PAD_LEFT) . '@' . str_replace(' ', '', strtolower($agency->name)) . '.com'],
                    [
                        'name' => $employeeName,
                        'password' => $password,
                        'phone' => '+33' . (700000000 + $agencyIndex * 100000 + $e * 10000) % 999999999,
                        'country_id' => $agency->country_id,
                        'city_id' => $agency->city_id,
                        'user_type' => 'employee',
                        'status' => true,
                    ]
                );
                $employeeCount++;

                // Assign this employee to 1-3 spaces within their agency
                $spacesCount = rand(1, min(3, $agencySpacesForThisAgency->count()));
                $assignedSpaces = $agencySpacesForThisAgency->random($spacesCount);
                
                foreach ($assignedSpaces as $space) {
                    // Check if position doesn't already exist
                    if (!EmployeePosition::where('user_id', $employee->id)
                                         ->where('space_id', $space->id)
                                         ->exists()) {
                        EmployeePosition::create([
                            'user_id' => $employee->id,
                            'space_id' => $space->id,
                            'role' => $roles[array_rand($roles)]
                        ]);
                        $positionCount++;
                    }
                }
            }
        }

        // Create managers for the admin
        $admin = User::where('user_type', 'admin')->first();
        if ($admin) {
            $managerNames = ['Marc Leblanc', 'Sophie Mercier', 'Jean-Paul Durand', 'Claire Fournier', 'Stéphane Gautier'];
            
            foreach ($managerNames as $index => $managerName) {
                $manager = User::firstOrCreate(
                    ['email' => 'manager_' . str_pad($index + 1, 2, '0', STR_PAD_LEFT) . '@plateforme.com'],
                    [
                        'name' => $managerName,
                        'password' => $password,
                        'phone' => '+33' . (800000000 + $index * 100000) % 999999999,
                        'user_type' => 'manager',
                        'status' => true,
                    ]
                );
                $employeeCount++;
            }
        }

        $this->command->info("✅ Employee positions seeded successfully!");
        $this->command->info("   Created: $employeeCount employees (+ managers)");
        $this->command->info("   Positions: $positionCount employee-space assignments");
        $this->command->info("   Roles: varied (manager, commercial, admin, supervisor, etc.)");
    }
}
