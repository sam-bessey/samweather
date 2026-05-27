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
} from "./fetch.js";
import "./styles.css";
import Bridge from "/src/icons/bridge.svg";
import Island from "/src/icons/island.svg";
import Treetest from "/src/icons/treetest.JPEG";

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
                className="absolute backdrop-blur-md z-50 rounded-xl w-70 mt-1 bg-gray-300 overflow-hidden"
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
                            fetchAlerts([item.lat, item.lon]).then(setAlerts);

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
    );
}

function TitleBar({ setData, setAlerts, setLoading }) {
    return (
        <div className="transparent w-full m-0 p-3 flex text-center justify-between items-center backdrop-blur-lg z-50">
            <SearchBar
                setData={setData}
                setAlerts={setAlerts}
                setLoading={setLoading}
            />
            <h1 className="text-center">SamWeather</h1>
            <p>Version 8.0 beta</p>
        </div>
    );
}

function Alerts({ alerts }) {
    if (alerts?.length === 0 || alerts === null) {
        return;
    } else {
        return (
            <div>
                <div>
                    {alerts?.map((item, index) => (
                        <div
                            key={index}
                            className="transition-all p-3 rounded-xl bg-red-200/60 mb-3 w-full backdrop-blur-xl"
                        >
                            <h4 className="text-xl">{item.title}</h4>
                            <p>{item.description + item.instructions}</p>
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
                "transition-all p-3 mb-3 rounded-xl backdrop-blur-lg " +
                (expanded ? "bg-gray-300/60" : "bg-transparent")
            }
        >
            <div className={"flex justify-around items-center"}>
                <h3>{data.name}</h3>
                <data.icon size="40" className="px-2" />
                <h4>
                    <span>{data.highTemp + "° / "}</span>
                    <span className="text-gray-500">{data.lowTemp}</span>
                </h4>
            </div>
            <div>
                {expanded ? (
                    <>
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
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}

function DayForecast({ data, alerts, selectedDay, setSelectedDay }) {
    return (
        <div className={"w-1/2 h-full overflow-y-auto min-h-0"}>
            <Alerts alerts={alerts} />
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
        <div className="w-1/2 h-full bg-gray-200/50 ml-3 rounded-tl-xl pt-5 overflow-y-auto min-h-0 backdrop-blur-lg">
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
        <div className="relative m-0 p-0 h-screen flex flex-col overflow-hidden">
            <Loading hidden={loading}></Loading>
            <TitleBar
                setData={setData}
                setAlerts={setAlerts}
                setLoading={setLoading}
            ></TitleBar>

            <div className="absolute w-full h-full bg-fixed inset-0 -z-10">
                <img src={Treetest} />
            </div>

            <div className="flex flex-1 min-h-0 w-full pt-5 pl-3">
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
