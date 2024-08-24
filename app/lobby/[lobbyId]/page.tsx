'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import PlayerCard from '../PlayerCard';
import RestaurantPage from '../../../components/RenderPage'
import data from '../../../components/restaurantTestData'
import { Loader2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

// types.ts
export interface Player {
  id: string;
  name: string;
  host: boolean;
}

// export interface GameState: 'lobby' | 'voting' | 'endscreen'
export type GameState = 'lobby' | 'voting' | 'endscreen'

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
  const [isHost, setIsHost] = useState<boolean>(false);
  const [hostPlayer, setHostPlayer] = useState<Player>();
  const [gameState, setGameState] = useState<GameState>('lobby')
  const [restaurantData, setRestaurantData] = useState<any>();

  const submitName = () => {
    setName(nameInput);
    const url = new URL(window.location.href);
    url.searchParams.set('name', nameInput);
    router.replace(url.toString(), undefined);
  };

  const startGame = () => {
    console.log('started game')
    if (players.length > 1) {
      socket.emit('startGame', lobbyId);
    } else {
      alert('Only one player in lobby')
    }
  }

  const checkValidLobby = async () => {
    // const baseUrl = window.location.origin;
    let baseUrl = process.env.NEXT_PUBLIC_NEXT_DOMAIN
    try {
      const response = await fetch(`${baseUrl}/api/lobbyCheck/${lobbyId}`);
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
      const isValid = await checkValidLobby();
      if (!isValid) {
        router.push('/lobby');
        return;
      }
      setLoading(false);
    };

    validateLobbyAndJoin();
    if (name) {
      console.log(process.env.NEXT_PUBLIC_NEXT_DOMAIN)
      socket = io();



      socket.on('connect', () => {

        setSocketId(socket.id as string);
        if (lobbyId) {
          socket.emit('joinLobby', { lobbyId, name });
        }
      });

      socket.on('lobbyPlayerList', (players: Player[]) => {
        setPlayers(() => players);
        console.log(players);
        const hostPlayer = players.find((player) => player.host === true);
        setHostPlayer(hostPlayer);
        if (hostPlayer && hostPlayer.id === socket.id) {
          setIsHost(true);
        }
      });

      socket.on('restauraunt_cards', (json: any) => {
        console.log('received cards json', json)
        setRestaurantData(json.restaurants)
        setGameState('voting')
      })

      return () => {
        socket.disconnect();
      };
    }
  }, [lobbyId, name]);

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
  if (loading || players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className='w-20 h-20 animate-spin'></Loader2>
      </div>
    );
  }

  {
    switch (gameState) {
      case 'lobby':
        return (
          <div className="flex flex-col w-screen items-center min-h-screen bg-gray-100 text-black p-6 lg:px-96 md:46">
            <div id="lobby-info" className="w-full flex items-center justify-between min-h-40">
              <div className ='w-1/2'>
                <h1 className="text-2xl font-bold mb-4 text-black md:text-xl">Lobby: {lobbyId}</h1>
                <h2 className="text-xl mb-4 text-black md:text-xl">Name: {name}</h2>
              </div>
              <div className='w-1/2 flex justify-center items-center'>

              {isHost && (
                <Button onClick={startGame}>
                  Start Lobby
                </Button>
              )}
              </div>

            </div>



            <div className="grid grid-cols-2  sm:grid-cols-3 md:grid-cols-2 gap-2 w-full">
              {players.map(player => (
                <PlayerCard
                  key={player.id}
                  isHost={player.id === hostPlayer?.id}
                  isPlayer={player.id === socket?.id}
                  name={player.name ?? 'nameError'}
                />
              ))}
            </div>
          </div>
        );

      case 'voting':
        return (<RestaurantPage socket={socket} restaurants={restaurantData} lobbyId={lobbyId as string} playerId={socket.id || 'WE FUCKED UP'} />)
    }
  }
};

export default Lobby;
