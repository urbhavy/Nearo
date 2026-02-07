
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Mapping Nearo categories to OSM tags
const CATEGORY_TAGS = {
    'Food': '["amenity"~"restaurant|fast_food|food_court"]',
    'Cafe': '["amenity"="cafe"]',
    'Bakery': '["shop"="bakery"]',
    'Services': '["shop"~"laundry|dry_cleaning|shoes|locksmith"]',
    'Beauty': '["shop"~"hairdresser|beauty"]',
    'Gym': '["leisure"="fitness_centre"]',
    'Shopping': '["shop"~"convenience|supermarket|clothes|fashion"]',
    'Bookstore': '["shop"="books"]',
    'Stays': '["tourism"~"hotel|hostel|guest_house"]',
    'Essentials': '["shop"~"convenience|supermarket"]',
    'Pharmacy': '["amenity"="pharmacy"]'
};

export const fetchNearbyPlaces = async (lat, lng, radius = 2000) => {
    // Query all categories at once to avoid multiple requests
    // For simplicity, we'll just fetch major amenities around the user
    const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"restaurant|cafe|fast_food|pharmacy|bank|atm"](around:${radius},${lat},${lng});
      node["shop"~"supermarket|convenience|bakery|clothes|hairdresser"](around:${radius},${lat},${lng});
      node["leisure"~"fitness_centre"](around:${radius},${lat},${lng});
      node["tourism"~"hotel|hostel"](around:${radius},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `;

    try {
        const response = await fetch(OVERPASS_API_URL, {
            method: 'POST',
            body: query
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return processOverpassData(data.elements, lat, lng);
    } catch (error) {
        console.error("Error fetching places:", error);
        return [];
    }
};

const processOverpassData = (elements, userLat, userLng) => {
    return elements.map(element => {
        let category = 'Services';
        const tags = element.tags || {};

        if (tags.amenity === 'cafe') category = 'Cafe';
        else if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food') category = 'Food';
        else if (tags.shop === 'bakery') category = 'Bakery';
        else if (tags.amenity === 'pharmacy') category = 'Pharmacy';
        else if (tags.leisure === 'fitness_centre') category = 'Gym';
        else if (tags.shop === 'books') category = 'Bookstore';
        else if (tags.tourism === 'hotel' || tags.tourism === 'hostel') category = 'Stays';
        else if (tags.shop === 'convenience' || tags.shop === 'supermarket') category = 'Essentials';
        else if (tags.shop === 'hairdresser' || tags.shop === 'beauty') category = 'Beauty';
        else if (tags.shop) category = 'Shopping';

        // Estimate price based on tags or random as OSM doesn't have reliable price data
        const priceRange = `₹${100 + Math.floor(Math.random() * 400)} - ₹${500 + Math.floor(Math.random() * 500)}`;
        const rating = (3.5 + Math.random() * 1.5).toFixed(1);

        return {
            id: element.id,
            name: tags.name || tags.brand || 'Unnamed Place',
            category,
            lat: element.lat,
            lng: element.lon,
            priceRange, // Simulated as OSM lacks this
            rating,     // Simulated as OSM lacks this
            tags
        };
    }).filter(p => p.name !== 'Unnamed Place');
};
