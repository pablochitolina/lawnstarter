<?php

namespace App\Http\Controllers\Api;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class StatsController
{
    public function index()
    {
        $stats = Cache::get('search_stats', [
            'top_queries' => [],
            'average_duration_ms' => 0,
            'popular_hour' => 'N/A',
            'last_updated' => null
        ]);

        return response()->json($stats);
    }
}
