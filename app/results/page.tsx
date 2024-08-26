'use client'
import React, { useState, useEffect } from 'react';
import RestaurantCard from "../../components/RestaurantCard"
import { RestaurantInfo } from '../../components/RestaurantInfo';
import io, { Socket } from 'socket.io-client';
//import { restaurantInfo } from '@/server';
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
    const [topThreeRestaurantsInfo, settopThreeRestaurantsInfo] = useState<RestaurantInfo[]>([]);
    const [topVotes, setTopVotes] = useState<Number[]>([]);

    useEffect(() => {
      console.log('Setting up socket listener for gotAllVotes');
      socket.on('gotAllVotes', ({ sortedVotes, topthree }) => {
        console.log('Received votes:', sortedVotes, topthree);

        setTotalVotes(sortedVotes);
        setTopThree(topthree);
      });
  
      return () => {
          socket.off('gotAllVotes');
      };
    }, []);

    useEffect(() => {
      if (topThree && restaurantData) {
        const topThreeIds = Object.keys(topThree);
        const topThreeInfo = topThreeIds
          .map(id => restaurantData.find(restaurant => restaurant.restaurant_id === id))
          .filter((restaurant): restaurant is RestaurantInfo => restaurant !== undefined);
        settopThreeRestaurantsInfo(topThreeInfo);
      }
    }, [topThree, restaurantData]);

    useEffect(() => {
      if (topThree) {
        
      }
    })
  
    
    return (
      <div>
      <h2>Top Three Restaurants:</h2>
      {topThreeRestaurantsInfo.map((restaurant, index) => (
        <div key={restaurant.restaurant_id}>
          <h3>{restaurant.name}</h3>
          <p>Address: {restaurant.address}</p>
          <p>Rating: {restaurant.rating}</p>
        </div>
      ))}
    </div>
    )
}
