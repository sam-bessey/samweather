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
                ? "/samweather/images/mostlyCloudyDay.JPEG"
                : (bg = "/samweather/images/partlyCloudyDay.JPEG");
        } else {
            bg_top = "#4e5c8a";
            bg = "/samweather/images/secondClearNight.JPEG";
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
        if (isSunset) {
            bg = "/samweather/images/clearSunset.JPEG";
            bg_top = "#a6c0ed";
        } else {
            if (isDaytime) {
                bg_top = "#a6c0ed";

                bg = "/samweather/images/clearDayT.JPEG";
            } else {
                bg_top = "#041d47";
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
    console.log("setting");
    if (darkMode) {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}
