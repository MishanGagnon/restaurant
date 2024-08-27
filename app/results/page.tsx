'use client'

import React, { useState, useEffect } from 'react';
import RestaurantCard from "../../components/RestaurantCard"
import { RestaurantInfo } from '../../components/RestaurantInfo';
import io, { Socket } from 'socket.io-client';

interface restaurant_vote {
  [restaurantId: string]: number;
}

interface ResultsProps {
  socket: Socket;
  restaurant_votes: restaurant_vote;
  restaurant_info: RestaurantInfo[];
}

export default function Results({ socket, restaurant_votes, restaurant_info }: ResultsProps) {
  const [sortedVotes, setSortedVotes] = useState<restaurant_vote | null>(null);
  const [dataReceived, setDataReceived] = useState(false);

  useEffect(() => {
    // Check if data is received
    if (restaurant_votes && Object.keys(restaurant_votes).length > 0 && restaurant_info.length > 0) {
      console.log("Restaurant votes received:", restaurant_votes);
      console.log("Restaurant info received:", restaurant_info);
      setDataReceived(true);

      setSortedVotes(restaurant_votes);
    } else {
      console.log("Data not received yet");
      setDataReceived(false);
    }
  }, [restaurant_votes, restaurant_info]);

  if (!dataReceived) {
    return <div>Loading... Waiting for restaurant data.</div>;
  }

  return (
    <div>
      <h1>Results</h1>
      {sortedVotes && (
        <div>
          <h2>Top Voted Restaurants:</h2>
          {Object.entries(sortedVotes).map(([restaurantId, votes], index) => {
            const restaurant = restaurant_info.find(r => r.restaurant_id === restaurantId);
            return (
              <div key={restaurantId}>
                <h3>{index + 1}. {restaurant?.name || 'Unknown Restaurant'}</h3>
                <p>Votes: {votes}</p>
                {/* You can add more details or use the RestaurantCard component here */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}