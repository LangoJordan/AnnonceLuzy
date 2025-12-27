<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->foreignId('category_id')
                ->nullable()
                ->after('title')
                ->constrained('categories')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->dropForeignKeyConstraints();
            $table->dropColumn('category_id');
        });
    }
};
