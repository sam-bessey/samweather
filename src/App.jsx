import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { fetchWeather, getIcon, formatDate, fetchLocation } from "./fetch.js";

function SearchBar({ setData }) {
    const [text, setText] = useState("");
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        if (text.trim() === "") {
            setLocations([]);
            return;
        }

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
            <div className="border rounded-lg w-70 flex">
                <Search className="m-1.5" />
                <input
                    type="text"
                    placeholder="Search"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full focus:outline-none"
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
                "transition-all p-3 rounded-xl " +
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
        <div className={"w-1/2 h-full overflow-y-auto min-h-0"}>
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

function Hour({ data, infoShown }) {
    return (
        <li className="flex justify-evenly items-center">
            <p>{formatDate(data.time)}</p>
            <img
                src={data.icon}
                alt=""
                className="w-11 h-11 -translate-y-2.5"
            />
            <p>
                {infoShown === "Temperature"
                    ? `${data.temperature}°`
                    : infoShown === "Precipitation"
                      ? `${data.precipitation}%`
                      : infoShown === "Feels like"
                        ? `${data.feelsLike}°`
                        : "N/A"}
            </p>
        </li>
    );
}

function HourlyForecast({ data, dayIndex }) {
    const [infoShown, setInfoShown] = useState("Temperature");

    return (
        <div className="w-1/2 h-full bg-gray-200 ml-3 rounded-tl-xl pt-5 overflow-y-auto min-h-0">
            <div className="flex justify-between align-middle">
                <h2 className="ml-7">Hourly</h2>
                <select
                    className="mr-5"
                    onChange={(e) => {
                        setInfoShown(e.target.value);
                        console.log(e.target.value);
                    }}
                >
                    <option>Temperature</option>
                    <option>Feels like</option>
                    <option>Precipitation</option>
                </select>
            </div>
            <ul>
                {data?.hours?.[dayIndex]?.hours?.map((item) => (
                    <Hour key={item?.time} data={item} infoShown={infoShown} />
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
        <div className="m-0 p-0 h-screen flex flex-col">
            <TitleBar setData={setData}></TitleBar>

            <div className="flex flex-1 min-h-0 w-full pt-5 pl-3">
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
