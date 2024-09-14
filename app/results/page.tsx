'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import RestaurantCard from "../../components/RestaurantCard";
import { RestaurantInfo } from '../../components/RestaurantInfo';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Card, CardContent } from "../../components/ui/card";

interface restaurant_vote {
  [restaurantId: string]: number;
}

interface ResultsProps {
  socket: Socket;
  restaurant_votes: restaurant_vote;
  restaurant_info: RestaurantInfo[];
}

const Badge = ({ index }: { index: number }) => {
  if (index < 3) {
    const colors = ["bg-yellow-400", "bg-gray-300", "bg-yellow-600"];
    const labels = ["1st Place", "2nd Place", "3rd Place"];
    
    return (
      <div className={`${colors[index]} text-black font-bold py-2 px-4 rounded-full mb-4`}>
        {labels[index]}
      </div>
    );
  } 
  
  return (
    <div className="bg-gray-400 text-black font-bold py-2 px-4 rounded-full mb-4">
      {`${index + 1}th Place`}
    </div>
  );
};

export default function Results({ socket, restaurant_votes, restaurant_info }: ResultsProps) {
  const [sortedVotes, setSortedVotes] = useState<[string, number][] | null>(null);
  const [dataReceived, setDataReceived] = useState(false);

  useEffect(() => {
    if (restaurant_votes && Object.keys(restaurant_votes).length > 0 && restaurant_info.length > 0) {
      console.log("Restaurant votes received:", restaurant_votes);
      setDataReceived(true);

      const sorted = Object.entries(restaurant_votes).sort((a, b) => b[1] - a[1]);
      setSortedVotes(sorted);
    } else {
      console.log("Data not received yet");
      setDataReceived(false);
    }
  }, [restaurant_votes, restaurant_info]);

  if (!dataReceived || !sortedVotes) {
    return <div className="flex justify-center items-center h-screen">Loading Selectaurant Results...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Top Voted Restaurants</h1>
      <Carousel className="w-full flex align-center justify-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ">
        <CarouselContent >
          {sortedVotes.map(([restaurantId, votes], index) => {
            const restaurant = restaurant_info.find(r => r.restaurant_id === restaurantId);
            if (!restaurant) return null;

            return (
              <CarouselItem key={restaurantId} className='flex flex-col items-center justify-center' >
                
                    <Badge index={index} />
                    <RestaurantCard
                      restaurant={restaurant}
                      onLoad={() => {}}
                      index={index}
                    />
                    <div className="mt-4 text-sm sm:text-lg md:text-xl font-semibold">
                      Votes: {votes}
                    </div>
                    <div className="mt-2 text-xs sm:text-sm md:text-base text-gray-600">
                      {index + 1} of {sortedVotes.length}
                    </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        <CarouselPrevious className='hidden md:flex'/>
        <CarouselNext className='hidden md:flex'/>
      </Carousel>
    </div>
  );
}