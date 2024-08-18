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
        <div id="card-container" className=' flex justify-center items-center flex-col bg-white rounded-lg shadow-lg w-[80vw] p-2 h-[60svh] md:max-w-md md:w-96	md:h-[450px]'>
            <div className="pt-2 flex justify-center items-center h-72  w-60 md:h-72  md:w-80 aspect-square	 w-full relative pb-2">
                <Image
                    src={image_url}
                    alt={`Image of ${name}`}
                    // sizes='100vw'
                    fill={true}
                    // style={{
                    //     // width: '300px',
                    //     // height: '300px',
                    //     // maxWidth: '90%',  // Ensure it doesn't exceed the container's width
                    //     // maxHeight: '1000px', // Adjust as needed
                    //     aspectRatio: 3 / 3
                    // }}
                    onLoad={(e)=>{onLoad(index)}}
                    className="object-cover rounded-lg pointer-events-none"
                />
            </div>
            {/* <div className="w-90 mx-5 border-t-2 border-gray-400"></div> */}
            <div id="restaurant-content" className="w-full grow">
                <div className="flex justify-between items-center mb-2">
                    <h1 id="restaurant-name" className='text-3xl font-bold text-gray-800'>
                        {name} <span id='restaurant-price' className="text-sky-500">{priceSigns}</span>
                    </h1>
                    {/* <h2 id="restaurant-location" className="text-lg text-md  text-gray-600">{location}</h2> */}
                    {/* {getClosing()} */}
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

    )
}

export default RestaurantCard;