import { useState } from "react";

function TitleBar() {
    return (
        <div className="bg-blue-300 w-full m-0 p-3">
            <p className="text-center">SamWeather</p>
        </div>
    );
}

export default function App() {
    function fetchWeather(coordinates) {
        // Coordinates: [lat, long]
        try {
            const lat = Number(coordinates[0]).toFixed(4);
        } catch (error) {
            console.error("Error getting weather data", error);
        }
    }
    return (
        <div className="m-0 p-0">
            <TitleBar></TitleBar>
            <p className="p-2">text</p>
        </div>
    );
}
