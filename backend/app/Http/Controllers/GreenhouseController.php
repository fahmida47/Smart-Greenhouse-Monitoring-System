<?php

namespace App\Http\Controllers;

use App\Models\SensorReading;
use Illuminate\Http\Request;

class GreenhouseController extends Controller
{
    public function status()
    {
        $latestReading = SensorReading::latest()->first();

        if (!$latestReading) {
            return response()->json([
                'success' => true,
                'message' => 'No sensor data available yet.',
                'data' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $latestReading,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'temperature' => 'nullable|numeric',
            'humidity' => 'nullable|numeric',
            'soil_moisture' => 'nullable|numeric',
            'light_intensity' => 'nullable|numeric',
            'rain_detected' => 'nullable|boolean',

            'water_pump' => 'nullable|boolean',
            'exhaust_fan' => 'nullable|boolean',
            'grow_light' => 'nullable|boolean',

            'roof_status' => 'nullable|string|max:20',
        ]);

        $reading = SensorReading::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Sensor data saved successfully.',
            'data' => $reading,
        ], 201);
    }
}