'use client'

import React from 'react'
import data from '../../components/restaurantTestData'
import TestPage from '../../components/RenderPage'
import io, { Socket } from 'socket.io-client';

let socket : Socket;

const page = () => {
    socket = io();
    return (
        <div>
            <TestPage socket={socket} restaurants={data} lobbyId='YUHH' playerId='asdgy12370123bqwd' />
        </div>
    )
}

export default page
