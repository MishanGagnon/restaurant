'use client';

import { createPostponedAbortSignal } from 'next/dist/server/app-render/dynamic-rendering';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Home = () => {
  const router = useRouter();
  const [lobbyCode, setLobbyCode] = useState('');
  const [name, setName] = useState('');

  const enterLobby = async () => {
    if (lobbyCode && name) {
      try {
        const response = await fetch(`http://localhost:3000/api/lobbyCheck/${lobbyCode}`);
        
        // Check if the response is ok (status in the range 200-299)
        if (response.ok) {
          const data = await response.json();
          
          // Assuming the response contains a field `isValid`
          if (data.isActiveLobby) {
            router.push(`/lobby/${lobbyCode}?name=${encodeURIComponent(name)}`);
          } else {
            alert('Lobby code invalid');
          }
        } else {
          alert('Failed to validate lobby code. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching lobby validation:', error);
        alert('An error occurred while validating the lobby code. Please try again.');
      }
    } else {
      alert('Please enter both a lobby code and your name.');
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Enter Lobby</h1>
      <input
        type="text"
        value={lobbyCode}
        className="m-5 p-2 text-black border border-gray-300 rounded"
        onChange={(e) => setLobbyCode(e.target.value)}
        placeholder="Lobby Code"
      />
      <input
        type="text"
        value={name}
        className="m-5 p-2 text-black border border-gray-300 rounded"
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <button
        onClick={enterLobby}
        className="m-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Enter
      </button>
    </div>
  );
};

export default Home;
