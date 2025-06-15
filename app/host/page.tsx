'use client';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMapEvents } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import { Loader2, MapPin, Users, DollarSign, Search, Utensils } from "lucide-react"
import 'leaflet/dist/leaflet.css';
import { MapController } from './MapController';

const Filters = () => {
    const router = useRouter();
    type LonLat = {
        latitude: number;
        longitude: number;
    };
    const [lonLat, setLonLat] = useState<LonLat>({ longitude: -83.7430, latitude: 42.2808 });
    const [numRestaurants, setNumRestaurants] = useState<number[]>([10]);
    const [radiusValue, setRadiusValue] = useState<number[]>([1.5]);
    const [loading, setLoading] = useState<boolean>(false);
    const [createLobbyLoading, setCreateLobbyLoading] = useState(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [mapCenter, setMapCenter] = useState<LonLat>(lonLat)
    const [price, setPrice] = useState<number[]>([2])
    const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

    const id = React.useId();

    const popularCuisines = [
        { name: 'Italian', icon: '🍕' },
        { name: 'Japanese', icon: '🍱' },
        { name: 'Mexican', icon: '🌮' },
        { name: 'Chinese', icon: '🥢' },
        { name: 'Indian', icon: '🍛' },
        { name: 'Thai', icon: '🍜' },
        { name: 'American', icon: '🍔' },
        { name: 'Mediterranean', icon: '🥙' },
        { name: 'Korean', icon: '🍖' },
        { name: 'Vietnamese', icon: '🍜' },
    ];

    const handleCreateLobbyResponse = (data: any) => {
        if (data.message === 'Lobby added') {
            router.push(`/lobby/${data.lobbyCode}`);
        } else {
            console.log("error creating lobby try again");
        }
    };

    const handleCreateLobby = () => {
        setCreateLobbyLoading((prev) => true);
        if (!isMounted) return;
        let baseUrl = process.env.NEXT_PUBLIC_NEXT_DOMAIN
      
        setCreateLobbyLoading(true);
        fetch(`${baseUrl}/api/createLobby`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                longitude: lonLat.longitude,
                latitude: lonLat.latitude,
                numRestaurants: numRestaurants[0],
                radius: radiusValue[0],
                price: price[0],
                cuisine: selectedCuisine
            }),
        })
            .then((res) => res.json())
            .then((data) => handleCreateLobbyResponse(data))
            .catch((error) => console.error('Error:', error))
    };

    const handleLocationClick = () => {
        setLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setMapCenter(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));
                setLonLat(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));
                setLoading(false);
            }, () => {
                console.log("Error getting location");
                setLoading(false);
            });
        } else {
            console.log("Geolocation is not available in your browser.");
            setLoading(false);
        }
    };

    const getMeters = (miles: number) => {
        return miles * 1609.344;
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Settings Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
                        {/* Back Button */}
                        <button
                            onClick={() => router.push('/')}
                            className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back
                        </button>

                        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                            Create New Session
                        </h1>
                        
                        <div className="space-y-6">
                            {/* Location Button */}
                            <button
                                disabled={loading}
                                onClick={handleLocationClick}
                                className="w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <MapPin className="h-5 w-5" />
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Getting Location...
                                    </>
                                ) : (
                                    'Use Current Location'
                                )}
                            </button>

                            {/* Cuisine Filter */}
                            <div className="space-y-2">
                                <label className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                    <Utensils className="h-5 w-5" />
                                    Cuisine Type
                                </label>
                                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                                    {popularCuisines.map((cuisine) => (
                                        <button
                                            key={cuisine.name}
                                            onClick={() => setSelectedCuisine(selectedCuisine === cuisine.name ? null : cuisine.name)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                                                selectedCuisine === cuisine.name
                                                    ? 'bg-blue-500 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            <span>{cuisine.icon}</span>
                                            <span>{cuisine.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Price Range
                                    </label>
                                    <span className="text-lg font-medium text-gray-700">
                                        {'$'.repeat(price[0])}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="4"
                                    step="1"
                                    value={price[0]}
                                    onChange={(e) => setPrice([parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            {/* Number of Restaurants Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Number of Restaurants
                                    </label>
                                    <span className="text-lg font-medium text-gray-700">
                                        {numRestaurants[0]}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="15"
                                    step="1"
                                    value={numRestaurants[0]}
                                    onChange={(e) => setNumRestaurants([parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            {/* Search Radius Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                        <Search className="h-5 w-5" />
                                        Search Radius
                                    </label>
                                    <span className="text-lg font-medium text-gray-700">
                                        {radiusValue[0]} mi
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="0.1"
                                    value={radiusValue[0]}
                                    onChange={(e) => setRadiusValue([parseFloat(e.target.value)])}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            {/* Create Lobby Button */}
                            <button
                                disabled={createLobbyLoading}
                                onClick={handleCreateLobby}
                                className="w-full py-4 px-6 bg-blue-500 text-white rounded-xl text-xl font-semibold hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                {createLobbyLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Creating Lobby...
                                    </>
                                ) : (
                                    'Create Lobby'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Map Container */}
                    <div className="bg-white rounded-2xl shadow-xl p-4 transform hover:scale-[1.02] transition-all duration-300 h-[600px]">
                        {(typeof window !== 'undefined') ? (
                            <MapContainer
                                className="h-full w-full rounded-xl"
                                center={[mapCenter.latitude || 0, mapCenter.longitude || 0]}
                                zoom={10}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                                />
                                <MapController lonLat={lonLat} setLonLat={setLonLat} mapCenter={mapCenter} />
                                <Circle
                                    center={[lonLat.latitude || 0, lonLat.longitude || 0]}
                                    radius={getMeters(radiusValue ? Number(radiusValue) : 0)}
                                    color="hsl(197 89.2% 48%)"
                                    interactive={false}
                                />
                            </MapContainer>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filters;