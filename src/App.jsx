import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
    Search,
    Building2,
    MapPin,
    House,
    Earth,
    WavesHorizontal,
    Road,
    PlaneTakeoff,
    Store,
    Building,
    GraduationCap,
    Church,
    MountainSnow,
    Utensils,
    TreePine,
    Droplet,
    Sunset,
    Wind,
} from "lucide-react";
import {
    fetchWeather,
    getIcon,
    formatDate,
    fetchLocation,
    fetchAlerts,
    getBg,
} from "./fetch.js";
import "./styles.css";
import Bridge from "/src/icons/bridge.svg";
import Island from "/src/icons/island.svg";

function SearchBar({ setData, setAlerts, setLoading }) {
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
        <div className="w-full relative md:w-auto">
            <div className="border rounded-lg w-full md:w-70 flex">
                <Search className="m-1.5" />
                <input
                    type="text"
                    placeholder="Search"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full focus:outline-none"
                />
            </div>
            <div className="w-full absolute">
                <motion.ul
                    initial="hidden"
                    key={locations.length}
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, height: 0 },
                        visible: {
                            opacity: 1,
                            height: "auto",
                            transition: {
                                duration: 0.1 * locations.length,
                                staggerChildren: 0.1, // Staggers the entry of each child by 0.1s
                            },
                        },
                    }}
                    className="w-full backdrop-blur-md z-50 rounded-3xl md:w-70 mt-1 bg-gray-300 dark:bg-gray-500 overflow-hidden"
                >
                    {locations?.map((item) => (
                        <motion.li
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.5 },
                                },
                            }}
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
                                setLoading(true);
                                fetchWeather([item.lat, item.lon])
                                    .then(setData)
                                    .finally(() => setLoading(false));
                                fetchAlerts([item.lat, item.lon]).then(
                                    setAlerts,
                                );

                                // Clear search bar
                                setText("");
                                setLocations([]);
                            }}
                            className="flex my-2"
                        >
                            <>
                                {item.addresstype === "town" ||
                                item.addresstype === "village" ||
                                item.addresstype === "hamlet" ||
                                item.addresstype === "neighbourhood" ||
                                item.type === "house" ? (
                                    <House />
                                ) : item.addresstype === "city" ? (
                                    <Building2 />
                                ) : item.addresstype === "state" ||
                                  item.addresstype === "country" ? (
                                    <Earth />
                                ) : item.addresstype === "bay" ||
                                  item.addresstype === "sea" ||
                                  item.addresstype === "ocean" ? (
                                    <WavesHorizontal />
                                ) : item.addresstype === "road" ? (
                                    <Road />
                                ) : item.addresstype === "aeroway" ? (
                                    <PlaneTakeoff />
                                ) : item.addresstype === "bridge" ? (
                                    <img src={Bridge} />
                                ) : item.addresstype === "shop" ? (
                                    <Store />
                                ) : item.addresstype === "building" ? (
                                    <Building />
                                ) : item.type === "school" ? (
                                    <GraduationCap />
                                ) : item.type === "place_of_worship" ? (
                                    <Church />
                                ) : item.addresstype === "beach" ? (
                                    <img src={Island} />
                                ) : item.addresstype === "peak" ? (
                                    <MountainSnow />
                                ) : item.type === "restaurant" ||
                                  item.type === "pub" ? (
                                    <Utensils />
                                ) : item.addresstype === "nature_reserve" ? (
                                    <TreePine />
                                ) : (
                                    <MapPin />
                                )}
                            </>
                            <p className="ml-2 w-full cutoff">
                                {item.display_name}
                            </p>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </div>
    );
}

function TitleBar({ setData, setAlerts, setLoading }) {
    return (
        <div className="transparent w-full m-0 p-3 flex text-center justify-between items-center backdrop-blur-lg z-50 ">
            <SearchBar
                setData={setData}
                setAlerts={setAlerts}
                setLoading={setLoading}
            />
            <h1 className="text-center hidden md:inline">SamWeather</h1>
            <p className="hidden md:inline">Version 8.0 beta</p>
        </div>
    );
}

