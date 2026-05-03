<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('food_id')->nullable()->constrained('foods')->cascadeOnUpdate()->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->unsignedTinyInteger('rating');
            $table->text('message');
            $table->string('food_name')->nullable();
            $table->string('status')->default('pending')->index();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();
        });

        Schema::table('company_settings', function (Blueprint $table): void {
            $table->text('pickup_instructions')->nullable()->after('address');
            $table->string('cash_only_notice')->nullable()->after('pickup_instructions');
        });
    }

    public function down(): void
    {
        Schema::table('company_settings', function (Blueprint $table): void {
            $table->dropColumn(['pickup_instructions', 'cash_only_notice']);
        });

        Schema::dropIfExists('reviews');
    }
};
