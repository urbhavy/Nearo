
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';
import L from 'leaflet';
import RoutingControl from './RoutingControl';

// Fix for default marker icons in Leaflet with Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to re-center map when location changes
const RecenterMap = ({ location }) => {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.flyTo([location.lat, location.lng], 15, {
                duration: 1.5
            });
        }
    }, [location, map]);
    return null;
};

// Component to re-center map when selected place changes
const SelectedPlaceRecenter = ({ place }) => {
    const map = useMap();
    useEffect(() => {
        if (place) {
            map.flyTo([place.lat, place.lng], 16, {
                duration: 1.5
            });
        }
    }, [place, map]);
    return null;
};

const MapComponent = ({ location, places = [], selectedPlace, onMarkerClick, directions, onGetDirections }) => {
    const defaultPosition = [12.9716, 77.5946]; // Bangalore default
    const position = location ? [location.lat, location.lng] : defaultPosition;

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner relative z-0">
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                {location && <RecenterMap location={location} />}
                {selectedPlace && <SelectedPlaceRecenter place={selectedPlace} />}
                {directions && <RoutingControl start={directions.start} end={directions.end} />}

                {/* User Location Marker */}
                {location && (
                    <>
                        <Marker position={[location.lat, location.lng]}>
                            <Popup>
                                <div className="text-center font-semibold">You are here</div>
                            </Popup>
                        </Marker>
                        <Circle
                            center={[location.lat, location.lng]}
                            radius={2000} // 2km radius hint
                            pathOptions={{ color: '#0F9D58', fillColor: '#0F9D58', fillOpacity: 0.1 }}
                        />
                    </>
                )}

                {/* Place Markers */}
                {places.map((place) => (
                    <Marker
                        key={place.id}
                        position={[place.lat, place.lng]}
                        eventHandlers={{
                            click: () => onMarkerClick && onMarkerClick(place),
                        }}
                    >
                        <Popup>
                            <div className="min-w-[150px]">
                                <div className="text-sm font-semibold mb-1">{place.name}</div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-xs text-gray-500">{place.category}</div>
                                    <div className="text-xs font-bold text-[#0F9D58]">{place.priceRange}</div>
                                </div>
                                <button
                                    onClick={() => onGetDirections && onGetDirections(place)}
                                    className="w-full py-1.5 text-xs font-medium text-white bg-[#0F9D58] hover:bg-[#0b8a4b] rounded-md transition-colors flex items-center justify-center gap-1"
                                >
                                    Get Directions
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

MapComponent.propTypes = {
    location: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }),
    places: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lat: PropTypes.number,
        lng: PropTypes.number,
        name: PropTypes.string,
    })),
    onMarkerClick: PropTypes.func,
    selectedPlace: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }),
};

export default MapComponent;
