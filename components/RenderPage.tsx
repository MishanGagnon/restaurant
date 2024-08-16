'use client';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import RestaurantCard from './RestaurantCard';
import { RestaurantInfo } from './RestaurantInfo';
import io, { Socket } from 'socket.io-client';
import submitPhrases from '../utils/submitPhrases'
import { ripples } from 'ldrs'

ripples.register()

interface PageProps {
    socket: Socket;
    restaurants: RestaurantInfo[];
    lobbyId: string;
    playerId: string;
}

function Page({ socket, restaurants, lobbyId, playerId }: PageProps) {
    const [currentIndex, setCurrentIndex] = useState(restaurants.length - 1);
    const [lastDirection, setLastDirection] = useState<string | undefined>();
    const currentIndexRef = useRef(currentIndex);
    const [votes, setVotes] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [phrase, setPhrase] = useState<string>("")
    const [numVoted, setNumVoted] = useState<number>(0);
    const [numPlayers, setNumPlayers] = useState<number>(0);


    useEffect(() => {
        console.log('Votes have been updated', votes);
    }, [votes]);

    useEffect(() => {
        //data about whole lobby's votes
        socket.on('votesData', ({ success, num_voted, num_players }) => {
            console.log('Recieved votesData');
            if (success) {
                setNumVoted(num_voted);
                setNumPlayers(num_players)
            }
            else {
                console.log("Something went wrong in the RenderPage.tsx file");
            }
        })

        return () => { 
            socket.off('votesData');
        }
    }, [socket])

    const childRefs = useMemo(
        () => Array(restaurants.length).fill(0).map(() => React.createRef<any>()),
        []
    );

    const updateCurrentIndex = (val: number) => {
        setCurrentIndex(val);
        currentIndexRef.current = val;
    };

    const canGoBack = currentIndex < restaurants.length - 1;
    const canSwipe = currentIndex >= 0;

    const swiped = (direction: string, nameToDelete: string, index: number) => {
        if (direction === 'left' || direction === 'right') {
            setLastDirection(direction);
            updateCurrentIndex(index - 1);
        }

        const restaurantId = restaurants[index].restaurant_id;
        setVotes((previousVotes) => ({
            ...previousVotes,
            [restaurantId]: direction === 'right' ? 1 : 0
        }));
    };

    const swipe = async (dir: string) => {
        if (canSwipe && currentIndex < restaurants.length) {
            await (childRefs[currentIndex].current as any)?.swipe(dir);
        }

        const restaurantId = restaurants[currentIndex].restaurant_id;
        setVotes((previousVotes) => ({
            ...previousVotes,
            [restaurantId]: dir === 'right' ? 1 : 0
        }));
    };

    const outOfFrame = (name: string, idx: number) => {
        console.log(`${name} (${idx}) has been swiped off the screen!`, currentIndexRef.current);
        if (currentIndexRef.current >= idx) {
            childRefs[idx].current?.restoreCard();
        }
    };

    const goBack = async () => {
        if (!canGoBack) return;
        const newIndex = currentIndex + 1;
        updateCurrentIndex(newIndex);
        await (childRefs[newIndex].current as any)?.restoreCard();

        const restaurantId = restaurants[newIndex].restaurant_id;
        setVotes(prevVotes => {
            const currentVotes = { ...prevVotes };
            delete currentVotes[restaurantId];
            return currentVotes;
        });
    };

    const submit = () => {
        console.log('submitted button');
        console.log(`These are the votes ${votes} for the player ${playerId}, in the lobby ${lobbyId}`);
        //if we havent submitted yet
        if (!submitted) {
            socket.emit('submitVotes', { lobbyId, playerId, votes });
        }
        setSubmitted(true);
        getRandomPhrase();
    };

    const getRandomPhrase = () => {
        const randomIndex = Math.floor(Math.random() * submitPhrases.length);
        setPhrase(submitPhrases[randomIndex]);
    }

    return (
        submitted ?
            (
                <div className="flex justify-center items-center w-screen h-screen bg-gray-100 p-4 relative overflow-hidden">
                    <div className="flex justify-center items-center">
                        <l-ripples
                            size="80"
                            speed="7"
                            color="#38bdf8"
                        ></l-ripples>
                    </div>
                    <div className="relative z-10 flex flex-col justify-center items-center">
                        <p className="text-lg text-gray-800 mb-2">
                            {numVoted} out of {numPlayers} have voted
                        </p>
                        <p className="text-gray-500 text-xl text-center">
                            {phrase}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center w-screen h-screen bg-gray-100 p-4 relative overflow-hidden">
                    <div className="w-96 h-full flex justify-center items-center overflow-hidden text-sm mb-8 select-none">
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
                        {(Object.keys(votes).length === restaurants.length) && (
                            <button
                                onClick={submit}
                                className='items-center justify-center w-64 h-16 bg-blue-500 text-3xl text-white font-bold rounded-full hover:bg-blue-700 transition duration-400 ease-in-out shadow-lg hover:shadow-xl'
                            >
                                Submit
                            </button>
                        )}
                    </div>
                    <div className='flex gap-4 mb-4'>
                        <button
                            className={`w-16 h-16 flex items-center justify-center rounded-full text-white font-bold text-xl transition duration-300 ease-in-out ${canSwipe ? 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400' : 'bg-gray-300 cursor-not-allowed'}`}
                            onClick={() => swipe('left')}
                            disabled={!canSwipe}
                            aria-label='Close'
                        >
                            <span className="text-2xl text-white">&#10006;</span>
                        </button>

                        <button
                            className={`w-16 h-16 flex items-center justify-center rounded-full text-white font-bold text-xl transition duration-300 ease-in-out  ${canGoBack ? 'bg-gray-500 hover:bg-gray-600 hover:animate-spin focus:outline-none focus:ring-2 focus:ring-gray-400' : 'bg-gray-300 cursor-not-allowed '}`}
                            onClick={() => goBack()}
                            disabled={!canGoBack}
                            aria-label="Retry"
                        >
                            <span className="text-2xl hover:scale-125">&#8635;</span>
                        </button>

                        <button
                            className={`w-16 h-16 flex items-center justify-center rounded-full text-white font-bold text-xl transition duration-300 ease-in-out ${canSwipe ? 'bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400' : 'bg-gray-300 cursor-not-allowed'}`}
                            onClick={() => swipe('right')}
                            disabled={!canSwipe}
                            aria-label="Like"
                        >
                            <span className="text-2xl scale-125">&#9825;</span>
                        </button>
                    </div>
                </div>
            )
    );

}

export default Page;
