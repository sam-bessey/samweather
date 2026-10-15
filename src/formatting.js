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

export function OLDgetFeelsLike(
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

export function getFeelsLike(
    temperature,
    humidity,
    wind,
    dontPrintInfo = false,
) {
    /*Get the feels like temperature
      If actual temperature is >=80, use the heat index
      If actual temperature is <=50, use the wind chill
      If it is between 50 and 80 degrees, just return actual temperature.
     */

    // use wind chill if <=50
    // see https://www.weather.gov/safety/cold-wind-chill-chart for more
    if (temperature <= 50) {
        return (
            35.74 +
            0.6215 * temperature -
            35.75 * wind ** 0.16 +
            0.4275 * temperature * wind ** 0.16
        );
    }
    // use heat index if >=80
    else if (temperature >= 80) {
        /*Heat index is a little more complicated.
    See https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml for more*/

        // Get simple heat index first
        let simple =
            0.5 *
            (temperature + 61.0 + (temperature - 68.0) * 1.2 + humidity * 0.04);

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
        if (humidity < 13 && 80 < temperature < 112) {
            const ADJUSTMENT =
                ((13 - humidity) / 4) *
                Math.sqrt((17 - Math.abs(temperature - 95)) / 17);
            HI -= ADJUSTMENT;

            if (!dontPrintInfo) {
                console.log("adj1 ", HI);
            }
        } else if (humidity > 85 && 80 < temperature < 87) {
            const ADJUSTMENT =
                ((humidity - 85) / 10) * ((87 - temperature) / 5);
            HI -= ADJUSTMENT;

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
