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
    Sunrise,
    Sparkles,
    Wind,
    Clock,
    Target,
    CalendarDays,
    Sun,
    Thermometer,
    ThermometerSun,
    ThermometerSnowflake,
    ChevronRight,
    ChevronUp,
    TriangleAlert,
    Moon,
} from "lucide-react";
import * as SunCalc from "suncalc";
import { fetchWeather, fetchAlerts, fetchLocation } from "./fetch.js";
import "./styles.css";
import Bridge from "/src/icons/bridge.svg";
import Island from "/src/icons/island.svg";
import { getBg } from "./themes.js";
import { formatDate } from "./formatting.js";

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
        <div className="w-full relative">
            <div className="border rounded-lg w-full flex">
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
                    className="w-full backdrop-blur-md z-50 rounded-3xl mt-1 bg-gray-300 dark:bg-gray-500 overflow-hidden"
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
        <div className="transparent w-full m-0 p-3 flex text-center justify-between items-center backdrop-blur-lg z-50 fixed">
            <SearchBar
                setData={setData}
                setAlerts={setAlerts}
                setLoading={setLoading}
            />
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
                        <Card
                            key={index}
                            title={item.title}
                            titleIcon={<TriangleAlert />}
                            cardClass="whitespace-pre-wrap"
                            allowExpand={true}
                            expandedContent={
                                <p>
                                    {item.description +
                                        "\n\n" +
                                        item.instructions}
                                </p>
                            }
                        >
                            <p className="cutoff">{item.headline}</p>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
}

function SunCard({ data }) {
    return (
        <Card
            title="Sun"
            titleIcon={<Sun />}
            cardClass="flex space-evenly w-full"
        >
            <div className="flex flex-col w-full">
                <div className="flex space-evenly w-full">
                    <Detail
                        title="Sunrise"
                        titleIcon={<Sunrise />}
                        text={data?.astronomical?.sun?.sunrise}
                    />
                    <Detail
                        title="Sunset"
                        titleIcon={<Sunset />}
                        text={data?.astronomical?.sun?.sunset}
                    />
                </div>
                <div className="flex space-evenly w-full">
                    <Detail
                        title="Solar Noon"
                        titleIcon={<Sun />}
                        text={data?.astronomical?.sun?.noon}
                    />
                    <Detail
                        title="Golden Hour"
                        titleIcon={<Sparkles />}
                        text={data?.astronomical?.sun?.goldenHour}
                    />
                </div>
            </div>
        </Card>
    );
}

function MoonCard({ data }) {
    return (
        <Card
            title="Moon"
            titleIcon={<Moon />}
            cardClass="flex space-evenly w-full"
        >
            <div className="flex flex-col w-full">
                <div className="flex space-evenly w-full">
                    <Detail
                        title="Sunrise"
                        titleIcon={<Sunrise />}
                        text={data?.astronomical?.sun?.sunrise}
                    />
                    <Detail
                        title="Sunset"
                        titleIcon={<Sunset />}
                        text={data?.astronomical?.sun?.sunset}
                    />
                </div>
                <div className="flex space-evenly w-full">
                    <Detail
                        title="Solar Noon"
                        titleIcon={<Sun />}
                        text={data?.astronomical?.sun?.noon}
                    />
                    <Detail
                        title="Golden Hour"
                        titleIcon={<Sparkles />}
                        text={data?.astronomical?.sun?.goldenHour}
                    />
                </div>
            </div>
        </Card>
    );
}

