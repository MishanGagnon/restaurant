// app/api/lobbies/route.js
import {
    addLobby,
    removeLobby,
    getActiveLobbies,
  } from '../../../lib/rooms';
  
  export async function POST(req) {
    const body = await req.json();
    const { lobbyId } = body;
    addLobby(lobbyId);
    return new Response(JSON.stringify({ message: 'Lobby added', lobbies: getActiveLobbies() }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  export async function DELETE(req) {
    const body = await req.json();
    const { lobbyId } = body;
    removeLobby(lobbyId);
    return new Response(JSON.stringify({ message: 'Lobby removed', lobbies: getActiveLobbies() }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  export async function GET() {
    return new Response(JSON.stringify({ lobbies: getActiveLobbies() }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  