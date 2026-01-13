<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Jobs\LogSearchQuery;
use Illuminate\Support\Facades\Cache;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string',
            'type' => 'required|in:people,films,movies',
        ]);

        $query = $request->input('q');
        $type = $request->input('type');
        
        // Map frontend "movies" type to SWAPI "films"
        $swapiResource = ($type === 'movies') ? 'films' : $type;

        $start = microtime(true);
        
        $cacheKey = "swapi.search.{$swapiResource}.{$query}";
        
        // Cache for 1 hour
        $response = Cache::remember($cacheKey, 3600, function () use ($swapiResource, $query) {
            return Http::withOptions(['verify' => false])
                ->get("https://swapi.dev/api/{$swapiResource}/", [
                    'search' => $query,
                ])
                ->json();
        });

        $duration = (int)((microtime(true) - $start) * 1000);

        LogSearchQuery::dispatch([
            'term' => $query,
            'type' => $type, 
            'duration_ms' => $duration,
        ]);

        return response()->json($response);
    }
}
