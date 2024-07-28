import {
    getActiveRooms
} from '../../../../lib/rooms';
  import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;
  return NextResponse.json({isActiveLobby : (id in getActiveRooms()) });
}
