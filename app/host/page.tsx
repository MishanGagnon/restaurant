'use client';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMapEvents } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react"
import 'leaflet/dist/leaflet.css';
import { MapController } from './MapController';
import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

  

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
        setCreateLobbyLoading((prev) => true);
        if (!isMounted) return;
        // let baseUrl = 'localhost:3000'
        let baseUrl = process.env.NEXT_PUBLIC_NEXT_DOMAIN
        // if (typeof window !== 'undefined') {
        //     // Safe to use window here
        //     baseUrl = window.location.origin;
        // }

        // const response = await fetch(`${baseUrl}/api/lobbyCheck/${lobbyCode}`);
      
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
                radius : radiusValue[0],
                price: price[0]
                // radius: parseFloat(radiusValue),
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
                console.log(position.coords.latitude, position.coords.longitude, );
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

    if (!isMounted) return null; // Prevent rendering on the server

    return (
        <div className="bg-gray-100 h-svh flex items-center justify-center flex-col md:flex-row items-center p-5">
            <Card className='w-full md:w-1/2 flex flex-col justify-center items-center space-y-1 h-fit md:h-fit'>
                <CardHeader className='w-full  text-center'>
                    <CardTitle>Lobby Settings</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </CardHeader>
                <div className='pl-3 pr-3 w-full'>
                    <Button disabled={loading} variant={"default"}  onClick={handleLocationClick} className = ' w-full'>
                        Get Current Location
                        {loading && <Loader2  className="mr-2 h-4 w-4 animate-spin" />}
                    </Button>
                </div>
                <div className='pl-6 pr-6 w-full'>
                    <div className='flex justify-between w-full'>
                        <h4 className="scroll-m-20 text-xl tracking-tight">
                        Max Price
                        </h4>
                        <h4 className="scroll-m-20 text-xl tracking-tight">
                        {'$'.repeat(price[0])}
                        </h4>
                    </div>
                    <Slider onValueChange={(value) => setPrice(value)} defaultValue={price} min = {1} max={4} step={1} />
                </div>

                <div className='pl-6 pr-6 w-full'>
                    <div className='flex justify-between w-full'>
                        <h4 className="scroll-m-20 text-xl tracking-tight">
                        Restaruants
                        </h4>
                        <h4 className="scroll-m-20 text-xl tracking-tight">
                        {numRestaurants[0]}
                        </h4>
                    </div>
                    <Slider onValueChange={(value) => setNumRestaurants(value)} defaultValue={numRestaurants} min = {5} max={15} step={1} />
                </div>

                <div className='pl-6 pr-6 w-full'>
                    <div className='flex justify-between w-full'>
                        <h4 className="scroll-m-20 text-xl tracking-tight">
                        Search Radius
                        </h4>
                        <h4 className="scroll-m-20 text-xl tracking-tight">
                        {radiusValue[0]} (mi)
                        </h4>
                    </div>
                    <Slider onValueChange={(value) => setRadiusValue(value)} defaultValue={radiusValue} min = {1} max={10} step={.1} />
                </div>
    
    

                <div className='p-3 w-full'>
                    <Button disabled={createLobbyLoading} variant={"default"}  onClick={handleCreateLobby} className = ' w-full'>
                        Create Lobby
                        {createLobbyLoading && <Loader2  className="mr-2 p-2 h-4 w-4 animate-spin" />}
                    </Button>
                </div>

            </Card>



            <div className='w-full m-4 h-full md:h-2/3'>
                {(typeof window !== 'undefined') ?
                    <MapContainer className="py-2 mr-2 mb-2 flex flex-col" center={[mapCenter.latitude || 0, mapCenter.longitude || 0]} zoom={10} style={{ height: '100%', width: '100%', borderRadius: "8px" }}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <MapController lonLat={lonLat} setLonLat={setLonLat} mapCenter = {mapCenter}/>
                        <Circle
                        center={[lonLat.latitude || 0, lonLat.longitude || 0]}
                        radius={getMeters(radiusValue ? Number(radiusValue) : 0)}
                        color="hsl(197 89.2% 48%)"
                        interactive={false} // Make the circle non-interactive
                    >
                        </Circle>
                    </MapContainer>
                    : ''
                }
            </div>
        </div>
    );
};

export default Filters;