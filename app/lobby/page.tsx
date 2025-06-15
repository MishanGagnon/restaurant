'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Home = () => {
  const router = useRouter();
  const [lobbyCode, setLobbyCode] = useState('');
  const [name, setName] = useState('');

  const enterLobby = async () => {
    if (lobbyCode && name) {
      try {
        const lobbyCodeUpper = lobbyCode.toUpperCase()
        let baseUrl = process.env.NEXT_PUBLIC_NEXT_DOMAIN
        const response = await fetch(`${baseUrl}/api/lobbyCheck/${lobbyCodeUpper}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.isActiveLobby) {
            router.push(`/lobby/${lobbyCodeUpper}?name=${encodeURIComponent(name)}`);
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
              Join a Lobby
            </h1>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="lobbyCode" className="block text-sm font-medium text-gray-700">
                  Lobby Code
                </label>
                <input
                  id="lobbyCode"
                  type="text"
                  value={lobbyCode}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  onChange={(e) => setLobbyCode(e.target.value)}
                  placeholder="Enter lobby code"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <button
                onClick={enterLobby}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Join Lobby
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
