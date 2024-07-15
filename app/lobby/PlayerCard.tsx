import Avatar, { genConfig } from 'react-nice-avatar'
export interface PlayerCardProps {
    name: string;
}

export default function PlayerCard({name}: PlayerCardProps) {
    const config = genConfig(name) 
    return <div className="m-1 flex flex-row bg-gray-200 p-3 rounded-lg items-center">
    <Avatar style={{ width: '8rem', height: '8rem' }} {...config} />
    <h1 className="text-center flex-1 m-2 font-bold text-lg">{name}</h1>
</div>

}
