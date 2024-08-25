'use client'
import React, { useState, useEffect } from 'react';
import RestaurantCard from "../../components/RestaurantCard"
import { RestaurantInfo } from '../../components/RestaurantInfo';
import io, { Socket } from 'socket.io-client';
//import { restaurantInfo } from '@/server';
import { useRouter } from 'next/router';
//import { restaurants } from '../testCard/page';

interface Votes {
  [restaurantId: string]: number;
}

interface ResultsProps {
    socket: Socket;
    restaurantData: RestaurantInfo[];
}

// Votes object ~ Object that stores a map of player ids to another map object, which stores restaurant ids to their vote for that restaurant
// Create a totalVotes state which maps restaurant_id to total votes.

// Go through votes object, and for each player, go through that players' restaurant map and tally up total votes as you go.
// Sort totalVotes in descending order by a restaurant's total votes
// store the top 3 total votes in an array = 
// Use the restaurant ids at the top 3 of totalVotes to find the index they are at in our restaurantInfo[]. store that in an array; [1,3,4]


export default function Results({ socket, restaurantData }: ResultsProps) {
    const [sortedVotes, setTotalVotes] = useState<Votes | null>(null);
    const [topThree, setTopThree] = useState<Votes | null>(null);

    useEffect(() => {
        socket.on('gotAllVotes', ({sortedVotes, topThree}) => {
          setTotalVotes(sortedVotes);
          setTopThree(topThree);
          console.log(`Top three`, topThree)
        });

        return () => {
          socket.off('gotAllVotes');
        };
      }, [socket]);

    
    return (
        <div>
          TEST
        </div>
    )
}
