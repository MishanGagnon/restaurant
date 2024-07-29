import React, { FC, useEffect } from "react";
import { useMap } from "react-leaflet";

const MapController: FC<any> = ({lonLat}) => {
    const map: any = useMap();
    const flyToDuration: any = 1.5;

    const flyTo = (location: any) => {
        map.flyTo(location, 15, {
            animate: true,
            duration: flyToDuration,
        });
    };

    const flyToCenter = () => {
        map.flyTo([lonLat.latitude || 0, lonLat.longitude || 0], 13, {
            animate: true,
            duration: flyToDuration,
        });
    };

    useEffect(()=>{
        // some code that runs when component mounts / state changes
        flyToCenter()
    }, [lonLat]);

    return null;
};

export { MapController };