function Day({ data, dayIndex, Dayicon }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <li className="flex flex-col mb-1.5">
            <div
                className="flex flex-row justify-between items-center px-3 pb-1"
                onClick={() => setExpanded((prev) => !prev)}
            >
                <p>{data?.days?.[dayIndex]?.name}</p>
                <Dayicon size="25" />
                <p>
                    <span>{data?.days?.[dayIndex]?.highTemp + "° / "}</span>
                    <span className="text-gray-500">
                        {data?.days?.[dayIndex]?.lowTemp}
                    </span>
                </p>
            </div>
            <div>
                {expanded ? (
                    <div className="bg-gray-500/40">
                        <p className="text-xl pt-3 pl-3 pb-1">Hourly</p>
                        <HourlyForecast data={data} dayIndex={dayIndex} />
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </li>
    );
}

function DailyForecast({ data }) {
    return (
        <Card
            title="Daily"
            titleIcon={<CalendarDays />}
            className={"flex w-full h-auto overflow-y-scroll min-h-0"}
            cardClass="p-0!"
        >
            <ul className="p-0!">
                {data?.days?.map((item, index) => (
                    <Day
                        data={data}
                        dayIndex={index}
                        key={index}
                        Dayicon={item.icon}
                    />
                ))}
            </ul>
        </Card>
    );
}

function Hour({ data, infoShown }) {
    return (
        <li className="flex flex-col justify-evenly items-center p-2">
            <p>{formatDate(data.time)}</p>
            <data.icon size="25" className="m-3" />
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
        </li>
    );
}

function HourlyForecast({ data, dayIndex }) {
    const [infoShown, setInfoShown] = useState("Temperature");

    return (
        <div className="w-full flex-1 overflow-y-auto min-h-0">
            <select
                className="mr-5 flex justify-between align-middle absolute ml-2"
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

            <ul className="flex flex-row mt-5">
                {data?.hours?.[dayIndex]?.hours?.map((item) => (
                    <Hour key={item?.time} data={item} infoShown={infoShown} />
                ))}
            </ul>
        </div>
    );
}

function Now({ data }) {
    const firstHour = data?.hours?.[0]?.hours?.[0];
    // Find icon to show for feels like
    const temp = firstHour?.temperature;
    const feels = firstHour?.feelsLike;
    let flIcon;
    if (temp > feels) {
        flIcon = <ThermometerSnowflake />;
    } else if (temp < feels) {
        flIcon = <ThermometerSun />;
    } else {
        flIcon = <Thermometer />;
    }
    return (
        <Card
            title="Now"
            titleIcon={<Target />}
            allowExpand={true}
            expandedContent={
                <div className="flex space-evenly w-full">
                    <Detail
                        title="Feels like"
                        titleIcon={flIcon}
                        text={feels + "°"}
                    />{" "}
                    <Detail
                        title="Wind"
                        titleIcon={<Wind />}
                        text={
                            firstHour?.wind?.speed +
                            " " +
                            firstHour?.wind?.direction
                        }
                    />
                </div>
            }
        >
            <h1>{firstHour?.temperature + "°"}</h1>
            <p>{data?.days?.[0]?.detailedForecast}</p>
        </Card>
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

function Detail({ title, titleIcon, text }) {
    /* Use this for weather details, probably within card
    title: What it is. For example, "Sunrise"
    titleIcon: The icon to be shown next to it
    text: The text that is the actual data. */
    return (
        <div className="flex-1 flex flex-row items-center">
            <div className="scale-110">{titleIcon}</div>
            <div className="ml-4">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {title}
                </p>
                <p>{text}</p>
            </div>
        </div>
    );
}

function Card({
    title,
    titleIcon,
    cardClass = "",
    allowExpand = false,
    expandedContent = "",
    children,
}) {
    /* Use this for cards in the UI
    title: Title of the card. For example, "Hourly"
    titleIcon: Icon for the title bar next to the card.
    cardClass: Optional, use to add a class to the content of the card itself (not card title). Consider adding ! to the end of the tailwind className if needed.
    allowExpand: Should there be more content in the card that can be expanded?
    expandedContent: If allowing expand, what content should be shown when card is expanded?
    */
    const [expanded, setExpanded] = useState(false);
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                },
            }}
            className="flex flex-col bg-gray-200/50 dark:bg-gray-900/50 w-auto h-auto overflow-y-scroll rounded-3xl backdrop-blur-lg m-3"
        >
            <div className="flex w-full text-gray-700 dark:text-gray-300 pt-3 px-3">
                <div className="scale-80 mt-0.5">{titleIcon}</div>
                <h2 className="text-[1px] ml-2">{title}</h2>
            </div>
            <div className={"mt-2 px-5 pb-5 " + cardClass}>{children}</div>
            <>
                {allowExpand && (
                    <div>
                        <button
                            className=" mx-5 text-left"
                            onClick={() => setExpanded((prev) => !prev)}
                        >
                            {expanded ? (
                                <div className="flex">
                                    <p className="mr-2">Less </p>
                                    <ChevronUp />
                                </div>
                            ) : (
                                <div className="flex">
                                    <p className="mr-2 mb-3">More </p>
                                    <ChevronRight />
                                </div>
                            )}
                        </button>
                        <div>
                            {expanded && (
                                <div className={"mt-2 px-5 pb-5 " + cardClass}>
                                    {expandedContent}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </>
        </motion.div>
    );
}

export default function App() {
    const [data, setData] = useState(null);
    const [alerts, setAlerts] = useState(null);
    const [selectedDay, setSelectedDay] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWeather([43.8009, -70.1876])
            .then(setData)
            .finally(() => setLoading(false));
        fetchAlerts([44, -70]).then(setAlerts);
    }, []);

    return (
        <div className="relative m-0 p-0 flex flex-col overflow-hidden text-black dark:text-white">
            <Loading hidden={loading}></Loading>
            <TitleBar
                setData={setData}
                setAlerts={setAlerts}
                setLoading={setLoading}
            ></TitleBar>
            <div className="mt-10"></div>

            <div className="fixed inset-0 -z-10">
                {data?.hours?.[0]?.hours?.[0] && data?.astronomical && (
                    <img
                        className="absolute w-full h-full inset-0 -z-10 object-cover object-center overflow-hidden"
                        src={getBg(
                            data?.hours?.[0]?.hours?.[0]?.shortForecast,
                            data?.hours?.[0]?.hours?.[0]?.isDaytime,
                            data?.astronomical?.sun,
                        )}
                    />
                )}
            </div>

            {/* Actual forecast */}
            <motion.div
                key={data?.info?.city}
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: {
                            staggerChildren: 0.1,
                        },
                    },
                }}
                className="flex flex-col min-h-0 h-full pt-5"
            >
                <Alerts alerts={alerts} />
                <Now data={data} />
                <Card title="Hourly" titleIcon={<Clock />}>
                    <HourlyForecast data={data} dayIndex={0} />
                </Card>
                <DailyForecast data={data} />
                <SunCard data={data} />
                <MoonCard data={data} />
            </motion.div>
        </div>
    );
}
