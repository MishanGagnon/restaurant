'use client'

import React, { useEffect, useState } from 'react';
import data from '../../components/restaurantTestData';
import TestPage from '../../components/RenderPage';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

const TestCard = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);  // Mark component as mounted

        if (isMounted) {
            // Any code that requires `window` or `HTMLElement`
            socket = io();
        }

        // Cleanup function
        return () => {
            setIsMounted(false); // Mark component as unmounted
        };
    }, [isMounted]);

    if (!isMounted) {
        return null; // Return null or a loading indicator if not mounted
    }

    return (
        <div>
            <TestPage socket={socket} restaurants={data} lobbyId='YUHH' playerId='asdgy12370123bqwd' />
        </div>
    );
}

export default TestCard;
