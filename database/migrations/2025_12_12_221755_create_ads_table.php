<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('space_id')->nullable()->constrained('agency_spaces')->nullOnDelete();

            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->foreignId('city_id')->constrained()->cascadeOnDelete();
            $table->string('address')->nullable();

            $table->string('title');
            $table->string('main_photo')->nullable();
            $table->text('description');
            $table->string('category');
            $table->string('subcategory')->nullable();
       

            $table->enum('status', ['trash','pending', 'valid', 'blocked'])->default('pending');
            //trash pour brouillon

            $table->integer('price')->nullable();
            $table->string('price_description')->nullable();

            $table->unsignedBigInteger('views_count')->default(0);

            $table->timestamps();

            $table->index(['country_id', 'city_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
