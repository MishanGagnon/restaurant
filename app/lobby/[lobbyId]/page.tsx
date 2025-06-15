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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-6 left-6 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
              <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Choose Your Display Name
              </h1>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="nameInput" className="block text-sm font-medium text-gray-700">
                    Display Name
                  </label>
                  <input
                    id="nameInput"
                    type="text"
                    value={nameInput}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>

                <button
                  onClick={submitName}
                  className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
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
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
            {/* Back Button */}
            <button
              onClick={() => router.push('/')}
              className="absolute top-6 left-6 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300">
                  {/* Lobby Info */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-800">Lobby: {lobbyId}</h1>
                        <p className="text-lg text-gray-600 mt-1">Your name: {name}</p>
                      </div>
                      {isHost && players.length >= 2 && (
                        <Button 
                          onClick={startGame}
                          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Start Game
                        </Button>
                      )}
                    </div>
                    <div className="h-px bg-gray-200 w-full"></div>
                  </div>

                  {/* Players Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {players.map(player => (
                      <PlayerCard
                        key={player.id}
                        isHost={player.id === hostPlayer?.id}
                        isPlayer={player.id === userID}
                        name={player.name ?? 'nameError'}
                      />
                    ))}
                  </div>

                  {/* Waiting Message */}
                  {isHost && players.length < 2 && (
                    <div className="mt-8 text-center">
                      <p className="text-gray-600">Waiting for more players to join...</p>
                      <p className="text-sm text-gray-500 mt-2">Share the lobby code with your friends!</p>
                    </div>
                  )}
                </div>
              </div>
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
