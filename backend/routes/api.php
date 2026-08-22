<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GreenhouseController;

Route::get('/greenhouse/status', [GreenhouseController::class, 'status']);

Route::post('/greenhouse/readings', [GreenhouseController::class, 'store']);