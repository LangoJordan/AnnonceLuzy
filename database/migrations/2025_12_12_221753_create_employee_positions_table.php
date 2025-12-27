<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employee_positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->foreignId('space_id')
                  ->constrained('agency_spaces')
                  ->cascadeOnDelete();
            $table->string('role'); // manager, commercial, etc.
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_positions');
    }
};
