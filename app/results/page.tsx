'use client'
import React from 'react'
import RestaurantCard from "../../components/RestaurantCard"
import { RestaurantInfo } from '../../components/RestaurantInfo';
//import { restaurants } from '../testCard/page';

export const restaurants: RestaurantInfo[] = [
    {
        "restaurant_id": "qh8SGt-7jd-JTXCxe7Amlg",
        "name": "Peridot",
        "address": "118 W Liberty St, Ann Arbor, MI 48104",
        "reviewCount": 48,
        "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/iA1PwGvQDUDqA6aLG4npsg/o.jpg",
        "rating": 4.3,
        "categories": ["Vietnamese", "Cocktail Bars", "Wine Bars"],
        "price": 2,
        "distance": 1432.84,
        "location": "Ann Arbor",
        "closing_times": ["1700", "1700", "1700", "1700", "1700", "1700", "0000", "0000", "0000", "0000"]
    },
    {
        "restaurant_id": "ULPzNVF_fWutdYeCaCPc4A",
        "name": "HanJan Pocha",
        "address": "106 S 1st St, Ann Arbor, MI 48104",
        "reviewCount": 2,
        "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/IHMHQ6pxafXewHs_n8v5pA/o.jpg",
        "rating": 4,
        "categories": ["Korean", "Ramen", "Street Vendors"],
        "price": 1,
        "distance": 1584.97,
        "location": "Ann Arbor",
        "closing_times": ["1700", "1700", "1700", "1700", "1700", "1700", "0000", "0000", "0000", "0000"]
    },
    {
        "restaurant_id": "yNIYH9041m1JEyRS-N_LNw",
        "name": "Aventura",
        "address": "216 E Washington St, Ann Arbor, MI 48104",
        "reviewCount": 931,
        "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/5Jm6V4JSMo-uXuuzuy-Swg/o.jpg",
        "rating": 4,
        "categories": ["Tapas Bars", "Spanish", "Bars"],
        "price": 3,
        "distance": 1184.69,
        "location": "Ann Arbor",
        "closing_times": ["1500", "1500", "1500", "1500", "1500", "1500", "2200", "2200", "2200", "2300"]
    },
    {
        "restaurant_id": "Fv2VLzVj9ATLcTbFehTDjg",
        "name": "Sava's",
        "address": "216 S State St, Ann Arbor, MI 48104",
        "reviewCount": 1380,
        "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/FZHW89q9xdE_FHCkUSOjHg/o.jpg",
        "rating": 3.9,
        "categories": ["Bars", "Breakfast & Brunch", "American"],
        "price": 2,
        "distance": 745.41,
        "location": "Ann Arbor",
        "closing_times": ["1000", "1000", "1000", "1000", "1000", "1000", "2200"]
    },
];

const sampleIndices = [0, 1, 2];
const sampleVotes = [20, 15, 10];

type ResultsProps = {
    restaurants: RestaurantInfo[];
    indices: number[];
    votes: number[];
};

const Results: React.FC<ResultsProps> = ({ restaurants, indices, votes }) => {
    // Sort restaurants by votes in descending order
    const selectedRestaurants = indices
        .map((index, i) => ({
            restaurant: restaurants[index],
            votes: votes[i]
        }))
        .sort((a, b) => b.votes - a.votes);

    return (
        <div className="flex items-end justify-center bg-gray-100 p-5">
            {selectedRestaurants.map(({ restaurant, votes }, index) => {
                let podiumClass = '';
                let scale = 'scale-50';
                let order = '';

                if (index === 0) {
                    podiumClass = 'bg-yellow-400 text-black';
                    scale = 'scale-100';
                    order = 'order-2'; // Middle
                } else if (index === 1) {
                    podiumClass = 'bg-gray-300 text-black';
                    scale = 'scale-75';
                    order = 'order-1'; // Left
                } else if (index === 2) {
                    podiumClass = 'bg-orange-600 text-black';
                    scale = 'scale-75';
                    order = 'order-3'; // Right
                }

                return (
                    <div 
                        key={restaurant.restaurant_id} 
                        className={`mb-4 p-4 rounded-lg ${podiumClass} ${scale} ${order}`}
                    >
                        <RestaurantCard props={restaurant} />
                        <p className="text-center font-bold mt-2">Votes: {votes}</p>
                        {index === 0 && <p className="text-center text-2xl mt-1">🥇</p>}
                        {index === 1 && <p className="text-center text-2xl mt-1">🥈</p>}
                        {index === 2 && <p className="text-center text-2xl mt-1">🥉</p>}
                    </div>
                );
            })}
        </div>
    );
};

// Rendering the Results component with sample data
const ResultsPage: React.FC = () => {
    return (
        <div className="min-h-screen w-full bg-gray-100 text-black overflow-hidden">
            <div>
                <Results restaurants={restaurants} indices={sampleIndices} votes={sampleVotes} />
            </div >
        </div>
    );
};

export default ResultsPage;