'use client'
import React from 'react'

const Filters = () => {
    const [formData, setFormData] = React.useState({
        longitude: 0,
        latitude: 0,
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

    // Uses geolocation API to get coordinates of host 
    function handleLocationClick() {
        // Add your geolocation logic here
    }

    return (
        <form className="flex space-x-4 p-4">
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
                    htmlFor={id + "-slider"}
                    className="flex flex-col"> 
                    Select your search radius.
                </label>
                <input
                    type="range"
                    min="0"
                    max="50"
                    value={value}
                    onChange={handleSlider}
                    id={id + "-slider"}
                />
                <div>{value}</div>
            </div>
        </form>
    );
}

export default Filters;
