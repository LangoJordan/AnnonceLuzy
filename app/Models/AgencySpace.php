<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AgencySpace extends Model
{
    use HasFactory;

    protected $fillable = [
        'agency_id',
        'name',
        'email',
        'phone',
        'country_id',
        'city_id',
        'address',
        'merchant_code',
        'created_at',
        'updated_at',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function agency()
    {
        return $this->belongsTo(User::class, 'agency_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function ads()
    {
        return $this->hasMany(Ad::class, 'space_id');
    }

    public function employeePositions()
    {
        return $this->hasMany(EmployeePosition::class, 'space_id');
    }
}
