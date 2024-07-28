'use client';
import React, { FormEvent, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';
import { MapController } from './MapController';

const Filters = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        longitude: -83.7430,
        latitude: 42.2808,
        min_rating: 0,
        radius: 0,
        num_restaurants: 0
    });

    const [radiusValue, setRadiusValue] = useState(5);
    const [ratingValue, setRatingValue] = useState(3.5);
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const handleRadiusSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadiusValue(Number(event.target.value));
    };

    const handleRatingSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRatingValue(Number(event.target.value));
    };

    const id = React.useId();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleCreateLobbyResponse = (data: any) => {
        console.log(data);
        if (data.message == 'Lobby added') {
            router.push(`/lobby/${data.lobbyCode}`);
        } else {
            console.log("error creating lobby try again");
        }
    };

    const handleCreateLobby = () => {
        fetch('http://localhost:3000/api/createLobby', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => handleCreateLobbyResponse(data))
            .catch((error) => console.error('Error:', error));
    };

    // Uses geolocation API to get coordinates of host 
    const handleLocationClick = () => {
        setLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(position.coords.latitude, position.coords.longitude);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    'longitude': position.coords.longitude,
                    'latitude': position.coords.latitude
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

    if (!isMounted) return null; // Prevent rendering on the server

    return (
        <div className="bg-gray-100 min-h-screen flex flex-row items-center">
            <div className="w-full max-w-md space-y-4 p-4 bg-white rounded-md shadow-md p-10 m-10">
                <h1 className='text-black self-center font-bold text-2xl flex flex-col text-center'> Session Settings </h1>

                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col">
                        <label
                            htmlFor={id + "-latitude"}
                            className="font-bold mb-1 text-black">
                            Latitude
                        </label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="latitude"
                            value={formData.latitude}
                            placeholder="Latitude"
                            className="p-2 border border-gray-300 rounded-md text-black"
                            id={id + "-latitude"}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label
                            htmlFor={id + "-longitude"}
                            className="font-bold mb-1 text-black">
                            Longitude
                        </label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="longitude"
                            value={formData.longitude}
                            placeholder="Longitude"
                            className="p-2 border border-gray-300 rounded-md text-black"
                            id={id + "-longitude"}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleLocationClick}
                        className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 flex justify-center items-center"
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
                            className="font-bold mb-1 text-black">
                            Number of Restaurants for the session
                        </label>
                        <input
                            type="text"
                            onChange={handleChange}
                            name="num_restaurants"
                            value={formData.num_restaurants}
                            className="p-2 border border-gray-300 rounded-md text-black"
                            id={id + "-num_restaurants"}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label
                            htmlFor={id + "-slider"}
                            className="flex flex-col text-black font-bold">
                            Select your search radius.
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            step="1"
                            value={radiusValue}
                            onChange={handleRadiusSlider}
                            id={id + "-slider"}
                        />
                        <div className='text-black'>{radiusValue} miles. </div>
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor={id + "-min_rating"}
                            className="font-bold mb-1 text-black">
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
                        <div className='text-black'>{ratingValue} </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleCreateLobby}
                        className="px-4 py-2 bg-lime-800 text-white font-bold rounded-md hover:bg-blue-700 self-end">
                        Create Lobby
                    </button>
                </div>
            </div>

            <MapContainer className="py-10 mb-10 flex flex-col" center={[formData.latitude, formData.longitude]} zoom={10} style={{ height: '70vh', width: '70vw', borderRadius: "25px" }}>
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
            <style jsx>{`
                .loader {
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #3498db;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    animation: spin 2s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default Filters;
