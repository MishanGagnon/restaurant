'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import PlayerCard from '../PlayerCard';
import RestaurantPage from '../../../components/RenderPage'
import data from '../../../components/restaurantTestData'
import Results from '../../../components/ResultsPage'
import { RestaurantInfo } from '@/components/RestaurantInfo';
import { Loader2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';


// types.ts
export interface Player {
  id: string;
  name: string;
  host: boolean;
}

interface Votes {
  [restaurantId: string]: number;
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
  const [userID, setUserID] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [hostPlayer, setHostPlayer] = useState<Player>();
  const [gameState, setGameState] = useState<GameState>('lobby')
  const [restaurantData, setRestaurantData] = useState<any>();
  const [total_restaurant_votes, setTotalRestaurantVotes] = useState<Votes>({});
  const [all_restaurant_info, setRestaurantInfo] = useState<RestaurantInfo[]>([])
  const [playerVoted, setPlayerVoted] = useState(false);

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

      let userID = localStorage.getItem('userID');
      if (!userID) {
        userID = uuidv4();
        localStorage.setItem('userID', userID);
      }
      setUserID(()=>userID)

      socket = io({
        query: { userID }
      });

      socket.on('connect', () => {
        
        if (lobbyId) {
          socket.emit('joinLobby', { lobbyId, name });
        }
      });

      socket.on('gameState', (gameState: GameState)=>{
        setGameState(gameState);
      })

      socket.on('lobbyPlayerList', (players: Player[]) => {
        setPlayers(() => players);
        console.log(players);
        const hostPlayer = players.find((player) => player.host === true);
        setHostPlayer(hostPlayer);
        if (hostPlayer && hostPlayer.id === userID) {
          setIsHost(true);
        }
      });

      socket.on('restauraunt_cards', (json: any) => {
        if(json.playerVoted){
          setPlayerVoted(true)
        }
        console.log('received cards json', json)
        setRestaurantData(json.restaurants)
        setGameState('voting')
      })

      socket.on('gotAllVotes', ({ sortedVotes, SortedRestaurantInfo }) => {
        setTotalRestaurantVotes(sortedVotes)
        setRestaurantInfo(SortedRestaurantInfo)
        setGameState('endscreen')
      })

      return () => {
        socket.disconnect();
      };
    }
  }, [lobbyId, name]);

  if (!name) {
    return (
      <div className="flex flex-col items-center justify-center h-svh bg-gray-100 ">
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
      <div className="flex flex-col items-center justify-center h-svh bg-gray-100">
        <Loader2 className='w-20 h-20 animate-spin'></Loader2>
      </div>
    );
  }

  {
    switch (gameState) {
      case 'lobby':
        return (
          <div className="flex flex-col w-screen items-center h-svh bg-gray-100 text-black p-6 lg:px-96 md:46">
            <div id="lobby-info" className="w-full flex items-center justify-between min-h-40">
              <div className ='w-1/2'>
                <div className="flex items-center gap-4 mb-4">
                  <Button variant="outline" onClick={() => router.push('/')}>
                    Back
                  </Button>
                  <h1 className="text-2xl font-bold text-black md:text-xl">Lobby: {lobbyId}</h1>
                </div>
                <h2 className="text-xl mb-4 text-black md:text-xl">Name: {name}</h2>
              </div>
              <div className='w-1/2 flex justify-center items-center'>

              {(isHost && players.length >= 2) && (
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
                  isPlayer={player.id === userID}
                  name={player.name ?? 'nameError'}
                />
              ))}
            </div>
          </div>
        );

      case 'voting':
        return (<RestaurantPage socket={socket} restaurants={restaurantData} lobbyId={lobbyId as string} playerId={userID || 'WE FUCKED UP'} previouslyVoted={playerVoted} />)
      case 'endscreen': 
        return (<Results socket={socket} restaurant_votes={total_restaurant_votes} restaurant_info={all_restaurant_info} />)
    }
  }
};

export default Lobby;
