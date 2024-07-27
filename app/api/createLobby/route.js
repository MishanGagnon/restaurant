import {
    addLobby,
    removeLobby,
    activeRooms,

  } from '../../../lib/rooms';
  
  function generateRandomCapitalLetters(length = 4) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }
  
  export async function POST(req) {
    // Assuming you're using body parsing middleware
    const body = await req.json();
    console.log('Received:', body);
  
    let newLobbyCode = generateRandomCapitalLetters();
  
    while (newLobbyCode in activeRooms) {
      newLobbyCode = generateRandomCapitalLetters();
    }
  
    addLobby(newLobbyCode);
  
    return new Response(JSON.stringify({ message: 'Lobby added', lobbyCode: newLobbyCode }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  