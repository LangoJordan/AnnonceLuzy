<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Boost extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'amount',
        'duration_days',
        'priority_level',
    ];

    public function ads(): BelongsToMany
    {
        return $this->belongsToMany(Ad::class, 'ad_boosts')
                    ->withPivot('start_date', 'end_date', 'active')
                    ->withTimestamps();
    }
}
