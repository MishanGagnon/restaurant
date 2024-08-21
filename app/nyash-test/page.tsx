'use client'

import React from 'react'
import restaurants from '@/components/restaurantTestData'
import Page from '@/components/RenderPage'
import io, { Socket } from 'socket.io-client';

let socket : Socket;

const page = () => {
    socket = io();
    return (
        <div>
            {/* <Page socket={socket} restaurants={restaurants} /> */}
        </div>
    )
}

export default page
