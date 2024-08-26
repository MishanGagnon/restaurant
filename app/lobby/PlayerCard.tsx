import Avatar, { genConfig } from 'react-nice-avatar';
import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface PlayerCardProps {
    name: string,
    isHost: boolean,
    isPlayer: boolean,
}

export default function PlayerCard({ name, isHost,isPlayer }: PlayerCardProps) {
    const config = genConfig(name);
    let avatarWidth = 28
    let translateLeft = 4
    let md = avatarWidth + 2320
    let spacer = avatarWidth - translateLeft
    return (
        <div className={`relative flex flex-row overflow-hidden items-center bg-gray-200 h-[15svh] rounded-lg ${isHost ? 'border-4 border-primary' : ''}`}>
            <Avatar className={`w-24 h-24 md:w-40 md:h-40 absolute -translate-x-6 md:-translate-x-8 rounded-full`} {...config} />
            <div className={`flex w-20 md:w-36`}></div>
            <h2 className="text-left flex-1 font-bold text-sm md:text-lg truncate">{name}</h2>
            {(isHost || isPlayer) && (
            <Badge className="absolute top-2 right-1 text-xs">
                {isHost ? (isPlayer ? "You're Host" : "Host") : "You"}
            </Badge>
            )}

        </div>
    );
}
