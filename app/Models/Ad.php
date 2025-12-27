<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ad extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'space_id',
        'country_id',
        'city_id',
        'category_id',
        'subcategory_id',
        'address',
        'title',
        'main_photo',
        'description',
        'status',
        'price',
        'price_description',
        'contact_phone',
        'contact_email',
        'views_count',
        'revenue',
    ];

    protected $casts = [
        'price' => 'integer',
        'views_count' => 'integer',
        'revenue' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function space()
    {
        return $this->belongsTo(AgencySpace::class, 'space_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    public function features()
    {
        return $this->hasMany(AdFeature::class);
    }

    public function boosts()
    {
        return $this->hasMany(AdBoost::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function views()
    {
        return $this->hasMany(View::class);
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
