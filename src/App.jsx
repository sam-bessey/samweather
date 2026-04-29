import { useState, useEffect } from "react";
import {
    fetchWeather,
    getIcon,
    getPrecipitation,
    getFeelsLike,
} from "./fetch.js";

function TitleBar() {
    return (
        <div className="bg-blue-300 w-full m-0 p-3">
            <p className="text-center">SamWeather</p>
        </div>
    );
}

function DayOverview({ data, startExpanded = false }) {
    const [expanded, setExpanded] = useState(startExpanded);

    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className={
                "transition-all p-1 m-1 rounded-md " +
                (expanded ? "bg-gray-300" : "bg-transparent")
            }
        >
            <div className={"flex"}>
                <h3>{data.name}</h3>
                <img
                    src={getIcon(data.shortForecast, data.isDaytime)}
                    className="w-10 h-10 -translate-y-2"
                    title={data.shortForecast}
                />
            </div>
            <div>
                {expanded ? (
                    <>
                        <p>{data.detailedForecast}</p>
                        <p>{"Precipitation " + data.precipitation + "%"}</p>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

function DayForecast({ data }) {
    return (
        <div className={"w-1/2 h-full"}>
            <DayOverview
                data={data?.days?.[1]}
                startExpanded={true}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[2]}
                startExpanded={false}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[3]}
                startExpanded={false}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[0]}
                startExpanded={false}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[4]}
                startExpanded={false}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[5]}
                startExpanded={false}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[6]}
                startExpanded={false}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[7]}
                startExpanded={false}
            ></DayOverview>
        </div>
    );
}

function HourlyForecast({ data }) {
    return <div className="w-1/2 h-full">
        <ul>{
        data.hours.map((item) => <li></li>)
}</ul>
    </div>;
}

export default function App() {
    const [data, setWeatherData] = useState(null);

    useEffect(() => {
        fetchWeather([44, -70]).then(setWeatherData);
    }, []);

    return (
        <div className="m-0 p-0 h-screen">
            <TitleBar></TitleBar>

            <p className="p-2">{data?.days?.[0]?.detailedForecast}</p>
            <div className="inline-flex w-full">
                <DayForecast data={data} />
                <HourlyForecast data={data} />
            </div>
        </div>
    );
}
