
import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Search, Filter, List, X, ArrowUpDown, Coffee, Utensils, ShoppingBag, Bed, Book, Dumbbell, Scissors, Zap, Pill, Package, Croissant, Briefcase } from 'lucide-react';
import LocationPermissionModal from './components/LocationPermissionModal';
import { useLocation } from './context/LocationContext';
import MapComponent from './components/MapComponent';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import Card from './components/ui/Card';
import { generatePlaces, calculateDistance, CATEGORIES } from './data/mockPlaces';
import { fetchNearbyPlaces } from './data/overpassService';

const getCategorySticker = (category) => {
  const iconProps = { size: 48, className: "text-white drop-shadow-md" };

  switch (category) {
    case 'Cafe': return { icon: <Coffee {...iconProps} />, color: 'bg-amber-500' };
    case 'Food': return { icon: <Utensils {...iconProps} />, color: 'bg-orange-500' };
    case 'Bakery': return { icon: <Croissant {...iconProps} />, color: 'bg-yellow-600' };
    case 'Services': return { icon: <Briefcase {...iconProps} />, color: 'bg-blue-500' };
    case 'Beauty': return { icon: <Scissors {...iconProps} />, color: 'bg-pink-500' };
    case 'Gym': return { icon: <Dumbbell {...iconProps} />, color: 'bg-red-500' };
    case 'Shopping': return { icon: <ShoppingBag {...iconProps} />, color: 'bg-indigo-500' };
    case 'Bookstore': return { icon: <Book {...iconProps} />, color: 'bg-emerald-600' };
    case 'Stays': return { icon: <Bed {...iconProps} />, color: 'bg-purple-500' };
    case 'Essentials':
    case 'Pharmacy': return { icon: <Pill {...iconProps} />, color: 'bg-teal-500' };
    default: return { icon: <MapPin {...iconProps} />, color: 'bg-gray-400' };
  }
};

