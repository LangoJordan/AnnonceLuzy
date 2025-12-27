<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Real Estate Category
        $realEstate = Category::firstOrCreate(
            ['name' => 'Immobilier'],
            ['slug' => 'immobilier', 'description' => 'Annonces immobilières : acheter, louer ou vendre des propriétés']
        );

        $realEstateSubcategories = [
            'Appartements' => 'Locations et ventes d\'appartements',
            'Maisons' => 'Locations et ventes de maisons',
            'Terrains' => 'Vente de terrains',
            'Bureaux' => 'Locations et ventes de bureaux',
            'Locaux Commerciaux' => 'Locations et ventes de locaux commerciaux'
        ];

        foreach ($realEstateSubcategories as $name => $description) {
            Subcategory::firstOrCreate(
                ['category_id' => $realEstate->id, 'name' => $name],
                ['slug' => strtolower(str_replace(' ', '-', $name)), 'description' => $description]
            );
        }

        // Automobiles Category
        $cars = Category::firstOrCreate(
            ['name' => 'Automobiles'],
            ['slug' => 'automobiles', 'description' => 'Vente et achat de véhicules automobiles']
        );

        $carSubcategories = [
            'Voitures Neuves' => 'Vente de voitures neuves',
            'Voitures d\'Occasion' => 'Vente de voitures d\'occasion',
            'Motos & Scooters' => 'Vente de motos et scooters',
            'Pièces Détachées' => 'Vente de pièces automobiles',
            'Accessoires Auto' => 'Accessoires et équipements automobiles'
        ];

        foreach ($carSubcategories as $name => $description) {
            Subcategory::firstOrCreate(
                ['category_id' => $cars->id, 'name' => $name],
                ['slug' => strtolower(str_replace(' ', '-', $name)), 'description' => $description]
            );
        }

        // Electronics Category
        $electronics = Category::firstOrCreate(
            ['name' => 'Électronique'],
            ['slug' => 'electronique', 'description' => 'Appareils électroniques et informatique']
        );

        $electronicsSubcategories = [
            'Téléphones' => 'Smartphones et téléphones portables',
            'Ordinateurs' => 'Ordinateurs portables et de bureau',
            'Tablettes' => 'Tablettes électroniques',
            'Téléviseurs' => 'Téléviseurs et écrans',
            'Consoles de Jeu' => 'Consoles et jeux vidéo'
        ];

        foreach ($electronicsSubcategories as $name => $description) {
            Subcategory::firstOrCreate(
                ['category_id' => $electronics->id, 'name' => $name],
                ['slug' => strtolower(str_replace(' ', '-', $name)), 'description' => $description]
            );
        }

        // Furniture Category
        $furniture = Category::firstOrCreate(
            ['name' => 'Meubles & Décoration'],
            ['slug' => 'meubles-decoration', 'description' => 'Meubles, décoration d\'intérieur et articles ménagers']
        );

        $furnitureSubcategories = [
            'Canapés & Fauteuils' => 'Canapés, fauteuils et sièges',
            'Tables & Chaises' => 'Tables et chaises',
            'Lits & Matelas' => 'Lits et matelas',
            'Étagères & Rangement' => 'Meubles de rangement',
            'Décoration' => 'Articles de décoration'
        ];

        foreach ($furnitureSubcategories as $name => $description) {
            Subcategory::firstOrCreate(
                ['category_id' => $furniture->id, 'name' => $name],
                ['slug' => strtolower(str_replace(' ', '-', $name)), 'description' => $description]
            );
        }

        // Fashion Category
        $fashion = Category::firstOrCreate(
            ['name' => 'Mode & Vêtements'],
            ['slug' => 'mode-vetements', 'description' => 'Vêtements, chaussures et accessoires de mode']
        );

        $fashionSubcategories = [
            'Vêtements Femme' => 'Vêtements pour femmes',
            'Vêtements Homme' => 'Vêtements pour hommes',
            'Chaussures' => 'Chaussures et bottes',
            'Accessoires' => 'Accessoires de mode',
            'Montres & Bijoux' => 'Montres et bijoux'
        ];

        foreach ($fashionSubcategories as $name => $description) {
            Subcategory::firstOrCreate(
                ['category_id' => $fashion->id, 'name' => $name],
                ['slug' => strtolower(str_replace(' ', '-', $name)), 'description' => $description]
            );
        }

        // Services Category
        $services = Category::firstOrCreate(
            ['name' => 'Services'],
            ['slug' => 'services', 'description' => 'Offres de services professionnels et personnels']
        );

        $servicesSubcategories = [
            'Services Informatiques' => 'Services IT et développement web',
            'Services de Nettoyage' => 'Services de nettoyage et entretien',
            'Services de Plomberie' => 'Services de plomberie et travaux',
            'Services Électriques' => 'Services électriques',
            'Consultation & Conseils' => 'Services de consultation'
        ];

        foreach ($servicesSubcategories as $name => $description) {
            Subcategory::firstOrCreate(
                ['category_id' => $services->id, 'name' => $name],
                ['slug' => strtolower(str_replace(' ', '-', $name)), 'description' => $description]
            );
        }

        // Sports & Loisirs Category
        $sports = Category::firstOrCreate(
            ['name' => 'Sports & Loisirs'],
            ['slug' => 'sports-loisirs', 'description' => 'Équipements sportifs et loisirs']
        );

        $sportsSubcategories = [
            'Fitness & Gym' => 'Équipements de fitness et salle de sport',
            'Sports d\'Équipe' => 'Équipements de sports collectifs',
            'Sports Individuels' => 'Équipements de sports individuels',
            'Vélos' => 'Vélos et VTT',
            'Camping & Plein Air' => 'Équipement de camping et randonnée'
        ];

        foreach ($sportsSubcategories as $name => $description) {
            Subcategory::firstOrCreate(
                ['category_id' => $sports->id, 'name' => $name],
                ['slug' => strtolower(str_replace(' ', '-', $name)), 'description' => $description]
            );
        }

        // Jobs Category
        $jobs = Category::firstOrCreate(
            ['name' => 'Emploi'],
            ['slug' => 'emploi', 'description' => 'Offres d\'emploi et opportunités de carrière']
        );

        $jobsSubcategories = [
            'CDI' => 'Offres d\'emploi en CDI',
            'CDD & Interim' => 'Offres d\'emploi en CDD et intérim',
            'Freelance' => 'Offres en freelance',
            'Stages' => 'Offres de stage',
            'Formation' => 'Offres de formation'
        ];

        foreach ($jobsSubcategories as $name => $description) {
            Subcategory::firstOrCreate(
                ['category_id' => $jobs->id, 'name' => $name],
                ['slug' => strtolower(str_replace(' ', '-', $name)), 'description' => $description]
            );
        }

        $this->command->info('Categories and subcategories seeded successfully!');
    }
}
