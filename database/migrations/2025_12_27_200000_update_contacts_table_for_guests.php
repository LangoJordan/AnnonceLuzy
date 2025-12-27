<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            // Drop the existing foreign key and column
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('contacts', function (Blueprint $table) {
            // Add the user_id column as nullable to support guest contacts
            $table->unsignedBigInteger('user_id')->nullable()->after('ad_id');
            
            // Add the foreign key as nullable
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            // Drop the foreign key and column
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('contacts', function (Blueprint $table) {
            // Restore the original column
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
        });
    }
};
