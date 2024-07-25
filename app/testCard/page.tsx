import React from 'react'
import RestaurantCard from './RestaurantCard';

const page = () => {

    const testRestaurantData = {
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
    };

    return (
        <div className="App">
            <RestaurantCard props={testRestaurantData} />
        </div>
    );
}

export default page
