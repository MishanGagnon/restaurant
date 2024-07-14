'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Home = () => {
  const router = useRouter();
  const [lobbyCode, setLobbyCode] = useState('');
  const [name, setName] = useState('')

  const enterLobby = () => {
    router.push(`/lobby/${lobbyCode}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div>
      <h1>Enter Lobby</h1>
      <input
        type="text"
        value={lobbyCode}
        className='m-5 text-black'
        onChange={(e) => setLobbyCode(e.target.value)}
        placeholder="Lobby Code"
      />
      <input
        type="text"
        value={name}
        className='m-5 text-black'
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <button onClick={enterLobby}>Enter</button>
    </div>
  );
};

export default Home;
