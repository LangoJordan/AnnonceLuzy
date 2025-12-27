<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'country_id',
        'city_id',
        'address',
        'merchant_code',
        'user_type',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function ads(): HasMany
    {
        return $this->hasMany(Ad::class);
    }

    public function agencySpaces(): HasMany
    {
        return $this->hasMany(AgencySpace::class, 'agency_id');
    }

    public function employeePositions(): HasMany
    {
        return $this->hasMany(EmployeePosition::class);
    }

    public function subscriptions(): BelongsToMany
    {
        return $this->belongsToMany(Subscription::class, 'user_subscriptions')
                    ->withPivot('start_date', 'end_date', 'status')
                    ->withTimestamps();
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(View::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function sentTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'sender_id');
    }

    public function receivedTransactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'receiver_id');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }
    public function country()
{
    return $this->belongsTo(Country::class);
}

public function city()
{
    return $this->belongsTo(City::class);
}

    /**
     * Check if user has an active and valid subscription
     */
    public function hasActiveSubscription(): bool
    {
        return $this->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->exists();
    }

    /**
     * Get the active subscription if it exists
     */
    public function getActiveSubscription()
    {
        return $this->subscriptions()
            ->wherePivot('status', true)
            ->where('user_subscriptions.end_date', '>', now())
            ->first();
    }

    /**
     * Count active (non-trash) ads for this user
     */
    public function countActiveAds(): int
    {
        return $this->ads()
            ->where('status', '!=', 'trash')
            ->count();
    }

    /**
     * Count active spaces (status = true) for this agency
     */
    public function countActiveSpaces(): int
    {
        if ($this->user_type !== 'agency') {
            return 0;
        }

        return $this->agencySpaces()
            ->where('status', true)
            ->count();
    }

    /**
     * Get remaining ads quota
     */
    public function getAdQuotaRemaining(): ?int
    {
        $subscription = $this->getActiveSubscription();

        if (!$subscription) {
            return null;
        }

        $activeAds = $this->countActiveAds();
        return max(0, $subscription->max_ads - $activeAds);
    }

    /**
     * Get remaining spaces quota
     */
    public function getSpaceQuotaRemaining(): ?int
    {
        if ($this->user_type !== 'agency') {
            return null;
        }

        $subscription = $this->getActiveSubscription();

        if (!$subscription) {
            return null;
        }

        $activeSpaces = $this->countActiveSpaces();
        return max(0, $subscription->max_spaces - $activeSpaces);
    }

}
