import {useState, useEffect} from "react";
import {fetchWeather, getIcon, getPrecipitation, getFeelsLike} from "./fetch.js";

function TitleBar() {
    return (<div className="bg-blue-300 w-full m-0 p-3">
        <p className="text-center">SamWeather</p>
    </div>);
}

function DayOverview({data, startExpanded = false}) {
    const [expanded, setExpanded] = useState(startExpanded);

    if (!data) {
        return <p>Loading...</p>;
    }

    return (<div onClick={() => setExpanded(!expanded)}
                 className={"transition-all p-1 m-1 rounded-md " + (expanded ? "bg-gray-300" : "bg-transparent")}>
        <div className={"flex"}>
            <h3>{data.name}</h3>
            <img
                src={getIcon(data.shortForecast, data.isDaytime)}
                className="w-10 h-10 -translate-y-2"
                title={data.shortForecast}
            />
        </div>
        <div>
            {expanded ? (<>
                <p>{data.detailedForecast}</p>
                <p>{"Feels like " + getFeelsLike(data.temperature, data.humidity, data.windSpeed)}</p>
            </>) : (<></>)}
        </div>
    </div>);
}

function DayForecast({data}) {
    return (<div className={"w-1/2"}>
        <DayOverview data={data?.[1]?.properties?.periods?.[1]} startExpanded={true}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[2]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[3]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[0]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[4]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[5]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[6]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[7]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[8]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[9]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[10]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[11]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[12]} startExpanded={false}></DayOverview>
        <DayOverview data={data?.[1]?.properties?.periods?.[13]} startExpanded={false}></DayOverview>
    </div>);

}

export default function App() {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        fetchWeather([44, -70]).then(setWeatherData);
    }, []);

    return (<div className="m-0 p-0">
        <TitleBar></TitleBar>

        <p className="p-2">
            {weatherData?.[1]?.properties?.periods?.[0]?.detailedForecast}
        </p>
        <DayForecast data={weatherData}/>

    </div>);
}
