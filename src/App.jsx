import { useState, useEffect } from "react";
import {
    fetchWeather,
    getIcon,
    getPrecipitation,
    getFeelsLike,
    formatDate,
} from "./fetch.js";

function SearchBar() {
    return (
        <div className="border rounded-lg w-50">
            <input type="text"/>
        </div>
    )
}

function TitleBar() {
    return (
        <div className="bg-blue-300 w-full m-0 p-3">
            <SearchBar/>
            <h1 className="text-center">SamWeather</h1>
        </div>
    );
}

function DayOverview({ data, expanded, onShow }) {
    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <div
            onClick={onShow}
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
                <h4>
                    <span>{data.highTemp + "° / "}</span>
                    <span className="text-gray-500">{data.lowTemp}</span>
                </h4>
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

function DayForecast({ data, selectedDay, setSelectedDay }) {
    return (
        <div className={"w-1/2 h-full"}>
            <DayOverview
                data={data?.days?.[0]}
                expanded={selectedDay === 0}
                onShow={() => {
                    setSelectedDay(0);
                }}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[1]}
                expanded={selectedDay === 1}
                onShow={() => {
                    setSelectedDay(1);
                }}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[2]}
                expanded={selectedDay === 2}
                onShow={() => {
                    setSelectedDay(2);
                }}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[3]}
                expanded={selectedDay === 3}
                onShow={() => {
                    setSelectedDay(3);
                }}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[4]}
                expanded={selectedDay === 4}
                onShow={() => {
                    setSelectedDay(4);
                }}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[5]}
                expanded={selectedDay === 5}
                onShow={() => {
                    setSelectedDay(5);
                }}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[6]}
                expanded={selectedDay === 6}
                onShow={() => {
                    setSelectedDay(6);
                }}
            ></DayOverview>
            <DayOverview
                data={data?.days?.[7]}
                expanded={selectedDay === 7}
                onShow={() => {
                    setSelectedDay(7);
                }}
            ></DayOverview>
        </div>
    );
}

function Hour({ data }) {
    // Hour
    // Data should be the data for JUST THIS HOUR
    // Will return a li for that hour

    return (
        <li className="flex justify-evenly">
            <p>{formatDate(data.time)}</p>
            <p>{data.temperature + "°"}</p>
            <img src={data.icon} className="w-11 h-11 -translate-y-2.5" />
        </li>
    );
}

function HourlyForecast({ data, dayIndex }) {
    return (
        <div className="w-1/2 h-full">
            <ul>
                {data?.hours?.[dayIndex]?.hours?.map((item) => (
                    <Hour key={item?.time} data={item} />
                ))}
            </ul>
        </div>
    );
}

export default function App() {
    const [data, setData] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0);

    useEffect(() => {
        fetchWeather([44, -70]).then(setData);
    }, []);

    return (
        <div className="m-0 p-0 h-screen">
            <TitleBar></TitleBar>

            <div className="inline-flex w-full">
                <DayForecast
                    data={data}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                />
                <HourlyForecast data={data} dayIndex={selectedDay} />
            </div>
        </div>
    );
}
