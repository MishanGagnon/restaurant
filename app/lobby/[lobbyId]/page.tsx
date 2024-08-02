'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import PlayerCard from '../PlayerCard';

// types.ts
export interface Player {
  id: string;
  name: string;
  host: boolean;
}

let socket: Socket;

const Lobby = () => {
  
  const router = useRouter();
  const { lobbyId } = useParams();
  const searchParams = useSearchParams();
  const paramName = searchParams.get('name');
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState(paramName ?? '');
  const [nameInput, setNameInput] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [socketId, setSocketId] = useState<string>('');
  const [isHost, setHost] = useState<boolean>(false)
  const [hostPlayer, setHostPlayer] =  useState<Player>();
  
  const submitName = () => {
    setName(nameInput);
    const url = new URL(window.location.href);
    url.searchParams.set('name', nameInput);
    router.replace(url.toString(), undefined);
  };
  
  const checkValidLobby = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/lobbyCheck/${lobbyId}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.isActiveLobby) {
          return true;
        }
      }
    } catch {
      console.log('error with fetch');
    }
    return false;
  };

  useEffect(() => {
    const validateLobbyAndJoin = async () => {
      console.log('re-render');
      const isValid = await checkValidLobby();

      if (!isValid) {
        router.push('/lobby');
        return;
      }
      setLoading(false);
    } 

    validateLobbyAndJoin();
    if (name) {
      socket = io();

      socket.on('connect', () => {
        
        setSocketId(socket.id as string);
        if (lobbyId) {
          console.log('joining as new player');
          socket.emit('joinLobby', { lobbyId, name });
        }
      });

      socket.on('lobbyPlayerList', (players: Player[]) => {
        setPlayers(() => players);
        console.log(players)
        let hostPlayer = players.find((player) => player.host == true)
        setHostPlayer(hostPlayer)
        if(hostPlayer && hostPlayer.id == socket.id ){
          setHost(()=> true);
        }
        console.log('players updated');
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [lobbyId, name]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="loader">Loading...</div>
        <style jsx>{`
          .loader {
            border: 16px solid #f3f3f3;
            border-top: 16px solid #3498db;
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!name) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <h1 className="text-2xl font-bold mb-4 text-black">Lobby: {lobbyId}</h1>
      <h2 className="text-xl mb-4 text-black">Name: {name}</h2>
      <h3 className="text-lg font-semibold mb-2 text-black">Active Players:</h3>
      <div className='flex flex-col'>
        {players.map(player => (
          <PlayerCard key={player.id} isHost={player.id == hostPlayer.id} name={player.name ?? 'nameError'} />
        ))}
      </div>
    </div>
  );
};

export default Lobby;
