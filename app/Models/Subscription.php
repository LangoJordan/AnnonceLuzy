<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'amount',
        'max_ads',
        'max_spaces',
        'duration_days',
        'is_active',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_subscriptions')
                    ->withPivot('start_date', 'end_date', 'status')
                    ->withTimestamps();
    }
}
