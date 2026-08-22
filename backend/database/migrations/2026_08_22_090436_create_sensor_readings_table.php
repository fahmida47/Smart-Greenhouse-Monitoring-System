<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sensor_readings', function (Blueprint $table) {
            $table->id();

            $table->decimal('temperature', 5, 2)->nullable();
            $table->decimal('humidity', 5, 2)->nullable();
            $table->decimal('soil_moisture', 5, 2)->nullable();
            $table->decimal('light_intensity', 5, 2)->nullable();

            $table->boolean('rain_detected')->default(false);

            $table->boolean('water_pump')->default(false);
            $table->boolean('exhaust_fan')->default(false);
            $table->boolean('grow_light')->default(false);

            $table->string('roof_status')->default('OPEN');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sensor_readings');
    }
};