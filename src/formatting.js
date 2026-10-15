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
    windSpeed,
    dontPrintInfo = false,
) {
    /*Get the feels like temperature
      If actual temperature is >=80, use the heat index
      If actual temperature is <=50, use the wind chill
      If it is between 50 and 80 degrees, just return actual temperature.
     */

    const wind = parseFloat(windSpeed);

    if (!dontPrintInfo) {
        console.log(
            "Temp ",
            temperature,
            "Humidity",
            humidity,
            "Wind speed",
            windSpeed,
        );
    }

    // use wind chill if <=50 and wind above 3mph
    // see https://www.weather.gov/safety/cold-wind-chill-chart for more
    if (temperature <= 50 && wind >= 3) {
        const WC = Math.round(
            35.74 +
                0.6215 * temperature -
                35.75 * wind ** 0.16 +
                0.4275 * temperature * wind ** 0.16,
        );

        if (!dontPrintInfo) {
            console.log("Wind chill ", WC);
        }

        return WC;
    }
    // use heat index if >=80
    else if (temperature >= 80) {
        /*Heat index is a little more complicated.
    See https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml for more*/

        // Get simple heat index first
        let simple =
            0.5 *
            (temperature +
                61.0 +
                (temperature - 68.0) * 1.2 +
                humidity * 0.094);

        if (!dontPrintInfo) {
            console.log("simple", simple);
        }

        // if simple is <80, than it is not a suitable temperature for the heat index.
        if (simple < 80) {
            return temperature;
        }

        // Now find the Rothfusz heat index
        let HI =
            -42.379 +
            2.04901523 * temperature +
            10.14333127 * humidity -
            0.22475541 * temperature * humidity -
            0.00683783 * temperature * temperature -
            0.05481717 * humidity * humidity +
            0.00122874 * temperature * temperature * humidity +
            0.00085282 * temperature * humidity * humidity -
            0.00000199 * temperature * temperature * humidity * humidity;

        if (!dontPrintInfo) {
            console.log("unadjusted rothfusz:", HI);
        }

        // adjust if necesary
        if (humidity < 13 && temperature > 80 && temperature < 112) {
            const ADJUSTMENT =
                ((13 - humidity) / 4) *
                Math.sqrt((17 - Math.abs(temperature - 95)) / 17);
            HI -= ADJUSTMENT;

            if (!dontPrintInfo) {
                console.log("adj1 ", HI);
            }
        } else if (humidity > 85 && temperature > 80 && temperature < 87) {
            const ADJUSTMENT =
                ((humidity - 85) / 10) * ((87 - temperature) / 5);
            HI += ADJUSTMENT;

            if (!dontPrintInfo) {
                console.log("adj2", HI);
            }
        }

        // make sure it is above original temperature. Otherwise return original temp.
        if (HI >= temperature) {
            return Math.round(HI);
        } else {
            return temperature;
        }
    }
    // if its not right temp for WC or HI, return normal temp
    else {
        return temperature;
    }
}

export function formatSuncalc(timestring) {
    // Formats from a suncalc string to a time that looks better
    if (!timestring) return "--";
    const time = timestring.toLocaleString().split(" ")[1];
    const ampm = timestring.toLocaleString().split(" ")[2];
    return time.split(":")[0] + ":" + time.split(":")[1] + " " + ampm;
}
