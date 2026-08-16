import partcloudIcon from "./icons/partcloud.svg";
import {
    Cloud,
    CloudRain,
    CloudLightning,
    CloudSun,
    CloudFog,
    Snowflake,
    Sun,
    CloudMoon,
    CloudMoonRain,
    CloudSunRain,
    Moon,
} from "lucide-react";
import { useEffect, useState } from "react";
import * as SunCalc from "suncalc";
import { getIcon } from "./themes";
import { formatDate, getFeelsLike, formatSuncalc } from "./formatting";

// Fetch weather data and return it (And some other stuff)
// Split to a separate file just to make things easier

async function formatData(infoData, mainData, hourlyData) {
    /////////////////
    // HOURLY DATA //
    /////////////////

    // Create array of hours
    let formattedHours = [];

    // Put hours in the array sorted by day
    for (let i = 0; i < hourlyData.properties.periods.length; i++) {
        const thisHour = hourlyData.properties.periods[i];

        // Format the hour
        const formattedThisHour = {
            time: formatDate(thisHour.startTime, true),
            isDaytime: thisHour.isDaytime,
            temperature: thisHour.temperature,
            precipitation: thisHour.probabilityOfPrecipitation.value,
            dewPoint: thisHour.dewpoint.value,
            humidity: thisHour.relativeHumidity.value,
            wind: {
                speed: thisHour.windSpeed,
                direction: thisHour.windDirection,
            },
            icon: getIcon(thisHour.shortForecast, thisHour.isDaytime, false),
            shortForecast: thisHour.shortForecast,
            feelsLike: getFeelsLike(
                thisHour.temperature,
                thisHour.relativeHumidity.value,
                thisHour.windSpeed,
                true,
            ),
        };

        // If its the first hour, add it to a new day:
        if (formattedHours.length === 0) {
            formattedHours.push({
                date: formatDate(thisHour.startTime, false),
                hours: [formattedThisHour],
            });
        } else {
            // See if theres already been a day created that this hour is in
            let foundDay = false;
            for (let x = 0; x < formattedHours.length; x++) {
                if (
                    formattedHours[x].date ==
                    formatDate(thisHour.startTime, false)
                ) {
                    // This means they are the same day
                    formattedHours[x].hours.push(formattedThisHour);
                    foundDay = true;
                    break;
                }
            }
            if (!foundDay) {
                // This means its the first hour of a new day
                formattedHours.push({
                    date: formatDate(thisHour.startTime, false),
                    hours: [formattedThisHour],
                });
            }
        }
    }

    ///////////////
    // MAIN DATA //
    ///////////////

    // Create array of days
    let formattedDays = [];

    for (let i = 0; i < mainData.properties.periods.length; i++) {
        const thisPeriod = mainData.properties.periods[i];
        const dayDate = formatDate(thisPeriod.startTime, false);

        const matchingHourGroup = formattedHours.find(
            (day) => day.date === dayDate,
        );

        let high = -Infinity;
        let low = Infinity;

        if (matchingHourGroup) {
            for (const hour of matchingHourGroup.hours) {
                const thisTemp = hour.temperature;
                if (thisTemp > high) high = thisTemp;
                if (thisTemp < low) low = thisTemp;
            }
        }

        if (thisPeriod.isDaytime || i === 0) {
            formattedDays.push({
                name: thisPeriod.name,
                date: dayDate,
                precipitation: thisPeriod.probabilityOfPrecipitation.value,
                wind: {
                    speed: thisPeriod.windSpeed,
                    direction: thisPeriod.windDirection,
                },
                shortForecast: thisPeriod.shortForecast,
                detailedForecast: thisPeriod.detailedForecast,
                icon: getIcon(thisPeriod.shortForecast, thisPeriod.isDaytime),
                highTemp: high,
                lowTemp: low,
            });
        }
    }

    ////////////////
    // FINAL DATA //
    ////////////////

    // Create final formatted JSON data
    const formattedData = {
        info: {
            office: infoData.properties.cwa,
            forecastURL: infoData.properties.forecast,
            forecastHourlyURL: infoData.properties.forecastHourly,
            city: infoData.properties.relativeLocation.properties.city,
            state: infoData.properties.relativeLocation.properties.state,

            location: {
                // NWS has latitude and longitude in other order for some reason
                lat: infoData.geometry.coordinates[1],
                long: infoData.geometry.coordinates[0],
            },
        },
        days: formattedDays,
        hours: formattedHours,
        astronomical: await calcAstro(
            infoData.geometry.coordinates[1],
            infoData.geometry.coordinates[0],
            new Date(),
        ),
    };

    console.log("FORMATTED DATA FiNAL", formattedData);
    return formattedData;
}

