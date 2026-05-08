import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
    fetchWeather,
    getIcon,
    getPrecipitation,
    getFeelsLike,
    formatDate,
    fetchLocation,
} from "./fetch.js";

function SearchBar({ setData }) {
    const [text, setText] = useState("");
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        if (text.trim() === "") return;

        const timer = setTimeout(() => {
            fetchLocation(text).then((data) => {
                console.log("Search results:", data);
                setLocations(data);
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [text]);

    return (
        <div>
            <div className="border rounded-lg w-50 flex">
                <Search className="m-1.5" />
                <input
                    type="text"
                    placeholder="Search"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <ul className="absolute backdrop-blur-md z-1 rounded-xl w-50">
                {locations?.map((item) => (
                    <li
                        key={item?.place_id}
                        onClick={() => {
                            // Log to console
                            console.log(
                                "fetching weather for",
                                item.name,
                                item.lat,
                                item.lon,
                            );

                            // Actually fetch and display new data
                            fetchWeather([item.lat, item.lon]).then(setData);

                            // Clear search bar
                            setText("");
                            setLocations([]);
                        }}
                    >
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TitleBar({ setData }) {
    return (
        <div className="bg-blue-300 w-full m-0 p-3 flex text-center justify-between items-center">
            <SearchBar setData={setData} />
            <h1 className="text-center">SamWeather</h1>
            <p>Version 8.0 beta</p>
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
            {data?.days?.map((item, index) => (
                <DayOverview
                    key={index}
                    data={item}
                    expanded={selectedDay === index}
                    onShow={() => {
                        setSelectedDay(index);
                    }}
                />
            ))}
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
            <TitleBar setData={setData}></TitleBar>

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
