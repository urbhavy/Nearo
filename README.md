# Nearo - Find Nearby Budget Spots

Nearo is a location-based web application that helps users find budget-friendly places like cafes, food spots, bakeries, services, and more. It features an interactive map, category filtering, and routing directions.

## Features

-   **Interactive Map**: Visualizes your location and nearby places using Leaflet.
-   **Category Filtering**: Filter places by categories like Food, Cafe, Gym, etc.
-   **Routing & Directions**: Get turn-by-turn directions from your current location to any selected place.
-   **Responsive Design**: Works on desktop and mobile devices.
-   **Budget Focus**: specifically curated for budget-friendly options.

## Tech Stack

-   [React](https://reactjs.org/) - UI Library
-   [Vite](https://vitejs.dev/) - Build Tool
-   [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) - Maps
-   [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/) - Routing
-   [Tailwind CSS](https://tailwindcss.com/) - Styling
-   [Lucide React](https://lucide.dev/) - Icons

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/urbhavy/nearo.git
    cd nearo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in browser:**
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

## License

MIT