function Alerts({ alerts, className = "" }) {
    if (alerts?.length === 0 || alerts === null) {
        return;
    } else {
        return (
            <div>
                <div>
                    {alerts?.map((item, index) => (
                        <div
                            key={index}
                            className={
                                "transition-all p-3 rounded-3xl bg-red-200/60 mb-3 w-full backdrop-blur-xl " +
                                className
                            }
                        >
                            <h4 className="text-xl">{item.title}</h4>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

function DayOverview({ data, expanded, onShow }) {
    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <div
            onClick={onShow}
            className={
                "transition-all p-3 ml-3 mb-3 rounded-3xl backdrop-blur-lg " +
                (expanded
                    ? "bg-gray-300/60 dark:bg-gray-600/60"
                    : "bg-transparent")
            }
        >
            <div className={"flex md:justify-around items-center md:w-full"}>
                <h3>{data.name}</h3>
                <data.icon size="40" className="px-2" />
                <h4>
                    <span>{data.highTemp + "° / "}</span>
                    <span className="text-gray-500">{data.lowTemp}</span>
                </h4>
            </div>
            <div>
                {expanded ? (
                    <div className="hidden md:block">
                        <p>{data.detailedForecast}</p>
                        <div className="flex justify-evenly items-center">
                            <div className="flex items-center">
                                <Droplet />
                                <p className="p-2">
                                    {data.precipitation + "%"}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <Wind />
                                <p className="p-2">
                                    {data.wind.speed +
                                        " " +
                                        data.wind.direction}
                                </p>
                            </div>
                        </div>
                        <div />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

function DayForecast({ data, alerts, selectedDay, setSelectedDay }) {
    return (
        <div
            className={
                "flex w-full h-auto overflow-y-scroll md:w-1/2 md:h-full md:overflow-y-auto min-h-0 md:block"
            }
        >
            <Alerts className="hidden md:block" alerts={alerts} />
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
        <motion.li
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="flex justify-evenly items-center p-2"
        >
            <p>{formatDate(data.time)}</p>
            <data.icon size="25" className="" />
            <p>
                {infoShown === "Temperature"
                    ? `${data.temperature}°`
                    : infoShown === "Precipitation"
                      ? `${data.precipitation}%`
                      : infoShown === "Feels like"
                        ? `${data.feelsLike}°`
                        : infoShown === "Wind"
                          ? `${data.wind.speed} ${data.wind.direction}`
                          : infoShown === "Description"
                            ? `${data.shortForecast}`
                            : "N/A"}
            </p>
        </motion.li>
    );
}

function HourlyForecast({ data, dayIndex }) {
    const [infoShown, setInfoShown] = useState("Temperature");

    return (
        <div className="w-full flex-1 md:w-1/2 md:flex-none bg-gray-200/50 dark:bg-gray-900/50 md:ml-3 rounded-t-3xl md:rounded-tr-none pt-5 overflow-y-auto min-h-0 backdrop-blur-lg">
            <div className="block md:hidden px-4 mb-4">
                <p>{data?.days?.[dayIndex]?.detailedForecast}</p>

                <div className="flex justify-evenly items-center">
                    <div className="flex items-center">
                        <Droplet />
                        <p className="p-2">
                            {data?.days?.[dayIndex]?.precipitation + "%"}
                        </p>
                    </div>

                    <div className="flex items-center">
                        <Wind />
                        <p className="p-2">
                            {data?.days?.[dayIndex]?.wind.speed +
                                " " +
                                data?.days?.[dayIndex]?.wind.direction}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between align-middle">
                <h2 className="ml-7">Hourly</h2>
                <select
                    className="mr-5"
                    onChange={(e) => {
                        setInfoShown(e.target.value);
                    }}
                >
                    <option>Temperature</option>
                    <option>Feels like</option>
                    <option>Precipitation</option>
                    <option>Wind</option>
                    <option>Description</option>
                </select>
            </div>

            <motion.ul
                initial="hidden"
                key={dayIndex}
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1, // Staggers the entry of each child by 0.1s
                        },
                    },
                }}
            >
                {data?.hours?.[dayIndex]?.hours?.map((item) => (
                    <Hour key={item?.time} data={item} infoShown={infoShown} />
                ))}
            </motion.ul>
        </div>
    );
}

function Loading({ hidden }) {
    if (hidden) {
        return (
            <div className="fixed z-999 w-screen h-screen bg-transparent backdrop-blur-lg">
                <h1 className="flex items-center justify-center w-screen h-screen text-[50px]">
                    SamWeather
                </h1>
            </div>
        );
    }
    return;
}

export default function App() {
    const [data, setData] = useState(null);
    const [alerts, setAlerts] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeather([44, -70])
            .then(setData)
            .finally(() => setLoading(false));
        fetchAlerts([44, -70]).then(setAlerts);
    }, []);

    return (
        <div className="relative m-0 p-0 h-screen flex flex-col overflow-hidden text-black dark:text-white">
            <Loading hidden={loading}></Loading>
            <TitleBar
                setData={setData}
                setAlerts={setAlerts}
                setLoading={setLoading}
            ></TitleBar>

            <div className="absolute w-full h-full inset-0 -z-10">
                {data?.hours?.[0]?.hours?.[0] && data?.info?.astronomical && (
                    <img
                        className="absolute w-full h-full inset-0 -z-10 object-cover object-center overflow-hidden"
                        src={getBg(
                            data?.hours?.[0]?.hours?.[0]?.shortForecast,
                            data?.hours?.[0]?.hours?.[0]?.isDaytime,
                            data?.info?.astronomical,
                        )}
                    />
                )}
            </div>

            <div className="flex flex-col md:flex-row md:flex-1 min-h-0 h-full md:w-full pt-5 md:pl-3">
                <Alerts alerts={alerts} className="block md:hidden w-full" />
                <DayForecast
                    data={data}
                    alerts={alerts}
                    selectedDay={selectedDay}
                    setSelectedDay={setSelectedDay}
                />
                <HourlyForecast data={data} dayIndex={selectedDay} />
            </div>
        </div>
    );
}
