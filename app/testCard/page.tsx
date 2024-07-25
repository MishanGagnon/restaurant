'use client'

import React from 'react'
import RestaurantCard from './RestaurantCard';
import { RestaurantInfo } from './RestaurantInfo';
import { useState } from 'react';

const page = () => {

    const [currentIndex, setcurrentIndex] = useState(0);

    const restaurantData: RestaurantInfo[] = [{
        restaurant_id: "qh8SGt-7jd-JTXCxe7Amlg",
        name: "Peridot",
        address: "118 W Liberty St, Ann Arbor, MI 48104",
        reviewCount: 48,
        image_url: "https://s3-media2.fl.yelpcdn.com/bphoto/iA1PwGvQDUDqA6aLG4npsg/o.jpg",
        rating: 4.3,
        categories: ["Vietnamese", "Cocktail Bars", "Wine Bars"],
        price: 2,
        distance: 1432.84,
        location: "Ann Arbor",
        closing_times: ["1200", "1200", "1200", "0100", "0100", "0100", "0100"]
    }];

    const nextCard = () => {
        setcurrentIndex((prev) =>
            prev === restaurantData.length - 1 ? 0 : prev + 1
        )
    }



    return (
        <div className="App">
            <RestaurantCard props={restaurantData[currentIndex]} />
            <div id="buttons" className='bg-gray-100 border-'>
                <button onClick={nextCard} className="rounded-full my-10 text-black">This is the like button</button>
            </div>
        </div>
    );
}

export default page
