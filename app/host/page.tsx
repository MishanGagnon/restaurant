'use client'
import React, { FormEvent } from 'react'
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';
import { MapController } from './MapController';

const Filters = () => {
    const router = useRouter()
    const [formData, setFormData] = React.useState({
        longitude: -83.7430,
        latitude: 42.2808,
        max_price: 0,
        radius: 0,
        num_restaurants: 0
    });

    const [value, setValue] = React.useState(5);
    const handleSlider = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(event.target.value));
    }

    const id = React.useId();

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }
    const handleCreateLobbyResponse = (data : any) => {
        console.log(data)
        //needs data schema not yet finalized
        if(data.message == 'Lobby added'){
            router.push(`/lobby/${data.lobbyCode}`)
        }else{
            console.log("error creating lobby try again")
        }

    }
    const handleCreateLobby = ( ) => {
        fetch('http://localhost:3000/api/createLobby', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({test : 'test-payload'}),
        })
          .then((res) => res.json())
          .then((data) => handleCreateLobbyResponse(data))
        //   .then((data) => setResponse(data))
          .catch((error) => console.error('Error:', error));
      };

    //   const handleCreateLobby = ( ) => {
    //     fetch('http://localhost:3000/api/lobbies', {

    //     })
    //       .then((res) => res.json())
    //       .then((data) => console.log(data))
    //     //   .then((data) => setResponse(data))
    //       .catch((error) => console.error('Error:', error));
    //   };

  
    // Uses geolocation API to get coordinates of host 
    function handleLocationClick() {
        // Add your geolocation logic here
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
              console.log(position.coords.latitude, position.coords.longitude)
              setFormData(prevFormData => ({
                ...prevFormData,
                'longitude': position.coords.longitude,
                'latitude' : position.coords.latitude
            }))
            });
          } else {
            console.log("Geolocation is not available in your browser.");
          }
    }
    function getMeters(miles : number) {
        return miles*1609.344;
   }

    return (
        <div>

            <div className="flex space-x-4 p-4">

                <div className="flex flex-col">
                    <label 
                        htmlFor={id + "-latitude"}
                        className="font-bold mb-1"> 
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
                <button 
                    type="button"
                    onClick={handleLocationClick}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 self-end">
                    Get host location
                </button>
                <div className="flex flex-col">
                    <label 
                        htmlFor={id + "-longitude"} 
                        className="font-bold mb-1"> 
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
                <div className="flex flex-col">
                    <label 
                        htmlFor={id + "-slider"}
                        className="flex flex-col"> 
                        Select your search radius.
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.1"
                        value={value}
                        onChange={handleSlider}
                        id={id + "-slider"}
                    />
                    <div>{value}</div>
                </div>
                <button 
                    type="button"
                    onClick={handleCreateLobby}
                    className="px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 self-end">
                    Create Lobby
                </button>



            </div>
                <MapContainer center={[formData.latitude,formData.longitude]} zoom={10} style={{ height: '100vh', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapController formData = {formData} setFormData = {setFormData}/>
                <Circle center={[formData.latitude,formData.longitude]} radius={getMeters(value)} color="blue">
                    <Popup>
                    A circle of radius {getMeters(value)} meters.
                    </Popup>
                </Circle>
                </MapContainer>
        </div>
    );
}

export default Filters;
