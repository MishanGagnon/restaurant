import {
    getActiveRooms
} from '../../../../lib/rooms';
  import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  console.log(id in getActiveRooms())
  return NextResponse.json({isActiveLobby : (id in getActiveRooms()) });
}
