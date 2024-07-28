'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';

interface FormData {
  longitude: number | '';
  latitude: number | '';
  min_rating: number;
  radius: number;
  num_restaurants: number | '';
}

interface FormErrors {
  longitude?: string;
  latitude?: string;
  num_restaurants?: string;
}

// Custom hook for form handling
const useFilterForm = (initialState: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value === '' ? '' : Number(value) }));
  };

  const setFormField = (name: keyof FormData, value: number) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.longitude === '' || isNaN(Number(formData.longitude)) || Number(formData.longitude) < -180 || Number(formData.longitude) > 180) {
      newErrors.longitude = 'Please enter a valid longitude (-180 to 180)';
    }

    if (formData.latitude === '' || isNaN(Number(formData.latitude)) || Number(formData.latitude) < -90 || Number(formData.latitude) > 90) {
      newErrors.latitude = 'Please enter a valid latitude (-90 to 90)';
    }

    if (formData.num_restaurants === '' || isNaN(Number(formData.num_restaurants)) || Number(formData.num_restaurants) < 5 || Number(formData.num_restaurants) > 20) {
      newErrors.num_restaurants = 'Please enter a number between 5 and 20';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { formData, handleChange, setFormField, errors, validateForm };
};

// Custom hook for geolocation
const useGeolocation = () => {
  const [loading, setLoading] = useState(false);

  const getLocation = (callback: (lat: number, lng: number) => void) => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          callback(position.coords.latitude, position.coords.longitude);
          setLoading(false);
        },
        () => {
          console.log("Error getting location");
          setLoading(false);
        }
      );
    } else {
      console.log("Geolocation is not available in your browser.");
      setLoading(false);
    }
  };

  return { getLocation, loading };
};

// MapController component to update map view
const MapController: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

// Map component
const Map: React.FC<{ formData: FormData }> = React.memo(({ formData }) => {
  const center: [number, number] = [Number(formData.latitude) || 0, Number(formData.longitude) || 0];
  const getMeters = (miles: number): number => miles * 1609.344;

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%', borderRadius: "12px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapController center={center} zoom={10} />
      <Circle center={center} radius={getMeters(formData.radius)} color="blue">
        <Popup>
          A circle of radius {getMeters(formData.radius)} meters.
        </Popup>
      </Circle>
    </MapContainer>
  );
});

Map.displayName = 'Map';

const Filters: React.FC = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const { formData, handleChange, setFormField, errors, validateForm } = useFilterForm({
    longitude: -83.7430,
    latitude: 42.2808,
    min_rating: 3.5,
    radius: 5,
    num_restaurants: 10
  });

  const { getLocation, loading } = useGeolocation();

  const handleCreateLobby = () => {
    if (validateForm()) {
      const validFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value === '' ? 0 : value])
      );

      fetch('http://localhost:3000/api/createLobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validFormData),
      })
        .then((res) => res.json())
        .then((data: { message: string; lobbyCode?: string }) => {
          if (data.message === 'Lobby added' && data.lobbyCode) {
            router.push(`/lobby/${data.lobbyCode}`);
          } else {
            console.log("Error creating lobby, try again");
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  const handleLocationClick = () => {
    getLocation((latitude, longitude) => {
      setFormField('latitude', latitude);
      setFormField('longitude', longitude);
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="bg-gray-100 h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4 bg-white md:overflow-y-auto">
        <h1 className='text-black font-bold text-2xl text-center mb-4'>Session Settings</h1>

        <div className="space-y-4">
          <input
            type="number"
            onChange={handleChange}
            name="latitude"
            value={formData.latitude}
            placeholder="Latitude"
            className={`w-full p-2 border rounded-md text-black ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude}</p>}
          <input
            type="number"
            onChange={handleChange}
            name="longitude"
            value={formData.longitude}
            placeholder="Longitude"
            className={`w-full p-2 border rounded-md text-black ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude}</p>}
          <button
            onClick={handleLocationClick}
            className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 flex justify-center items-center"
            disabled={loading}
          >
            {loading && <div className="loader mr-2"></div>}
            Get host location
          </button>
          <input
            type="number"
            onChange={handleChange}
            name="num_restaurants"
            value={formData.num_restaurants}
            placeholder="Number of Restaurants"
            className={`w-full p-2 border rounded-md text-black ${errors.num_restaurants ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.num_restaurants && <p className="text-red-500 text-sm">{errors.num_restaurants}</p>}
          <div>
            <label className="text-black font-bold">Search radius: {formData.radius} miles</label>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={formData.radius}
              onChange={(e) => setFormField('radius', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-black font-bold">Minimum Rating: {formData.min_rating}</label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={formData.min_rating}
              onChange={(e) => setFormField('min_rating', Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            onClick={handleCreateLobby}
            className="w-full px-4 py-2 bg-lime-800 text-white font-bold rounded-md hover:bg-lime-700"
          >
            Create Lobby
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-1/2 md:h-screen p-4">
        <Map formData={formData} />
      </div>
    </div>
  );
}

export default Filters;