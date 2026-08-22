<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorReading extends Model
{
    protected $fillable = [
        'temperature',
        'humidity',
        'soil_moisture',
        'light_intensity',
        'rain_detected',
        'water_pump',
        'exhaust_fan',
        'grow_light',
        'roof_status',
    ];

    protected $casts = [
        'temperature' => 'float',
        'humidity' => 'float',
        'soil_moisture' => 'float',
        'light_intensity' => 'float',
        'rain_detected' => 'boolean',
        'water_pump' => 'boolean',
        'exhaust_fan' => 'boolean',
        'grow_light' => 'boolean',
    ];
}