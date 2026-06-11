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