function App() {
  const { location, loading } = useLocation();
  // ... (rest of state)

  // ... (inside render loop)

  const [allPlaces, setAllPlaces] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [directions, setDirections] = useState(null);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('nearest'); // 'nearest', 'price', 'rating'

  // Generate places when location is available
  useEffect(() => {
    if (location) {
      setLoadingPlaces(true);
      fetchNearbyPlaces(location.lat, location.lng)
        .then(places => {
          const withDistance = places.map(p => ({
            ...p,
            distance: parseFloat(calculateDistance(location.lat, location.lng, p.lat, p.lng))
          }));
          setAllPlaces(withDistance);
        })
        .finally(() => setLoadingPlaces(false));
    }
  }, [location]);

  // Filter and Sort Logic
  const filteredPlaces = useMemo(() => {
    let result = allPlaces.filter(p => {
      // Parse price range (e.g. "₹50 - ₹150") to get average or min/max
      const prices = p.priceRange.replace(/₹/g, '').split(' - ').map(Number);
      const avgPrice = (prices[0] + prices[1]) / 2;
      const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
      return categoryMatch && avgPrice <= maxPrice;
    });

    if (sortBy === 'nearest') {
      result.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'price') {
      result.sort((a, b) => {
        const priceA = parseInt(a.priceRange.replace(/[^0-9]/g, ''));
        const priceB = parseInt(b.priceRange.replace(/[^0-9]/g, ''));
        return priceA - priceB;
      });
    } else if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    return result;
  }, [allPlaces, activeCategory, maxPrice, sortBy]);

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setShowMapMobile(true);
  };

  const handleGetDirections = (place) => {
    if (location && place) {
      setDirections({
        start: { lat: location.lat, lng: location.lng },
        end: { lat: place.lat, lng: place.lng }
      });
      setShowMapMobile(true);
    } else {
      alert("Please enable location services to get directions.");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <LocationPermissionModal />

      {/* HEADER */}
      <header className="bg-white shadow-sm z-20 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="45" cy="45" r="40" fill="#0F9D58" />
            <rect x="70" y="70" width="12" height="35" rx="6" transform="rotate(-45 70 70)" fill="#0F9D58" />
            <path d="M45 25C36.7 25 30 31.7 30 40C30 51.25 45 68 45 68C45 68 60 51.25 60 40C60 31.7 53.3 25 45 25Z" fill="white" />
            <circle cx="45" cy="40" r="5" fill="#0F9D58" />
          </svg>
          <span className="font-bold text-2xl tracking-tight text-[#0F9D58]">Nearo</span>
        </div>

        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <Input
            icon={Search}
            placeholder="Search budget food, stays or services..."
          />
        </div>

        <div className="flex items-center gap-3">
          {location && (
            <div className="hidden md:flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              <MapPin size={14} className="mr-1" />
              {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
            </div>
          )}
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </header>

      {/* CATEGORY TABS */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 overflow-x-auto whitespace-nowrap shrink-0">
        <div className="flex gap-2 container mx-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat
                ? 'bg-[#0F9D58] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      {location ? (
        <div className="flex-1 flex overflow-hidden relative">
          {/* LEFT PANEL: LISTINGS */}
          <div className={`w-full md:w-[400px] lg:w-[450px] bg-white flex flex-col border-r border-gray-200 absolute md:relative z-10 h-full transition-transform duration-300 ${showMapMobile ? 'translate-y-full md:translate-y-0' : 'translate-y-0'}`}>
            {/* Filter & Count Header */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="font-bold text-lg">Nearby Budget Spots</h2>
                <p className="text-xs text-gray-500">{filteredPlaces.length} places found within 2km</p>
              </div>
              <Button
                variant={showFilters ? 'primary' : 'ghost'}
                className={showFilters ? '' : 'text-[#0F9D58]'}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filter
              </Button>
            </div>

            {/* Filter Panel (Expandable) */}
            {showFilters && (
              <div className="p-4 bg-gray-50 border-b border-gray-100 animate-in slide-in-from-top-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Max Average Price: ₹{maxPrice}</label>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0F9D58] mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Sort By</label>
                    <div className="flex gap-2 mt-2">
                      {['nearest', 'price', 'rating'].map(sort => (
                        <button
                          key={sort}
                          onClick={() => setSortBy(sort)}
                          className={`px-3 py-1 text-xs rounded-full border ${sortBy === sort
                            ? 'bg-[#E8F5E9] border-[#0F9D58] text-[#0F9D58] font-bold'
                            : 'bg-white border-gray-200 text-gray-600'
                            }`}
                        >
                          {sort.charAt(0).toUpperCase() + sort.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingPlaces ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9D58] mb-2"></div>
                  <p>Finding budget gems...</p>
                </div>
              ) : filteredPlaces.length > 0 ? filteredPlaces.map(place => {
                const sticker = getCategorySticker(place.category);
                return (
                  <Card
                    key={place.id}
                    hover
                    className={`flex gap-4 p-3 group border-2 ${selectedPlace?.id === place.id ? 'border-[#0F9D58] bg-[#F1F8E9]' : 'border-transparent'}`}
                    onClick={() => handlePlaceClick(place)}
                  >
                    <div className={`w-24 h-24 rounded-2xl shrink-0 overflow-hidden relative flex items-center justify-center shadow-inner ${sticker.color} transition-transform duration-500 group-hover:scale-105`}>
                      {sticker.icon}
                      {place.rating >= 4.5 && (
                        <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm text-yellow-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          Top
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{place.name}</h3>
                          <div className="flex items-center text-xs font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                            <span className="text-yellow-500 mr-1">★</span>
                            {place.rating}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{place.category} • Budget</p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-sm font-bold text-[#0F9D58]">{place.priceRange}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGetDirections(place);
                            }}
                            className="p-1.5 rounded-full hover:bg-green-50 text-[#0F9D58] transition-colors"
                            title="Get Directions"
                          >
                            <ArrowUpDown size={16} className="rotate-45" />
                          </button>
                          <div className="flex items-center text-xs text-gray-400">
                            <MapPin size={12} className="mr-0.5" />
                            {place.distance} km
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              }) : (
                <div className="text-center py-10 text-gray-400">
                  <p>No places found matching your filters.</p>
                  <Button variant="ghost" className="mt-2 text-[#0F9D58]" onClick={() => setMaxPrice(2000)}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: MAP */}
          <div className="flex-1 h-full relative">
            <MapComponent
              location={location}
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              directions={directions}
              onMarkerClick={(place) => {
                setSelectedPlace(place);
              }}
              onGetDirections={handleGetDirections}
            />

            {/* Mobile Floating Button */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden z-[1000]">
              <Button
                variant="primary"
                className="shadow-lg rounded-full px-6"
                onClick={() => setShowMapMobile(!showMapMobile)}
              >
                {showMapMobile ? <List size={20} /> : <MapPin size={20} />}
                {showMapMobile ? 'Show List' : 'Show Map'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* LOADING / EMPTY STATE */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F9D58] mb-4"></div>
              <p>Locating you...</p>
            </>
          ) : (
            <p>Waiting for location permission...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
