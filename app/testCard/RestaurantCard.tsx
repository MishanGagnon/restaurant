import React from 'react'
import { RestaurantInfo } from './RestaurantInfo';
import Image from 'next/image'


interface CardProps {
    props: RestaurantInfo
}

function RestaurantCard({ props }: CardProps) {
    const { name, address, reviewCount, image_url, rating, categories, price, distance, location, closing_times } = props;

    const priceSigns = '$'.repeat(price)

    const getClosing = () => {
        const now = new Date;
        const closingTime = closing_times[now.getDay()]
        const ampm = parseInt(closingTime, 4) >= 1200 ? "PM" : "AM"
        const hours = parseInt(closingTime.substring(0, 2));
        const minutes = parseInt(closingTime.substring(2, 4));

        return (
            <h2 className="bg-red-100 text-red-700 px-2 py-1 rounded-lg text-xs"> Closes {hours}:{minutes}0 {ampm}</h2>
        )

    }

    return (
        <div className='h-full w- flex items-center justify-center '>
            <div id="card-container" className='bg-white rounded-lg shadow-lg max-w-md w-full'>
                <div className="pt-2 mx-auto flex justify-center items-center pb-2">
                    <Image
                        src={image_url}
                        alt={`Image of ${name}`}
                        sizes='100vw'
                        width={100}
                        height={200}
                        style={{
                            width: '95%',
                            height: 'auto',
                            maxWidth: '500px',  // Ensure it doesn't exceed the container's width
                            maxHeight: '1000px' // Adjust as needed
                        }}
                        className="object-cover rounded-lg"
                    />
                </div>
                {/* <div className="w-90 mx-5 border-t-2 border-gray-400"></div> */}
                <div id="restaurant-content" className="p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h1 id="restaurant-name" className='text-3xl font-bold text-gray-800'>
                            {name} <span id='restaurant-price' className="text-sky-500">{priceSigns}</span>
                        </h1>
                        {/* <h2 id="restaurant-location" className="text-lg text-md  text-gray-600">{location}</h2> */}
                        {getClosing()}
                    </div>
                    <h3 id='restaurant-rating' className="text-sky-500 font-bold mb-2 flex items-center text-xl">
                        {rating} <span id="star" className='ml-1' style={{ color: '#FFD700' }}>★</span>
                        <span id="restaurant-review-count" className="text-sm font-bold text-gray-700 font-normal ml-2 ">
                            ({reviewCount})
                        </span>
                    </h3>
                    <p className="text-gray-800 mb-2 text-sm">
                        <span id='restaurant-distance'>{distance.toFixed(2)} mi</span>
                        <span className="mx-1 text-gray-400">•</span>
                        <span id="restaurant-address" className='text-gray-500'>{address}</span>
                    </p>
                    <br className='' />
                    <div className="flex flex-wrap gap-2 mt-4">
                        {categories.map((category, index) => (
                            <span key={index} id='category' className="bg-sky-100 text-sky-600 px-2 py-1 rounded-lg text-xs">
                                {category}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantCard;