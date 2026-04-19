import { useState, useEffect } from "react";

function TitleBar() {
    return (
        <div className="bg-blue-300 w-full m-0 p-3">
            <p className="text-center">SamWeather</p>
        </div>
    );
}

async function fetchWeather(coordinates) {
    // Coordinates: [lat, long]
    try {
        // Format the coordinates correctly. Api only support up to 4 decimal points
        const formattedCoordinates = [
            Number(coordinates[0]).toFixed(4),
            Number(coordinates[1]).toFixed(4),
        ];

        // create url to get the location info
        const infoUrl =
            "https://api.weather.gov/points/" +
            formattedCoordinates[0] +
            "," +
            formattedCoordinates[1];

        const infoResponse = await fetch(infoUrl);
        if (infoResponse.ok) {
            console.log("Info: OK");
            const infoData = await infoResponse.json();
            console.log("Info data:", infoData);

            // Get the actual data
            try {
                const mainResponse = await fetch(infoData.properties.forecast);
                if (mainResponse.ok) {
                    console.log("Main: OK");
                    const mainData = await mainResponse.json();
                    console.log("Main data:", mainData);

                    // Get the hourly data
                    try {
                        const hourlyResponse = await fetch(
                            infoData.properties.forecastHourly,
                        );
                        if (hourlyResponse.ok) {
                            console.log("Hourly: OK");
                            const hourlyData = await hourlyResponse.json();
                            console.log("Hourly data:", hourlyData);

                            // Return all the data
                            return [infoData, mainData, hourlyData];
                        }
                    } catch (error) {
                        console.error(
                            "Error gettting hourly weather data",
                            error,
                        );
                        return error;
                    }
                }
            } catch (error) {
                console.error("Error gettting main weather data", error);
                return error;
            }
        } else {
            console.error("LOCATION NOT FOUND");
            return "LOCATION NOT FOUND";
        }
    } catch (error) {
        console.error("Error getting weather data", error);
        return error;
    }
}

export default function App() {
    const [weatherData, setWeatherData] = useState("Loading...");

    useEffect(() => {
        fetchWeather([44, -70]).then(setWeatherData);
    }, []);

    return (
        <div className="m-0 p-0">
            <TitleBar></TitleBar>
            <p className="p-2">{JSON.stringify(weatherData[1].properties.periods[0].detailedForecast, null, 2)}</p>
        </div>
    );
}
