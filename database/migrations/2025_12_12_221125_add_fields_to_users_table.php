<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::table('users', function (Blueprint $table) {
    $table->foreignId('country_id')->nullable()->after('email')->constrained()->nullOnDelete();
    $table->foreignId('city_id')->nullable()->after('country_id')->constrained()->nullOnDelete();
    $table->string('address')->nullable()->after('city_id');

    $table->string('phone')->nullable()->after('address');

    $table->string('merchant_code')->nullable()->after('phone');
    $table->enum('user_type', [
        'visitor',
        'agency',
        'employee',
        'admin',
        'manager'
    ])->default('visitor')->after('phone');

    $table->boolean('status')->default(true)->after('user_type');

    $table->index(['country_id', 'city_id']);
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
