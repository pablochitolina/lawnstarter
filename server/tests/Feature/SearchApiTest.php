<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;
use App\Jobs\LogSearchQuery;

class SearchApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_requires_query_and_type()
    {
        $response = $this->getJson('/api/search');
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['q', 'type']);
    }

    public function test_search_fetches_from_swapi_and_dispatches_log_job()
    {
        Queue::fake();
        
        Http::fake([
            'swapi.dev/api/people/*' => Http::response([
                'count' => 1,
                'results' => [['name' => 'Luke Skywalker']]
            ], 200),
        ]);

        $response = $this->getJson('/api/search?q=luke&type=people');

        $response->assertStatus(200)
                 ->assertJsonPath('results.0.name', 'Luke Skywalker');

        Queue::assertPushed(LogSearchQuery::class, function ($job) {
             // Accessing protected property via reflection or just asserting class pushed
             return true;
        });
    }

    public function test_invalid_type_returns_validation_error()
    {
        $response = $this->getJson('/api/search?q=luke&type=invalid_type');
        $response->assertStatus(422);
    }
}
