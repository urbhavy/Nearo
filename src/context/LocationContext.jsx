
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt', 'granted', 'denied'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const requestLocation = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                setPermissionStatus('granted');
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setPermissionStatus('denied');
                setLoading(false);
            }
        );
    };

    // Mock location for "Continue without location"
    const setMockLocation = () => {
        // Default to a known location (e.g., Indiranagar, Bangalore as per design)
        setLocation({ lat: 12.9716, lng: 77.5946 });
        setPermissionStatus('granted'); // Treat as granted for UI purposes
    };

    return (
        <LocationContext.Provider value={{ location, permissionStatus, requestLocation, setMockLocation, loading, error }}>
            {children}
        </LocationContext.Provider>
    );
};

LocationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useLocation = () => useContext(LocationContext);
