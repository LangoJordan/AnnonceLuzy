<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agency_spaces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('users')->cascadeOnDelete();

            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();

            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->foreignId('city_id')->constrained()->cascadeOnDelete();
            $table->string('address')->nullable();

            $table->string('merchant_code')->unique();
            $table->boolean('status')->default(true);

            $table->timestamps();

            $table->index(['country_id', 'city_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agency_spaces');
    }
};
