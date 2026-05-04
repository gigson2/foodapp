<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->string('submission_key', 80)->nullable()->after('order_number');
            $table->unique(['user_id', 'submission_key'], 'orders_user_submission_unique');
        });

        Schema::table('foods', function (Blueprint $table): void {
            $table->unique('name');
        });

        Schema::table('categories', function (Blueprint $table): void {
            $table->unique('name');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table): void {
            $table->dropUnique(['name']);
        });

        Schema::table('foods', function (Blueprint $table): void {
            $table->dropUnique(['name']);
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropUnique('orders_user_submission_unique');
            $table->dropColumn('submission_key');
        });
    }
};
