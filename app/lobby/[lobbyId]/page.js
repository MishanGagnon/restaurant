'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

let socket;

const Lobby = () => {
  const router = useRouter();
  const { lobbyId } = useParams();
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  useEffect(() => {
    if (!name || name.trim().length === 0) {
      router.push('/lobby');
      return;
    }

    socket = io();

    if (lobbyId) {
      socket.emit('joinLobby', {lobbyId : lobbyId, name : name});
    }


    return () => {
      socket.disconnect();
    };
  }, [lobbyId, name, router]);


  return (
    <div>
      <h1>Lobby: {lobbyId}</h1>
      <h1>Name: {name}</h1>
    </div>
  );
};

export default Lobby;
