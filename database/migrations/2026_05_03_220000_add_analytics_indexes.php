<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->index('completed_at');
            $table->index(['user_id', 'placed_at']);
        });

        Schema::table('reviews', function (Blueprint $table): void {
            $table->index('created_at');
            $table->index('approved_at');
        });

        Schema::table('visitor_sessions', function (Blueprint $table): void {
            $table->index('created_at');
            $table->index(['user_id', 'created_at']);
        });

        Schema::table('visitor_events', function (Blueprint $table): void {
            $table->index('created_at');
            $table->index(['event_type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('visitor_events', function (Blueprint $table): void {
            $table->dropIndex(['event_type', 'created_at']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('visitor_sessions', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'created_at']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('reviews', function (Blueprint $table): void {
            $table->dropIndex(['approved_at']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'placed_at']);
            $table->dropIndex(['completed_at']);
        });
    }
};
