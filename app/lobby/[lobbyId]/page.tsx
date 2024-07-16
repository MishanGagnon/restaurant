// Lobby.tsx
'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import PlayerCard from '../PlayerCard'
// types.ts
export interface Player {
  id: string;
  name: string;
}


let socket: Socket;

const Lobby = () => {
  const router = useRouter();
  const { lobbyId } = useParams();
  const searchParams = useSearchParams();
  const paramName = searchParams.get('name');
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState(paramName ?? '');
  useEffect(() => {
    if (!name) {
      router.push('/lobby');
      return;
    }

    socket = io();

    if (lobbyId) {
      socket.emit('joinLobby', { lobbyId, name });

      // Listen for the updatePlayers event to get the list of players
      socket.on('lobbyPlayerList', (players: Player[]) => {
        setPlayers(players);
        console.log('players updated');
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [lobbyId, name, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <h1 className="text-2xl font-bold mb-4 text-black">Lobby: {lobbyId}</h1>
      <h2 className="text-xl mb-4 text-black">Name: {name}</h2>
      <h3 className="text-lg font-semibold mb-2 text-black">Active Players:</h3>
      <div className='flex flex-col'>
          {players.map(player => (
            <PlayerCard name = {player.name ?? 'nameError'}/>
          ))}
      </div>
    </div>
  );
};

export default Lobby;
