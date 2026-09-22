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
    // TODO: Find better pictures for thunder
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

    // For some things, time of day doesn't matter.
    // like snow
    if (
        description.includes("Snow") ||
        description.includes("Blizzard") ||
        description.includes("Flurries") ||
        description.includes("Hail") ||
        description.includes("Sleet")
    ) {
        setDarkMode(false); // snow is light
        return "/samweather/images/snow.JPEG";
    }
    // and thunder
    else if (
        description.includes("Thunder") ||
        description.includes("T-storm")
    ) {
        setDarkMode(true); // thunder is dark
        return "/samweather/images/cloudyNightT.JPEG";
    }

    // Do sunset backgrounds next
    // If there aren't any good pictures, it will go on to find a day/night background
    if (isSunset) {
        // Set dark mode to false
        setDarkMode(false);

        // If there are clouds
        if (
            description.includes("Mostly Sunny") ||
            description.includes("Partly Cloudy") ||
            description.includes("Mostly Cloudy") ||
            description.includes("Partly Sunny")
        ) {
            return "/samweather/images/partlyCloudySunset.JPEG";
        }

        // If it is clear
        else if (
            description.includes("Sunny") ||
            description.includes("Mostly Sunny") ||
            description.includes("Mostly Clear") ||
            description.includes("Sunny") ||
            description.includes("Sun")
        ) {
            return "/samweather/images/clearSunset.JPEG";
        }
    }

    // Next do day pictures
    if (isDaytime) {
        // Set dark mode to false
        setDarkMode(false);
        // If it is mostly cloudy
        if (description.includes("Mostly Cloudy")) {
            return "/samweather/images/mostlyCloudyDay.JPEG";
        }

        // If it's only partly cloudy
        else if (
            description.includes("Mostly Sunny") ||
            description.includes("Partly Cloudy") ||
            description.includes("Mostly Clear") ||
            description.includes("Partly Sunny")
        ) {
            return "/samweather/images/partlyCloudyDay.JPEG";
        }

        // rainy
        else if (
            description.includes("Showers") ||
            description.includes("Rain") ||
            description.includes("Drizzle")
        ) {
            return "/samweather/images/oceanDay.JPEG";
        }

        // cloudy
        else if (
            description.includes("Cloud") ||
            description.includes("Frost")
        ) {
            return "/samweather/images/cloudyDay.JPEG";
        }

        // sunny
        else if (
            description.includes("Sunny") ||
            description === "Sunny" ||
            description.includes("Sun") ||
            description.includes("Clear")
        ) {
            return "/samweather/images/clearDayT.JPEG";
        }

        // mist, smoke, fog, etc.
        else if (
            description.includes("Mist") ||
            description.includes("Fog") ||
            description.includes("Haze") ||
            description.includes("Smoke")
        ) {
            return "/samweather/images/cloudyDayT.JPEG";
        }

        // if nothing can be found?
        else {
            console.log("Could not find background for ", description);
        }
    } else {
        // Set dark mode to true because it's night
        setDarkMode(true);

        // Now do night pictures

        // If it's only a little cloudy
        if (
            description.includes("Mostly Sunny") ||
            description.includes("Partly Cloudy") ||
            description.includes("Mostly Clear") ||
            description.includes("Mostly Cloudy") ||
            description.includes("Partly Sunny")
        ) {
            return "/samweather/images/clearNight.JPEG";
        }

        // If it's clear
        if (
            description.includes("Sunny") ||
            description === "Sunny" ||
            description.includes("Sun") ||
            description.includes("Clear")
        ) {
            return "/samweather/images/secondClearNight.JPEG";
        }

        // And everyting else...
        else {
            return "/samweather/images/cloudyNightT.JPEG";
        }
    }
}

function setDarkMode(darkMode) {
    // setDarkMode
    // darkMode: true or false, if it should be dark mode.
    const root = window.document.documentElement;
    console.log("setting dark mode to ", darkMode);
    if (darkMode) {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}
