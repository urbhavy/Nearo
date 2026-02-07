import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const RoutingControl = ({ start, end }) => {
    const map = useMap();

    useEffect(() => {
        if (!start || !end) return;

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start.lat, start.lng),
                L.latLng(end.lat, end.lng)
            ],
            routeWhileDragging: true,
            showAlternatives: true,
            fitSelectedRoutes: true,
            show: true, // Show turn-by-turn instructions by default
            collapsible: true, // Allow user to collapse it
            // Customizing the line style
            lineOptions: {
                styles: [{ color: '#6FA1EC', weight: 4 }]
            },
            // Custom icons for start/end if needed, but default is usually okay or handled by markers
            createMarker: function () { return null; } // We already have markers, so suppress default routing markers
        }).addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [map, start, end]);

    return null;
};

export default RoutingControl;
