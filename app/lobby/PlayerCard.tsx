import Avatar, { genConfig } from 'react-nice-avatar';
import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface PlayerCardProps {
    name: string;
    isHost: boolean;
    isPlayer: boolean;
    avatarConfig?: any;
    onAvatarUpdate?: (config: any) => void;
}

export default function PlayerCard({ name, isHost, isPlayer, avatarConfig, onAvatarUpdate }: PlayerCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentConfig, setCurrentConfig] = useState(avatarConfig || genConfig(name));
    const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    // Update local config when prop changes
    useEffect(() => {
        if (avatarConfig) {
            setCurrentConfig(avatarConfig);
        }
    }, [avatarConfig]);
    
    const handleConfigChange = (newConfig: any) => {
        setCurrentConfig(newConfig);
        if (onAvatarUpdate) {
            onAvatarUpdate(newConfig);
        }
    };

    const randomizeAvatar = () => {
        const newConfig = genConfig();
        handleConfigChange(newConfig);
    };

    const handleEditClick = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPanelPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX
            });
        }
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isEditing && !(event.target as Element).closest('.avatar-config-panel')) {
                setIsEditing(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditing]);

    return (
        <>
            <div className={`relative flex flex-row overflow-hidden items-center bg-gray-200 h-[15svh] rounded-lg ${isHost ? 'border-4 border-primary' : ''}`}>
                <Avatar className={`w-24 h-24 md:w-40 md:h-40 absolute -translate-x-6 md:-translate-x-8 rounded-full`} {...currentConfig} />
                <div className={`flex w-20 md:w-36`}></div>
                <h2 className="text-left flex-1 font-bold text-sm md:text-lg truncate">{name}</h2>
                {(isHost || isPlayer) && (
                    <Badge className="absolute top-2 right-1 text-xs">
                        {isHost ? (isPlayer ? "You're Host" : "Host") : "You"}
                    </Badge>
                )}
                
                {isPlayer && onAvatarUpdate && (
                    <div className="absolute bottom-2 right-2 flex gap-2">
                        <Button
                            ref={buttonRef}
                            variant="outline"
                            size="sm"
                            onClick={handleEditClick}
                            className="p-2"
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {isEditing && isPlayer && onAvatarUpdate && createPortal(
                <div 
                    className="avatar-config-panel fixed bg-white p-4 rounded-lg shadow-lg z-50"
                    style={{
                        top: `${panelPosition.top}px`,
                        left: `${panelPosition.left}px`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Customize Avatar</h3>
                            <Button variant="outline" size="sm" onClick={randomizeAvatar}>
                                Randomize
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           
                            <div>
                                <label className="text-sm font-medium">Hair Style</label>
                                <select
                                    className="w-full mt-1 rounded-md border border-gray-300 p-2"
                                    value={currentConfig.hairStyle}
                                    onChange={(e) => handleConfigChange({ ...currentConfig, hairStyle: e.target.value })}
                                >
                                    <option value="normal">Normal</option>
                                    <option value="thick">Thick</option>
                                    <option value="mohawk">Mohawk</option>
                                    <option value="womanLong">Long</option>
                                    <option value="womanShort">Short</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Hair Color</label>
                                <div className="flex gap-2 mt-1">
                                    <input
                                        type="color"
                                        className="w-12 h-8 rounded-md border border-gray-300 p-1 cursor-pointer"
                                        value={currentConfig.hairColor}
                                        onChange={(e) => handleConfigChange({ ...currentConfig, hairColor: e.target.value })}
                                    />
                                    <select
                                        className="flex-1 rounded-md border border-gray-300 p-2"
                                        value={currentConfig.hairColor}
                                        onChange={(e) => handleConfigChange({ ...currentConfig, hairColor: e.target.value })}
                                    >
                                        <option value="#000000">Black</option>
                                        <option value="#4A3000">Dark Brown</option>
                                        <option value="#8B4513">Brown</option>
                                        <option value="#A0522D">Light Brown</option>
                                        <option value="#D2B48C">Tan</option>
                                        <option value="#FFD700">Blonde</option>
                                        <option value="#FFA500">Orange</option>
                                        <option value="#FF0000">Red</option>
                                        <option value="#800080">Purple</option>
                                        <option value="#0000FF">Blue</option>
                                        <option value="#008000">Green</option>
                                        <option value="#808080">Gray</option>
                                        <option value="#FFFFFF">White</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Eye Style</label>
                                <select
                                    className="w-full mt-1 rounded-md border border-gray-300 p-2"
                                    value={currentConfig.eyeStyle}
                                    onChange={(e) => handleConfigChange({ ...currentConfig, eyeStyle: e.target.value })}
                                >
                                    <option value="circle">Circle</option>
                                    <option value="oval">Oval</option>
                                    <option value="smile">Smile</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Glasses Style</label>
                                <select
                                    className="w-full mt-1 rounded-md border border-gray-300 p-2"
                                    value={currentConfig.glassesStyle}
                                    onChange={(e) => handleConfigChange({ ...currentConfig, glassesStyle: e.target.value })}
                                >
                                    <option value="none">None</option>
                                    <option value="round">Round</option>
                                    <option value="square">Square</option>
                                </select>
                            </div>
                        </div>
                        <Button onClick={() => setIsEditing(false)} className="w-full">
                            Done
                        </Button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
