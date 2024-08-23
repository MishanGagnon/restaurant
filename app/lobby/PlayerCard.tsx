import Avatar, { genConfig } from 'react-nice-avatar';
import React from 'react';

export interface PlayerCardProps {
    name: string,
    isHost: boolean
}

export default function PlayerCard({ name, isHost }: PlayerCardProps) {
    const config = genConfig(name);
    let avatarWidth = 28
    let translateLeft = 4
    let md = avatarWidth + 2320
    let spacer = avatarWidth - translateLeft
    return (
        <div className={`relative flex flex-row overflow-hidden items-center bg-gray-200 h-[15svh] rounded-lg ${isHost ? 'border-4 border-indigo-500' : ''}`}>
            <Avatar className={`w-20 h-20 md:w-40 md:h-40 absolute -translate-x-${translateLeft} md:-translate-x-8 rounded-full`} {...config} />
            <div className={`w-16 md:w-32`}></div>
            <h2 className="text-center flex-1 m-2 font-bold text-lg truncate">{name}</h2>
        </div>
    );
}
