import React, { FC, useEffect } from "react";
import { useMap,useMapEvents } from "react-leaflet";
import { setFlagsFromString } from "v8";

const MapController: FC<any> = ({lonLat, setLonLat,mapCenter}) => {
    const map: any = useMap();
    const flyToDuration: any = 1.5;
    useMapEvents({
        click(e) {
          setLonLat({latitude: e.latlng.lat, longitude : e.latlng.lng})
        },
      });
    // const flyTo = (location: any) => {
    //     map.flyTo(location, 15, {
    //         animate: true,
    //         duration: flyToDuration,
    //     });
    // };

    const flyToCenter = () => {
        map.flyTo([mapCenter.latitude || 0, mapCenter.longitude || 0], 13, {
            animate: true,
            duration: flyToDuration,
        });
    };

    useEffect(()=>{
        // some code that runs when component mounts / state changes
        flyToCenter()
    }, [mapCenter]);

    return null;
};

export { MapController };