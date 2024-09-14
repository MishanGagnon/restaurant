import React from 'react'
import { RestaurantInfo } from './RestaurantInfo';
import Image from 'next/image'

interface CardProps {
    restaurant: RestaurantInfo
    onLoad: (index: number) => void
    index: number
}

function RestaurantCard({ restaurant, onLoad, index }: CardProps) {
    const { name, address, reviewCount, image_url, rating, categories, price, distance, location, closing_times } = restaurant;

    const priceSigns = '$'.repeat(price)
    console.log("CARD RENDERS")

    return (
        <div className='aspect-[5/7] h-[60svh] bg-slate-50 p-3 rounded'>
            <div className="pt-2 flex justify-center items-center h-1/2 w-full relative pb-2">
                <Image
                    src={image_url}
                    alt={`Image of ${name}`}
                    fill={true}
                    onError={() => onLoad(index)}
                    onLoad={() => onLoad(index)}
                    className="object-cover rounded-lg pointer-events-none"
                />
            </div>
            <div id="restaurant-content" className="w-full h-1/2">
                <div className='flex flex-col justify-between w-full h-full'>
                    <div className="flex flex-col items-left w-full">
                        <div className='flex items-center justify-start text-left w-full flex-row'>
                            <h1 id="restaurant-name" className='text-xl md:text-3xl font-bold text-gray-800 mr-2'>
                                {name} <span id='restaurant-price' className="text-sky-500">{priceSigns}</span>
                            </h1>
                            <h3 id='restaurant-rating' className="flex items-center  font-bold text-sm md:text-base">
                                {rating} <span id="star" className='ml-1' style={{ color: '#FFD700' }}>★</span>
                                <span id="restaurant-review-count" className="ml-1 text-sm md:text-base text-gray-500">
                                    ({reviewCount})
                                </span>
                            </h3>
                        </div>
                        <h3 className="text-gray-500 text-left text-xs md:text-sm">
                            {address}
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {categories.map((category, index) => (
                            <span
                                key={index}
                                id="category"
                                className="bg-sky-100 h-6 text-sky-600 p-1 rounded-lg text-xs md:text-sm"
                            >
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
