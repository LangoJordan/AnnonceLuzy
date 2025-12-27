<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Get all active countries
     */
    public function getCountries(): JsonResponse
    {
        $countries = Country::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'phone_code']);

        return response()->json([
            'status' => 'success',
            'data' => $countries,
        ]);
    }

    /**
     * Get all active cities with country_id
     */
    public function getAllCities(): JsonResponse
    {
        $cities = City::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'region', 'country_id']);

        return response()->json([
            'status' => 'success',
            'data' => $cities,
        ]);
    }

    /**
     * Get cities by country
     */
    public function getCitiesByCountry($countryId): JsonResponse
    {
        $country = Country::find($countryId);

        if (!$country) {
            return response()->json([
                'status' => 'error',
                'message' => 'Country not found',
            ], 404);
        }

        $cities = $country->cities()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'region']);

        return response()->json([
            'status' => 'success',
            'data' => $cities,
        ]);
    }

    /**
     * Get cities by country code
     */
    public function getCitiesByCountryCode($countryCode): JsonResponse
    {
        $country = Country::where('code', strtoupper($countryCode))->first();

        if (!$country) {
            return response()->json([
                'status' => 'error',
                'message' => 'Country not found',
            ], 404);
        }

        $cities = $country->cities()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'region']);

        return response()->json([
            'status' => 'success',
            'data' => $cities,
        ]);
    }

    /**
     * Search cities by name
     */
    public function searchCities(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        $countryId = $request->get('country_id');

        $cities = City::where('is_active', true)
            ->where('name', 'like', '%' . $query . '%');

        if ($countryId) {
            $cities->where('country_id', $countryId);
        }

        $cities = $cities->orderBy('name')
            ->limit(20)
            ->get(['id', 'name', 'code', 'region', 'country_id']);

        return response()->json([
            'status' => 'success',
            'data' => $cities,
        ]);
    }
}
