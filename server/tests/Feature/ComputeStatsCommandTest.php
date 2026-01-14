<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\SearchQuery;
use Illuminate\Support\Facades\Cache;

class ComputeStatsCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_computes_and_caches_stats()
    {
        // 1. Seed Data
        // 3 searches for 'luke' (fast)
        SearchQuery::factory()->count(3)->create([
            'term' => 'luke',
            'duration_ms' => 100,
            'created_at' => now()->setHour(14), // 2 PM
        ]);

        // 1 search for 'vader' (slow)
        SearchQuery::factory()->create([
            'term' => 'vader',
            'duration_ms' => 500,
            'created_at' => now()->setHour(10), // 10 AM
        ]);

        // Total: 4 queries. Avg Duration: (300 + 500) / 4 = 200 ??? No. (100*3 + 500) / 4 = 800/4 = 200.

        // 2. Run Command
        $this->artisan('stats:compute')
             ->assertExitCode(0);

        // 3. Verify Cache
        $stats = Cache::get('search_stats');

        $this->assertNotNull($stats);
        
        // Avg Duration
        $this->assertEquals(200, $stats['average_duration_ms']);

        // Top Queries
        $this->assertEquals('luke', $stats['top_queries'][0]['term']);
        $this->assertEquals(3, $stats['top_queries'][0]['count']);
        $this->assertEquals('75%', $stats['top_queries'][0]['percentage']);

        $this->assertEquals('vader', $stats['top_queries'][1]['term']);
        $this->assertEquals(1, $stats['top_queries'][1]['count']);
        $this->assertEquals('25%', $stats['top_queries'][1]['percentage']);

        // Popular Hour (Should be 14:00 because 3 vs 1)
        $this->assertEquals('14:00', $stats['popular_hour']);
    }

    public function test_command_handles_empty_db()
    {
        $this->artisan('stats:compute')
             ->assertExitCode(0);

        $stats = Cache::get('search_stats');

        $this->assertEquals(0, $stats['average_duration_ms']);
        $this->assertEmpty($stats['top_queries']);
        $this->assertEquals('N/A', $stats['popular_hour']);
    }
}
