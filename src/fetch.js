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

// Fetch weather data and return it (And some other stuff)
// Split to a separate file just to make things easier

function formatData(infoData, mainData, hourlyData) {
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
            astronomical: {
                sunrise: infoData.properties.astronomicalData.sunrise,
                sunset: infoData.properties.astronomicalData.sunset,
                civilTwilightBegin:
                    infoData.properties.astronomicalData.civilTwilightBegin,
                civilTwilightEnd:
                    infoData.properties.astronomicalData.civilTwilightEnd,
                nauticalTwilightBegin:
                    infoData.properties.astronomicalData.nauticalTwilightBegin,
                nauticalTwilightEnd:
                    infoData.properties.astronomicalData.nauticalTwilightEnd,
                astronomicalTwilightBegin:
                    infoData.properties.astronomicalData
                        .astronomicalTwilightBegin,
                astronomicalTwilightEnd:
                    infoData.properties.astronomicalData
                        .astronomicalTwilightEnd,
            },
        },
        days: formattedDays,
        hours: formattedHours,
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
                    description: thisAlert.description,
                    instructions: thisAlert.instruction,
                    severity: thisAlert.severity,
                    urgency: thisAlert.urgency,
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

export function getIcon(description, isDaytime) {
    // Gets the icon for the current weather conditions
    // description: the shortForecast for the hour you would like to use
    // isDaytime: true or false, whether its daytime
    let icon;

    if (
        description.includes("Mostly Sunny") ||
        description.includes("Partly Cloudy") ||
        description.includes("Mostly Clear") ||
        description.includes("Mostly Cloudy") ||
        description.includes("Partly Sunny")
    ) {
        if (isDaytime) {
            icon = CloudSun;
        } else {
            icon = CloudMoon;
        }
    } else if (
        description.includes("Snow") ||
        description.includes("Blizzard") ||
        description.includes("Flurries") ||
        description.includes("Hail") ||
        description.includes("Sleet")
    ) {
        icon = Snowflake;
    } else if (
        description.includes("Thunder") ||
        description.includes("T-storm")
    ) {
        icon = CloudLightning;
    } else if (
        description.includes("Showers") ||
        description.includes("Rain") ||
        description.includes("Drizzle")
    ) {
        if (
            description.includes("Sun") ||
            description.includes("Partly Cloudy") ||
            description.includes("Mostly Sunny")
        ) {
            if (isDaytime) {
                icon = CloudSunRain;
            } else {
                icon = CloudMoonRain;
            }
        } else {
            icon = CloudRain;
        }
    } else if (description.includes("Cloud") || description.includes("Frost")) {
        icon = Cloud;
    } else if (
        description.includes("Sunny") ||
        description === "Sunny" ||
        description.includes("Sun") ||
        description.includes("Clear")
    ) {
        if (isDaytime) {
            icon = Sun;
        } else {
            icon = Moon;
        }
    } else if (
        description.includes("Mist") ||
        description.includes("Fog") ||
        description.includes("Haze") ||
        description.includes("Smoke")
    ) {
        icon = CloudFog;
    } else {
        console.log("Could not find correct icon for ", description);
    }
    return icon;
}
export function getBg(description, isDaytime, astronomical) {
    // Gets the background for the current weather conditions
    // description: the shortForecast for the hour you would like to use
    // isDaytime: true or false, whether its daytime
    // astronomical: the astronomical data for sunset and stuff. Only needed if getBgInstead is true.
    // UPDATE BG comment means I need a new picture for it
    let bg_top;
    let bg;
    let darkMode = false;

    // Check if data is loaded
    if (!astronomical?.sunset) return "";

    // Format dates and calculate sunset
    const now = new Date();
    const sunset = new Date(astronomical.sunset);
    const isSunset = Math.abs(sunset - now) <= 30 * 60 * 1000;
    console.log("Is sunset", isSunset);

    if (
        description.includes("Mostly Sunny") ||
        description.includes("Partly Cloudy") ||
        description.includes("Mostly Clear") ||
        description.includes("Mostly Cloudy") ||
        description.includes("Partly Sunny")
    ) {
        if (isDaytime) {
            bg_top = "#a6c0ed";
            bg = description.includes("Mostly Cloudy")
                ? "/samweather/images/mostlyCloudyDayT.JPEG"
                : "/samweather/images/partlyCloudyDay.JPEG";
        } else {
            bg_top = "#4e5c8a";
            bg = "/samweather/images/clearNight.JPEG";
            darkMode = true;
        }
    } else if (
        description.includes("Snow") ||
        description.includes("Blizzard") ||
        description.includes("Flurries") ||
        description.includes("Hail") ||
        description.includes("Sleet")
    ) {
        bg_top = "#d7d9de";
        bg = "/samweather/images/snow.JPEG";
    } else if (
        description.includes("Thunder") ||
        description.includes("T-storm")
    ) {
        bg_top = "#434343";
        // UPDATE BG
        bg = "/samweather/images/cloudyNightT.JPEG";
        darkMode = true;
    } else if (
        description.includes("Showers") ||
        description.includes("Rain") ||
        description.includes("Drizzle")
    ) {
        if (isDaytime) {
            bg_top = "#95a6de";
            bg = "/samweather/images/oceanDay.JPEG";
        } else {
            bg_top = "#444a5e";
            bg = "/samweather/images/cloudyNightT.JPEG";
            darkMode = true;
        }
    } else if (description.includes("Cloud") || description.includes("Frost")) {
        if (isDaytime) {
            bg_top = "#a7a8ab";
            bg = "/samweather/images/cloudyDay.JPEG";
        } else {
            bg_top = "#38383b";
            bg = "/samweather/images/cloudyNightT.JPEG";
            darkMode = true;
        }
    } else if (
        description.includes("Sunny") ||
        description === "Sunny" ||
        description.includes("Sun") ||
        description.includes("Clear")
    ) {
        if (isDaytime) {
            bg_top = "#a6c0ed";
            bg = "/samweather/images/clearDayT.JPEG";
        } else {
            bg_top = "#041d47";
            if (isSunset) {
                bg = "/samweather/images/clearSunset.JPEG";
            } else {
                bg = "/samweather/images/clearNight.JPEG";
                darkMode = true;
            }
        }
    } else if (
        description.includes("Mist") ||
        description.includes("Fog") ||
        description.includes("Haze") ||
        description.includes("Smoke")
    ) {
        if (isDaytime) {
            bg_top = "#adadad";
            bg = "/samweather/images/cloudyDayT.JPEG";
        } else {
            bg_top = "#6e6e6e";
            bg = "/samweather/images/cloudyNightT.JPEG";
            darkMode = true;
        }
    } else {
        console.log("Could not find correct background for ", description);
    }

    if (darkMode) {
        setDarkMode(true);
    } else {
        setDarkMode(false);
    }
    console.log("BG", bg);
    console.log("dark mode", darkMode);
    return bg;
}

