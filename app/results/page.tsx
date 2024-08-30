import React, { useState, useEffect } from 'react';
import RestaurantCard from "../../components/RestaurantCard";
import { RestaurantInfo } from '../../components/RestaurantInfo';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Socket } from 'socket.io-client';

interface restaurant_vote {
  [restaurantId: string]: number;
}

interface ResultsProps {
  socket: Socket;
  restaurant_votes: restaurant_vote;
  restaurant_info: RestaurantInfo[];
}

export default function Results({ socket, restaurant_votes, restaurant_info }: ResultsProps) {
  const [sortedVotes, setSortedVotes] = useState<[string, number][] | null>(null);
  const [dataReceived, setDataReceived] = useState(false);
  const [currIndex, setcurrIndex] = useState(0);

  useEffect(() => {
    if (restaurant_votes && Object.keys(restaurant_votes).length > 0 && restaurant_info.length > 0) {
      console.log("Restaurant votes received:", restaurant_votes);
      //console.log("Restaurant info received:", restaurant_info);
      setDataReceived(true);

      const sorted = Object.entries(restaurant_votes).sort((a, b) => b[1] - a[1]);
      setSortedVotes(sorted);
    } else {
      console.log("Data not received yet");
      setDataReceived(false);
    }
  }, [restaurant_votes, restaurant_info]);

  if (!dataReceived || !sortedVotes) {
    return <div className="flex justify-center items-center h-screen">Loading... Waiting for restaurant data.</div>;
  }

  const prevRestaurant = () => {
    setcurrIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : sortedVotes.length - 1));
  };

  const nextRestaurant = () => {
    setcurrIndex((prevIndex) => (prevIndex < sortedVotes.length - 1 ? prevIndex + 1 : 0));
  };

  const [restaurantId, votes] = sortedVotes[currIndex];
  const restaurant = restaurant_info.find(r => r.restaurant_id === restaurantId);

  if (!restaurant) {
    return <div className="flex justify-center items-center h-screen">Restaurant not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6">Top Voted Restaurants</h1>
      <div className="relative w-full max-w-md mb-6">
        <div className="flex justify-center">
          <RestaurantCard
            restaurant={restaurant}
            onLoad={() => {}}
            index={currIndex}
          />
        </div>
        <button className="absolute top-1/2 -left-12 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          onClick={prevRestaurant} 
        >
          <ChevronLeft size={24} />
        </button>
        <button className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
          onClick={nextRestaurant} 
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="text-xl font-semibold">
        Votes: {votes}
      </div>
      <div className="mt-2 text-gray-600">
        {currIndex + 1} of {sortedVotes.length}
      </div>
    </div>
  );
}