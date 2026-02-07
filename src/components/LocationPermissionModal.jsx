
import React from 'react';
import { MapPin, Shield } from 'lucide-react';
import Button from './ui/Button';
import { useLocation } from '../context/LocationContext';

const LocationPermissionModal = () => {
    const { permissionStatus, requestLocation, setMockLocation } = useLocation();

    if (permissionStatus === 'granted') return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="bg-[#E8F5E9] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin size={32} className="text-[#0F9D58]" />
                </div>

                <h2 className="text-2xl font-bold mb-3 text-gray-900">Find budget gems near you</h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Nearo uses your location to show budget places near you. This helps us find the best deals on food, shops, and stays in your immediate area.
                </p>

                <div className="space-y-3">
                    <Button
                        variant="primary"
                        className="w-full text-lg py-3"
                        onClick={requestLocation}
                    >
                        <MapPin size={20} />
                        Allow Location
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full text-gray-600 font-medium"
                        onClick={setMockLocation}
                    >
                        Continue without location
                    </Button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Shield size={12} />
                    <span>Your privacy is protected. We only use location for discovery.</span>
                </div>
            </div>
        </div>
    );
};

export default LocationPermissionModal;
