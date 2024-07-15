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
  const [nameInput, setNameInput] = useState<string>('')
  const submitName = () => {
    setName(()=>nameInput)
    const url = new URL(window.location.href);
    url.searchParams.set('name', nameInput);
    router.replace(url.toString(), undefined,)
  }

  useEffect(() => {
    if (!name) {
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
  }, [lobbyId,name]);

  return (
    name == '' ? 
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-black">Choose display name</h1>
      <div>
      <input
        type="text"
        value={nameInput}
        className="m-5 p-2 text-black border border-gray-300 rounded"
        onChange={(e) => setNameInput(e.target.value)}
        placeholder="Set Name"
      />
      <button
        onClick={submitName}
        className="m-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Enter
      </button>

      </div>
    </div>

    :

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