export async function fetchAlerts(coordinates) {
    // Coordinates: [lat, long]
    try {
        // Fetch the data
        return fetch(
            "https://api.weather.gov/alerts/active?point=" +
                Number(coordinates[0]).toFixed(4) +
                "," +
                Number(coordinates[1]).toFixed(4),
        ).then(async (response) => {
            const data = await response.json();

            console.log(data);
            // Format the data
            let formattedAlerts = [];
            for (let i = 0; i < data.features.length; i++) {
                const thisAlert = data.features[i].properties;
                formattedAlerts.push({
                    title: thisAlert.event,
                    description: thisAlert.description.replaceAll("* ", ""),
                    instructions: thisAlert.instruction,
                    severity: thisAlert.severity,
                    urgency: thisAlert.urgency,
                    headline: thisAlert.headline,
                });
            }

            // Return the data
            console.log("FORMATTED ALERTS", formattedAlerts);
            return formattedAlerts;
        });
    } catch (error) {
        console.error("Error getting alerts", error);
    }
}

export async function calcAstro(lat, long, time = new Date()) {
    // calculate astronomical data via suncalc.
    // lat: latitude of location (obvious)
    // long: longitude
    // time: date and time to calculate for

    ///////////////////////////////
    // ASTRONOMICAL (sun / moon) //
    ///////////////////////////////
    const times = SunCalc.getTimes(time, lat, long);
    const position = SunCalc.getPosition(time, lat, long);

    console.log(`Sunrise time: ${times.sunrise.toLocaleString()}`);

    //Moon
    const moonTimes = SunCalc.getMoonTimes(time, lat, long);
    console.log("MOONRISE", moonTimes);
    const moonIllumination = SunCalc.getMoonIllumination(time);
    const phaseNames = [
        "New Moon",
        "Waxing Crescent",
        "First Quarter",
        "Waxing Gibbous",
        "Full Moon",
        "Waning Gibbous",
        "Last Quarter",
        "Waning Crescent",
    ];
    const { phase } = SunCalc.getMoonIllumination(time);
    const phaseName = phaseNames[Math.round(phase * 8) % 8];
    const moonPosition = SunCalc.getMoonPosition(time, lat, long);

    const formattedAstronomical = {
        sun: {
            sunrise: formatSuncalc(times.sunrise),
            sunset: formatSuncalc(times.sunset),
            noon: formatSuncalc(times.solarNoon),
            goldenHour: formatSuncalc(times.goldenHour),
            morningGoldenHour: formatSuncalc(times.goldenHourEnd),
            altitude: Math.round(position.altitude),
        },
        moon: {
            moonrise: formatSuncalc(moonTimes.rise),
            moonset: formatSuncalc(moonTimes.set),
            phase: phaseName,
            distance: Math.round(moonPosition.distance),
            altitude: Math.round(moonPosition.altitude),
            illumination: Math.round(moonIllumination.fraction * 100) + "%",
        },
    };
    return formattedAstronomical;
}

export async function fetchWeather(coordinates) {
    // Coordinates: [lat, long]
    try {
        // Format the coordinates correctly. Api only supports up to 4 decimal points
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
                            return formatData(infoData, mainData, hourlyData);
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

export async function fetchLocation(address) {
    try {
        const trimmedAddress = address.trim();

        if (trimmedAddress === "") {
            return [];
        }

        const url =
            "https://nominatim.openstreetmap.org/search?q=" +
            encodeURIComponent(trimmedAddress) +
            "&format=jsonv2";

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Location lookup failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Location search data for", trimmedAddress, data);
        return data;
    } catch (error) {
        console.error(
            "Error getting location data for",
            address,
            "Error was:",
            error,
        );
        return [];
    }
}
