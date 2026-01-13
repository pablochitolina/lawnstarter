<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SearchQuery; // Fixed namespace from Model to Models
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ComputeSearchStats extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stats:compute';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compute search statistics';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Top 5 Queries
        $totalQueries = SearchQuery::count();
        
        $topQueries = SearchQuery::select('term', DB::raw('count(*) as count'))
            ->groupBy('term')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(function($item) use ($totalQueries) {
                return [
                    'term' => $item->term,
                    'count' => $item->count,
                    'percentage' => $totalQueries > 0 
                        ? round(($item->count / $totalQueries) * 100, 1) . '%' 
                        : '0%'
                ];
            });

        // Average Duration
        $avgDuration = SearchQuery::avg('duration_ms');

        // Most Popular Hour
        $popularHour = SearchQuery::select(
                DB::raw("strftime('%H', created_at) as hour"), 
                DB::raw('count(*) as count')
            )
            ->groupBy('hour')
            ->orderByDesc('count')
            ->first();

        $stats = [
            'top_queries' => $topQueries,
            'average_duration_ms' => round($avgDuration ?? 0, 2),
            'popular_hour' => $popularHour ? $popularHour->hour . ':00' : 'N/A',
            'last_updated' => now()->toIso8601String(),
        ];

        Cache::put('search_stats', $stats, 600);
        
        $this->info('Search statistics computed successfully.');
    }
}
