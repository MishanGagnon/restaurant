'use client';
import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import RestaurantCard from './RestaurantCard';
import { RestaurantInfo } from './RestaurantInfo';

const restaurants: RestaurantInfo[] = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
