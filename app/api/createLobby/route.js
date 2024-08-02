import {
    addLobby,
    removeLobby,
    activeRooms,
    getActiveRooms

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
    const settings = await req.json();
    console.log('Received:', settings);
  
    let newLobbyCode = generateRandomCapitalLetters();
  
    while (newLobbyCode in activeRooms) {
      newLobbyCode = generateRandomCapitalLetters();
    }
  
    addLobby({lobbyId :newLobbyCode, settings : settings});
    console.log(getActiveRooms(),'createLobby route')
  
    return new Response(JSON.stringify({ message: 'Lobby added', lobbyCode: newLobbyCode }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  