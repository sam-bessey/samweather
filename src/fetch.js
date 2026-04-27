// Fetch weather data and return it (And some other stuff)
// Split to a separate file just to make things easier

function formatData(infoData, mainData, hourlyData) {
    ///////////////
    // MAIN DATA //
    ///////////////

    // Create array of days
    let formattedDays = [];

    // Put days in order
    for (let i = 0; i < mainData.properties.periods.length; i++) {
        const thisPeriod = mainData.properties.periods[i];

        if (thisPeriod.isDaytime) {
            formattedDays.push({
                name: thisPeriod.name,
                date: formatDate(thisPeriod.startTime, false),
                isDaytime: thisPeriod.isDaytime,
                temperature: thisPeriod.temperature,
                precipitation: thisPeriod.probabilityOfPrecipitation.value,
                wind: {
                    speed: thisPeriod.windSpeed,
                    direction: thisPeriod.windDirection,
                },
                shortForecast: thisPeriod.shortForecast,
                detailedForecast: thisPeriod.detailedForecast,
                icon: getIcon(thisPeriod.shortForecast, thisPeriod.isDaytime),
            });
        }
    }

    console.log("FormattedMain:", formattedDays);

    /////////////////
    // HOURLY DATA //
    /////////////////

    // Create array of hours
    let formattedHours = [];

    // Put hours in the array sorted by day
    for (let i = 0; i < hourlyData.properties.periods.length; i++) {
        const thisHour = hourlyData.properties.periods[i];

        // See if theres already been a day created that this hour is in
        for (let x = 0; i < formattedHours.length; x++) {
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
                icon: getIcon(
                    thisHour.shortForecast,
                    thisHour.isDaytime,
                    false,
                ),
                shortForecast: thisHour.shortForecast,
                feelsLike: getFeelsLike(
                    thisHour.temperature,
                    thisHour.relativeHumidity.value,
                    thisHour.windSpeed,
                    false,
                ),
            };
            if (
                formattedHours[x].date == formatDate(thisHour.startTime, false)
            ) {
                // This means they are the same day
                formattedHours[x].hours.push(formattedThisHour);
            } else {
                // This means its the first hour of a new day
                formattedHours.push({
                    date: formatDate(thisHour.startTime, false),
                    hours: [formattedThisHour],
                });
            }
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

export async function fetchWeather(coordinates) {
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

export function getIcon(description, isDaytime, getThemeInstead = false) {
    let bg_top;
    let bg;
    let icon;
    let whiteText = false;

    if (
        description.includes("Mostly Sunny") ||
        description.includes("Partly Cloudy") ||
        description.includes("Mostly Clear") ||
        description.includes("Mostly Cloudy") ||
        description.includes("Partly Sunny")
    ) {
        if (isDaytime) {
            bg_top = "#a6c0ed";
            bg = "linear-gradient(#a6c0ed, #7d9cd1)";
            icon = "http://openweathermap.org/img/wn/02d@2x.png";
        } else {
            bg_top = "#4e5c8a";
            bg = "linear-gradient(#4e5c8a, #434859)";
            icon = "http://openweathermap.org/img/wn/02n@2x.png";
            whiteText = true;
        }
    } else if (
        description.includes("Snow") ||
        description.includes("Blizzard") ||
        description.includes("Flurries") ||
        description.includes("Hail") ||
        description.includes("Sleet")
    ) {
        bg_top = "#d7d9de";
        bg = "linear-gradient(#d7d9de, #f0f0f0)";
        icon = "http://openweathermap.org/img/wn/13d@2x.png";
    } else if (
        description.includes("Thunder") ||
        description.includes("T-storm")
    ) {
        bg_top = "#434343";
        bg = "linear-gradient(#434343, #2e2d2d)";
        icon = "http://openweathermap.org/img/wn/11d@2x.png";
        whiteText = true;
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
                bg_top = "#95a6de";
                bg = "linear-gradient(#95a6de, #c0caeb)";
                icon = "http://openweathermap.org/img/wn/10d@2x.png";
            } else {
                bg_top = "#444a5e";
                bg = "linear-gradient(#444a5e, #293354)";
                icon = "http://openweathermap.org/img/wn/10n@2x.png";
                whiteText = true;
            }
        } else {
            if (isDaytime) {
                bg_top = "#9a9fb3";
                bg = "linear-gradient(#9a9fb3, #6c7080)";
            } else {
                bg_top = "#444a5e";
                bg = "linear-gradient(#444a5e, #131621)";
                whiteText = true;
            }
            icon = "http://openweathermap.org/img/wn/09d@2x.png";
        }
    } else if (description.includes("Cloud") || description.includes("Frost")) {
        if (isDaytime) {
            bg_top = "#a7a8ab";
            bg = "linear-gradient(#a7a8ab, #7e8087)";
        } else {
            bg_top = "#38383b";
            bg = "linear-gradient(#38383b, #767682)";
            whiteText = true;
        }
        icon = "http://openweathermap.org/img/wn/03d@2x.png";
    } else if (
        description.includes("Sunny") ||
        description == "Sunny" ||
        description.includes("Sun") ||
        description.includes("Clear")
    ) {
        if (isDaytime) {
            bg_top = "#a6c0ed";
            bg = "linear-gradient(#a6c0ed, #5e99ff)";
            icon = "http://openweathermap.org/img/wn/01d@2x.png";
        } else {
            bg_top = "#041d47";
            bg = "linear-gradient(#041d47, #06378a)";
            icon = "http://openweathermap.org/img/wn/01n@2x.png";
            whiteText = true;
        }
    } else if (
        description.includes("Mist") ||
        description.includes("Fog") ||
        description.includes("Haze") ||
        description.includes("Smoke")
    ) {
        if (isDaytime) {
            bg_top = "#adadad";
            bg = "linear-gradient(#adadad, #dbdbdb)";
        } else {
            bg_top = "#6e6e6e";
            bg = "linear-gradient(#6e6e6e, #363636)";
            whiteText = true;
        }
        icon = "http://openweathermap.org/img/wn/50d@2x.png";
    } else {
        console.log("Could not find correct icon for ", description);
    }

    if (getThemeInstead) {
        let textColor;
        if (whiteText) {
            textColor = "#ffffff";
        } else {
            textColor = "#000000";
        }

        // Update text color
        for (
            let i = 0;
            i < document.getElementsByClassName("text").length;
            i++
        ) {
            let element = document.getElementsByClassName("text")[i];
            element.style.color = textColor;
        }

        // Update top background color
        for (
            let i = 0;
            i < document.getElementsByClassName("bgTop").length;
            i++
        ) {
            let element = document.getElementsByClassName("bgTop")[i];
            element.style.backgroundColor = bg_top;
        }

        document.getElementById("body").style.backgroundImage = bg;
        if (mobile) {
            for (
                let i = 0;
                i < document.getElementsByClassName("titleBarMOBILE").length;
                i++
            ) {
                document.getElementsByClassName("titleBarMOBILE")[
                    i
                ].style.backgroundImage =
                    "linear-gradient(" +
                    bg_top +
                    ", " +
                    bg_top +
                    ", " +
                    bg_top +
                    ", " +
                    "rgba(0, 0, 0, 0)";
            }
        } else {
            document.getElementById("sectionsContainer").style.backgroundImage =
                bg;
            // document.getElementById("mainMenu").style.backgroundImage = bg;
        }
    } else {
        return icon;
    }
}

export function getPrecipitation(probability) {
    if (probability == null) {
        return "0%";
    } else {
        return `${probability}%`;
    }
}

export function formatDate(originalDate, returnTime) {
    // Formats a date to a more readable format. Including the time will return just the time
    if (returnTime) {
        return originalDate.split("T")[1].split("-")[0];
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
    var T = temperature;
    var RH = humidity;
    var feelsLike = 0;
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
            if (RH < 13 && 80 <= T <= 112) {
                ADJUSTMENT_low =
                    ((13 - RH) / 4) *
                    Math.sqrt(Math.abs(17 - Math.abs(T - 95.0)) / 17);
                HI = HI_rothfusz - ADJUSTMENT_low;
                if (!dontPrintInfo) {
                    console.log("0", HI);
                }
            } else if (RH > 85 && 80 <= T <= 87) {
                ADJUSTMENT_high = ((RH - 85) / 10) * ((87 - T) / 5);
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
        return `${Math.round(HI)}°`;
    }
}
