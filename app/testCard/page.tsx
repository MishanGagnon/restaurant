'use client';
import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import RestaurantCard from './RestaurantCard';
import { RestaurantInfo } from './RestaurantInfo';

const restaurants: RestaurantInfo[] = [
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

function Page() {
    const [currentIndex, setCurrentIndex] = useState(restaurants.length - 1);
    const [lastDirection, setLastDirection] = useState<string | undefined>();
    const currentIndexRef = useRef(currentIndex);

    const childRefs = useMemo(
        () => Array(restaurants.length).fill(0).map(() => React.createRef<typeof TinderCard>()),
        []
    );

    const updateCurrentIndex = (val: number) => {
        setCurrentIndex(val);
        currentIndexRef.current = val;
    };

    const canGoBack = currentIndex < restaurants.length - 1;
    const canSwipe = currentIndex >= 0;

    const swiped = (direction: string, nameToDelete: string, index: number) => {
        // Only handle left or right swipes
        if (direction === 'left' || direction === 'right') {
            setLastDirection(direction);
            updateCurrentIndex(index - 1);
        }
    };

    const outOfFrame = (name: string, idx: number) => {
        console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
        if (currentIndexRef.current >= idx) {
            childRefs[idx].current?.restoreCard();
        }
    };

    const swipe = async (dir: string) => {
        if (canSwipe && currentIndex < restaurants.length) {
            await childRefs[currentIndex].current?.swipe(dir);
        }
    };

    const goBack = async () => {
        if (!canGoBack) return;
        const newIndex = currentIndex + 1;
        updateCurrentIndex(newIndex);
        await childRefs[newIndex].current?.restoreCard();
    };

    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100 p-4 relative overflow-hidden">
            <div className="w-full h-full flex justify-center items-center overflow-hidden text-sm mb-8">
                {restaurants.map((restaurant, index) => (
                    <TinderCard
                        ref={childRefs[index]}
                        className='swipe absolute'
                        key={restaurant.restaurant_id}
                        onSwipe={(dir) => swiped(dir, restaurant.name, index)}
                        onCardLeftScreen={() => outOfFrame(restaurant.name, index)}
                    >
                        <RestaurantCard props={restaurant} />
                    </TinderCard>
                ))}
            </div>
            <div className='flex gap-4 mb-4'>
                <button
                    className={`px-4 py-2 rounded-lg text-white font-bold ${canSwipe ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    onClick={() => swipe('left')}
                    disabled={!canSwipe}
                >
                    Swipe Left
                </button>
                <button
                    className={`px-4 py-2 rounded-lg text-white font-bold ${canGoBack ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    onClick={() => goBack()}
                    disabled={!canGoBack}
                >
                    Undo Swipe
                </button>
                <button
                    className={`px-4 py-2 rounded-lg text-white font-bold ${canSwipe ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
                    onClick={() => swipe('right')}
                    disabled={!canSwipe}
                >
                    Swipe Right
                </button>
            </div>
            {/* <h2 className='text-xl font-semibold text-gray-700'>
                {lastDirection ? `You swiped ${lastDirection}` : 'Swipe a card or press a button to see the swipe direction!'}
            </h2> */}
        </div>
    );
}

export default Page;
