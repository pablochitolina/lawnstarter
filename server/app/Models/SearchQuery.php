<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SearchQuery extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['term', 'type', 'duration_ms', 'created_at'];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
