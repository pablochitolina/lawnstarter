<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Jobs\LogSearchQuery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\SearchQuery;

class LogSearchQueryTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_creates_search_query_record()
    {
        $data = [
            'term' => 'yoda',
            'type' => 'people',
            'duration_ms' => 150,
        ];

        $job = new LogSearchQuery($data);
        $job->handle();

        $this->assertDatabaseHas('search_queries', $data);
        $this->assertEquals(1, SearchQuery::count());
    }
}
