
export const CATEGORIES = [
    'All',
    'Food',
    'Cafe',
    'Bakery',
    'Services',
    'Beauty',
    'Gym',
    'Shopping',
    'Bookstore',
    'Stays',
    'Essentials',
    'Pharmacy'
];

export const generatePlaces = (center, count = 24) => {
    if (!center) return [];

    const places = [];

    // Specific names for categories to make them feel real
    const placeNames = {
        Food: ["Annapurna Tiffin", "Spicy Bites", "Curry Corner", "Mama's Kitchen", "Roti Ghar"],
        Cafe: ["Brew & Bean", "Corner Cafe", "Chai Point", "Lazy Mocha", "Coffee House"],
        Bakery: ["Sweet Crumbs", "Daily Fresh", "Cake Walk", "Bread Basket"],
        Services: ["Quick Fix", "Laundry Express", "Shoe Shine", "Key Makers"],
        Beauty: ["Glamour Zone", "Style Cuts", "Glow Salon", "Nail Studio"],
        Gym: ["Fit Life", "Muscle Gym", "Yoga Space", "Active Arena"],
        Shopping: ["Budget Mart", "Fashion Street", "Local Trends", "Daily Needs"],
        Bookstore: ["Reads & Pages", "Old Book Shop", "Knowledge Corner"],
        Stays: ["Green Dorm", "City Inn", "Backpacker Hostel", "Budget Stay"],
        Essentials: ["General Store", "Milk Depot", "Veggie Market"],
        Pharmacy: ["Health Plus", "City Meds", "Wellness Chemist"]
    };

    for (let i = 0; i < count; i++) {
        // Random offset within ~3km
        const latOffset = (Math.random() - 0.5) * 0.04;
        const lngOffset = (Math.random() - 0.5) * 0.04;

        // Pick a random category (excluding 'All')
        const category = CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1];
        const names = placeNames[category] || ["Place"];
        const name = names[Math.floor(Math.random() * names.length)];

        places.push({
            id: i,
            name: `${name} ${Math.floor(Math.random() * 10) + 1}`, // Add number to make unique
            category: category,
            rating: (3 + Math.random() * 2).toFixed(1),
            priceRange: `₹${50 + Math.floor(Math.random() * 100)} - ₹${200 + Math.floor(Math.random() * 300)}`,
            lat: center.lat + latOffset,
            lng: center.lng + lngOffset,
            distance: null // To be calculated
        });
    }
    return places;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); // km
};