function setDarkMode(darkMode) {
    // setDarkMode
    // darkMode: true or false, if it should be dark mode.
    const root = window.document.documentElement;
    console.log("setting")
    if (darkMode) {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}

export function formatDate(originalDate, returnTime) {
    // Formats a date to a more readable format. Including the time will return just the time
    // originalDate: The original non-formatted date
    // returnTime: If true will return JUST THE FORMATTED TIME. If false will return JUST THE FORMATTED DATE

    if (returnTime) {
        let hour = originalDate.split("T")[1].split("-")[0].split(":")[0];

        // Check if its 12:00
        if (Number(hour) === 12) {
            return "12pm";
        } else if (Number(hour) === 0) {
            return "12am";
        }

        // Do am/pm stuff
        if (hour > 12) {
            return `${Number(hour) - 12}pm`;
        } else {
            return `${Number(hour)}am`;
        }
    } else {
        return originalDate.split("T")[0];
    }
}

export function getFeelsLike(
    temperature,
    humidity,
    wind,
    dontPrintInfo = false,
) {
    const T = temperature;
    const RH = humidity;
    let feelsLike = 0;
    if (!dontPrintInfo) {
        console.log("t", T, "rh", RH);
    }

    if (T <= 50 && wind >= 3) {
        feelsLike = `${Math.round(35.74 + 0.6215 * T - 35.75 * wind ** 0.16 + 0.4275 * T * wind ** 0.16)}°`;
        return feelsLike;
    } else {
        // Heat index
        let simple = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + RH * 0.094);
        if (!dontPrintInfo) {
            console.log("simple", simple);
        }
        let HI;
        let HI_rothfusz;
        if (simple < 80) {
            HI = (simple + T) / 2;
        } else {
            HI_rothfusz =
                -42.379 +
                2.04901523 * T +
                10.14333127 * RH -
                0.22475541 * T * RH -
                0.00683783 * T * T -
                0.05481717 * RH * RH +
                0.00122874 * T * T * RH +
                0.00085282 * T * RH * RH -
                0.00000199 * T * T * RH * RH;
            HI = HI_rothfusz;
        }
        // Adjust temp
        if (HI >= 80) {
            if (RH < 13 && T >= 80 && T <= 112) {
                let ADJUSTMENT_low =
                    ((13 - RH) / 4) *
                    Math.sqrt(Math.abs(17 - Math.abs(T - 95.0)) / 17);
                HI = HI_rothfusz - ADJUSTMENT_low;
                if (!dontPrintInfo) {
                    console.log("0", HI);
                }
            } else if (RH > 85 && T >= 80 && T <= 87) {
                let ADJUSTMENT_high = ((RH - 85) / 10) * ((87 - T) / 5);
                HI = HI_rothfusz + ADJUSTMENT_high;
                if (!dontPrintInfo) {
                    console.log("1", HI);
                    console.log("rothfuz", HI_rothfusz);
                }
            } else {
                HI = HI_rothfusz;
                if (!dontPrintInfo) {
                    console.log("2", HI);
                }
            }
        }
        if (!dontPrintInfo) {
            console.log("Returning feels like:", HI);
        }
        return Math.round(HI);
    }
}
