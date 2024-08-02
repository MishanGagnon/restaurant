'use client';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';
import { MapController } from './MapController';

const Filters = () => {
    const router = useRouter();
    type LonLat = {
        latitude: number | null; 
        longitude: number | null;
    };
    type Errors = {
        longitude : boolean,
        latitude : boolean, 
        numRestaurants : boolean
    }
    const [errors, setErrors] = useState<Errors>({
        longitude: false,
        latitude: false,
        numRestaurants: false,
    });
    const [lonLat, setLonLat] = useState<LonLat>({ longitude: -83.7430, latitude: 42.2808});
    const [numRestaurants, setNumRestaurants] = useState<number | null>(5);
    const [radiusValue, setRadiusValue] = useState<string>("5.0");
    const [ratingValue, setRatingValue] = useState<string>("3.5");
    const [loading, setLoading] = useState<boolean>(false);
    const [createLobbyLoading,setCreateLobbyLoading] = useState(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const handleRadiusSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadiusValue((event.target.value));
    };

    const handleRatingSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRatingValue((event.target.value));
    };

    const validateInputs = (): boolean => {
        let isValid = true;
        const newErrors = { ...errors };

        // Validate longitude
        if (lonLat.longitude === null || lonLat.longitude < -180 || lonLat.longitude > 180) {
            newErrors.longitude = true;
            isValid = false;
        } else {
            newErrors.longitude = false;
        }

        // Validate latitude
        if (lonLat.latitude === null || lonLat.latitude < -90 || lonLat.latitude > 90) {
            newErrors.latitude = true;
            isValid = false;
        } else {
            newErrors.latitude = false;
        }

        // Validate number of restaurants
        if (numRestaurants === null || numRestaurants < 5 || numRestaurants > 20) {
            newErrors.numRestaurants = true;
            isValid = false;
        } else {
            newErrors.numRestaurants = false;
        }

        setErrors(newErrors);
        return isValid;
    };
    const id = React.useId();

    const handleCreateLobbyResponse = (data: any) => {
        console.log(data);
        if (data.message === 'Lobby added') {
            router.push(`/lobby/${data.lobbyCode}`);
        } else {
            console.log("error creating lobby try again");
        }
    };

    const handleCreateLobby = () => {
        if (validateInputs()) {
            setCreateLobbyLoading(true);
            fetch('http://localhost:3000/api/createLobby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    longitude: lonLat.longitude,
                    latitude: lonLat.latitude,
                    numRestaurants: numRestaurants,
                    radius: parseFloat(radiusValue),
                    minRating: parseFloat(ratingValue)
                }),
            })
                .then((res) => res.json())
                .then((data) => handleCreateLobbyResponse(data))
                .catch((error) => console.error('Error:', error))
                .finally(() => setLoading(false));
        } else {
            console.log("Validation failed");
        }
    };

    const handleLocationClick = () => {
        setLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position.coords.latitude, position.coords.longitude);
                setLonLat({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
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

    if (!isMounted) return null; // Prevent rendering on the server

    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center flex-col md:flex-row items-center">
            <div className="h-1/2 md:h-2/3 w-5/6 md:w-1/2 max-w-md space-y-2 p-2 bg-white rounded-md shadow-md m-4 flex items-center justify-center flex-col">
                <h1 className='text-black self-center font-bold text-xl flex flex-col text-center'>Session Settings</h1>

                <div className="flex flex-col space-y-2 w-full">
                <div className="flex flex-col">
                        <label
                            htmlFor={id + "-latitude"}
                            className="font-bold mb-1 text-black text-sm">
                            Latitude
                        </label>
                        <input
                            type="number"
                            onChange={(e) => { setLonLat({ ...lonLat, latitude: e.target.value ? parseFloat(e.target.value) : null }) }}
                            name="latitude"
                            value={lonLat.latitude !== null ? lonLat.latitude : ''}
                            placeholder="Latitude"
                            className={`p-1 border rounded-md text-black text-sm ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`}
                            id={id + "-latitude"}
                        />
                        {errors.latitude && <p className="text-red-500 text-xs">Invalid latitude. Must be between -90 and 90.</p>}
                    </div>

                    <div className="flex flex-col">
                        <label
                            htmlFor={id + "-longitude"}
                            className="font-bold mb-1 text-black text-sm">
                            Longitude
                        </label>
                        <input
                            type="number"
                            onChange={(e) => { setLonLat({ ...lonLat, longitude: e.target.value ? parseFloat(e.target.value) : null }) }}
                            name="longitude"
                            value={lonLat.longitude !== null ? lonLat.longitude : ''}
                            placeholder="Longitude"
                            className={`p-1 border rounded-md text-black text-sm ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`}
                            id={id + "-longitude"}
                        />
                        {errors.longitude && <p className="text-red-500 text-xs">Invalid longitude. Must be between -180 and 180.</p>}
                    </div>

                    <button
                        type="button"
                        onClick={handleLocationClick}
                        className="px-2 py-1 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 flex justify-center items-center text-sm"
                        disabled={loading}
                    >
                        {loading && (
                            <div className="loader mr-2"></div>
                        )}
                        Get host location
                    </button>

                    <div className="flex flex-col">
                        <label
                            htmlFor={id + "-num_restaurants"}
                            className="font-bold mb-1 text-black text-sm">
                            Number of Restaurants for the session
                        </label>
                        <input
                            type="number"
                            onChange={(e) => { 
                                const value = e.target.value;
                                setNumRestaurants(value === '' ? null : parseInt(value));
                            }}
                            name="num_restaurants"
                            value={numRestaurants !== null ? numRestaurants : ''}
                            placeholder="Number of restaurants (5-20)"
                            className={`p-1 border rounded-md text-black text-sm ${errors.numRestaurants ? 'border-red-500' : 'border-gray-300'}`}
                            id={id + "-num_restaurants"}
                        />
                        {errors.numRestaurants && <p className="text-red-500 text-xs">Invalid number of restaurants. Must be between 5 and 20.</p>}
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor={id + "-slider"}
                            className="flex flex-col text-black font-bold text-sm">
                            Select your search radius.
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            step=".5"
                            value={radiusValue}
                            onChange={handleRadiusSlider}
                            id={id + "-slider"}
                        />
                        <div className='text-black text-sm'>{radiusValue} miles.</div>
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor={id + "-min_rating"}
                            className="font-bold mb-1 text-black text-sm">
                            Minimum Rating
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={ratingValue}
                            onChange={handleRatingSlider}
                            id={id + "-min_rating"}
                        />
                        <div className='text-black text-sm'>{ratingValue}</div>
                        <button
                        type="button"
                        onClick={handleCreateLobby}
                        className="px-2 py-1 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 flex justify-center items-center text-sm"
                        disabled={loading}
                    >
                        {createLobbyLoading ? (
                            <div className="loader mr-2"></div>
                        ) : null}
                        Create Lobby
                    </button>
                    </div>
                </div>
            </div>
<<<<<<< HEAD

            <MapContainer className="py-10 mb-10 flex flex-col mr-10" center={[formData.latitude, formData.longitude]} zoom={10} style={{ height: '70vh', width: '70vw', borderRadius: "25px" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapController formData={formData} setFormData={setFormData} />
                <Circle center={[formData.latitude, formData.longitude]} radius={getMeters(radiusValue)} color="blue">
                    <Popup>
                        A circle of radius {getMeters(radiusValue)} meters.
                    </Popup>
                </Circle>
            </MapContainer>
=======
            <div className='w-5/6 m-4 h-1/2 md:h-2/3'>
                <MapContainer className="py-2 mr-2 mb-2 flex flex-col" center={[lonLat.latitude || 0 , lonLat.longitude || 0]} zoom={10} style={{ height: '100%', width: '100%', borderRadius: "8px" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapController lonLat={lonLat} />
                    <Circle center={[lonLat.latitude || 0, lonLat.longitude || 0]} radius={getMeters(radiusValue ? Number(radiusValue) : 0)} color="blue">
                        <Popup>
                            A circle of radius {getMeters(radiusValue ? Number(radiusValue) : 0)} meters.
                        </Popup>
                    </Circle>
                </MapContainer>
            </div>
>>>>>>> main
            <style jsx>{`
                .loader {
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #3498db;
                    border-radius: 50%;
                    width: 12px;
                    height: 12px;
                    animation: spin 2s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Filters;