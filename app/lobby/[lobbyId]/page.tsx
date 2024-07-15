// Lobby.tsx
'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
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
  const name = searchParams.get('name');
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!name || name.trim().length === 0) {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">Lobby: {lobbyId}</h1>
      <h2 className="text-xl mb-4 text-black">Name: {name}</h2>
      <h3 className="text-lg font-semibold mb-2 text-black">Active Players:</h3>
      <ul className="list-disc list-inside text-black">
        {players.map(player => (
          <li key={player.id} className="text-black">{player.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;
