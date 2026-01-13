<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class StatsApiTest extends TestCase
{
    public function test_returns_cached_stats()
    {
        $mockStats = [
            'top_queries' => [['term' => 'yoda', 'count' => 5]],
            'average_duration_ms' => 120,
            'popular_hour' => '14:00',
            'last_updated' => '2026-01-01T12:00:00',
        ];

        Cache::shouldReceive('get')
             ->once()
             ->with('search_stats', \Mockery::type('array'))
             ->andReturn($mockStats);

        $response = $this->getJson('/api/stats');

        $response->assertStatus(200)
                 ->assertJson($mockStats);
    }
    
    public function test_returns_default_structure_if_cache_empty()
    {
        Cache::flush();
        
        $response = $this->getJson('/api/stats');
        
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'top_queries',
                     'average_duration_ms',
                     'popular_hour',
                     'last_updated'
                 ]);
    }
}
