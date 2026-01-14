<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SearchQueryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'term' => $this->faker->word,
            'type' => $this->faker->randomElement(['people', 'movies']),
            'duration_ms' => $this->faker->numberBetween(50, 500),
            'created_at' => now(),
        ];
    }
}
