'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import RestaurantCard from "./RestaurantCard";
import { RestaurantInfo } from './RestaurantInfo';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
// import { Card, CardContent } from "../../components/ui/card";

interface restaurant_vote {
  [restaurantId: string]: number;
}

interface ResultsProps {
  socket: Socket;
  restaurant_votes: restaurant_vote;
  restaurant_info: RestaurantInfo[];
}

type BadgeProps = {
  index: number
  votes: number
}
const Badge = ({ index, votes }: BadgeProps) => {
  // Determine the correct vote text based on the votes count
  const voteText = votes === 1 ? 'Vote' : 'Votes';

  if (index < 3) {
    const colors = ["bg-yellow-400", "bg-gray-300", "bg-yellow-600"];
    const labels = ["1st Place", "2nd Place", "3rd Place"];
    
    return (
      <div className={`${colors[index]} text-black font-bold py-2 px-4 rounded-full mb-4`}>
        {labels[index]}: {votes} {voteText}
      </div>
    );
  } 
  
  return (
    <div className="bg-gray-400 text-black font-bold py-2 px-4 rounded-full mb-4">
      {`${index + 1}th Place: ${votes} ${voteText}`}
    </div>
  );
};


export default function Results({ socket, restaurant_votes, restaurant_info }: ResultsProps) {
  const router = useRouter();
  const [sortedVotes, setSortedVotes] = useState<[string, number][] | null>(null);
  const [dataReceived, setDataReceived] = useState(false);
  
  //for Carousel counter
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])


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
    <div className="flex flex-col h-svh items-center justify-center bg-gray-100 px-4 py-8">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="outline" onClick={() => router.push('/')}>
          Back
        </Button>
      </div>
      <Carousel setApi={setApi} className="w-full flex align-center justify-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ">
        <CarouselContent >
          {sortedVotes.map(([restaurantId, votes], index) => {
            const restaurant = restaurant_info.find(r => r.restaurant_id === restaurantId);
            if (!restaurant) return null;

            return (
              <CarouselItem key={restaurantId} className='flex flex-col items-center justify-center' >
                
                    <Badge index={index} votes={votes} />
                    <RestaurantCard
                      restaurant={restaurant}
                      onLoad={() => {}}
                      index={index}
                    />
                    {/* <div className="mt-4 text-sm sm:text-lg md:text-xl font-semibold">
                      Votes: {votes}
                    </div>
                    <div className="mt-2 text-xs sm:text-sm md:text-base text-gray-600">
                      {index + 1} of {sortedVotes.length}
                    </div> */}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        <CarouselPrevious className='hidden md:flex'/>
        <CarouselNext className='hidden md:flex'/>
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}