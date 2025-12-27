<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\City;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        // France
        $france = Country::firstOrCreate(
            ['code' => 'FR'],
            ['name' => 'France', 'phone_code' => '+33', 'is_active' => true]
        );

        $frenchCities = [
            'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 
            'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes',
            'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Angers',
            'Villeurbanne', 'Saint-Denis', 'Nîmes', 'Pense', 'Aix-en-Provence',
            'Brest', 'Reims', 'Le Mans', 'Saint-Paul', 'Clermont-Ferrand'
        ];

        foreach ($frenchCities as $city) {
            City::firstOrCreate(
                ['country_id' => $france->id, 'name' => $city],
                ['is_active' => true]
            );
        }

        // Belgium
        $belgium = Country::firstOrCreate(
            ['code' => 'BE'],
            ['name' => 'Belgique', 'phone_code' => '+32', 'is_active' => true]
        );

        $belgiumCities = [
            'Bruxelles', 'Anvers', 'Gand', 'Charleroi', 'Liège', 'Bruges',
            'Alost', 'Malines', 'Termonde', 'Tournai', 'Mons', 'Hasselt'
        ];

        foreach ($belgiumCities as $city) {
            City::firstOrCreate(
                ['country_id' => $belgium->id, 'name' => $city],
                ['is_active' => true]
            );
        }

        // Switzerland
        $switzerland = Country::firstOrCreate(
            ['code' => 'CH'],
            ['name' => 'Suisse', 'phone_code' => '+41', 'is_active' => true]
        );

        $swissCities = [
            'Zurich', 'Genève', 'Bâle', 'Berne', 'Lausanne', 'Lugano',
            'Lucerne', 'Schaffhouse', 'Saint-Gall', 'Zoug', 'Winterthour',
            'Fribourg', 'Neuchâtel', 'Sion'
        ];

        foreach ($swissCities as $city) {
            City::firstOrCreate(
                ['country_id' => $switzerland->id, 'name' => $city],
                ['is_active' => true]
            );
        }

        // Luxembourg
        $luxembourg = Country::firstOrCreate(
            ['code' => 'LU'],
            ['name' => 'Luxembourg', 'phone_code' => '+352', 'is_active' => true]
        );

        $luxCities = [
            'Luxembourg', 'Esch-sur-Alzette', 'Differdange', 'Dudelange',
            'Schifflange', 'Pétange', 'Rumelange', 'Grevenmacher'
        ];

        foreach ($luxCities as $city) {
            City::firstOrCreate(
                ['country_id' => $luxembourg->id, 'name' => $city],
                ['is_active' => true]
            );
        }

        // Canada
        $canada = Country::firstOrCreate(
            ['code' => 'CA'],
            ['name' => 'Canada', 'phone_code' => '+1', 'is_active' => true]
        );

        $canadaCities = [
            'Toronto', 'Montréal', 'Vancouver', 'Calgary', 'Ottawa', 'Winnipeg',
            'Québec', 'Hamilton', 'Kitchener', 'London', 'Markham', 'Vaughan',
            'Brampton', 'Gatineau', 'Longueuil', 'Mississauga', 'Scarborough',
            'Laval', 'Coquitlam', 'North York'
        ];

        foreach ($canadaCities as $city) {
            City::firstOrCreate(
                ['country_id' => $canada->id, 'name' => $city],
                ['is_active' => true]
            );
        }

        // Cameroon (bonus)
        $cameroon = Country::firstOrCreate(
            ['code' => 'CM'],
            ['name' => 'Cameroun', 'phone_code' => '+237', 'is_active' => true]
        );

        $cameroonCities = [
            'Douala', 'Yaoundé', 'Garoua', 'Bamenda', 'Bafoussam', 'Limbe',
            'Kumba', 'Buea', 'Koutaba', 'Bertoua', 'Ngaoundéré', 'Maroua'
        ];

        foreach ($cameroonCities as $city) {
            City::firstOrCreate(
                ['country_id' => $cameroon->id, 'name' => $city],
                ['is_active' => true]
            );
        }

        $this->command->info('Location data seeded successfully!');
    }
}
