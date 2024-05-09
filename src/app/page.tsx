/** @format */
"use client";

import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForcasteWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelcius } from "@/utils/convertKelvinToCelcius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKm";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Image from "next/image";
import { useQuery } from "react-query";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";
// import { format as dateFromate } from "date-format";

// var format = require('date-format');
// format('hh:mm:ss.SSS', new Date()); // just the time
interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  // console.log("error", error);

  console.log("data", data);

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center min-h-screen justify-center">
        {/* @ts-ignore */}
        <p className="text-red-400">{error.message}</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen ">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4 ">
        {/* today data  */}
        {loadingCity ? (
          <WeatherLoadingSkeleton />
        ) : (
          <>
            <section className="space-y-4 ">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl  items-end ">
                  <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                  </p>
                </h2>
                <Container className=" gap-10 px-6 items-center">
                  {/* temprature */}
                  <div className=" flex flex-col px-4 ">
                    <span className="text-5xl">
                      {convertKelvinToCelcius(firstData?.main.temp ?? 296.37)}°
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span> Feels like</span>
                      <span>
                        {convertKelvinToCelcius(
                          firstData?.main.feels_like ?? 0
                        )}
                        °
                      </span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span>
                        {convertKelvinToCelcius(firstData?.main.temp_min ?? 0)}
                        °↓{" "}
                      </span>
                      <span>
                        {" "}
                        {convertKelvinToCelcius(firstData?.main.temp_max ?? 0)}
                        °↑
                      </span>
                    </p>
                  </div>
                  {/* time  and weather  icon */}
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold "
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>

                        {/* <WeatherIcon iconName={d.weather[0].icon} /> */}
                        <WeatherIcon
                          iconname={getDayOrNightIcon(
                            d.weather[0].icon,
                            d.dt_txt
                          )}
                        />
                        <p>{convertKelvinToCelcius(d?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className=" flex gap-4">
                {/* left  */}
                <Container className="w-fit  justify-center flex-col px-4 items-center ">
                  <p className=" capitalize text-center">
                    {firstData?.weather[0].description}{" "}
                  </p>
                  <WeatherIcon
                    iconname={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  />
                </Container>
                <Container className="bg-yellow-300/80  px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails
                    visability={metersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    sunrise={format(data?.city.sunrise ?? 1702949452, "H:mm")}
                    // sunrise={}
                    sunset={format(data?.city.sunset ?? 1702517657, "H:mm")}
                    winSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                  />
                </Container>
                {/* right  */}
              </div>
            </section>

            {/* 7 day forcast data  */}
            <section className="flex w-full flex-col gap-4  ">
              <p className="text-2xl">Forcast (7 days)</p>
              {firstDataForEachDate.map((d, i) => (
                <ForecastWeatherDetail
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
                  day={d ? format(parseISO(d.dt_txt), "dd.MM") : "EEEE"}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1702517657),
                    "H:mm"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1702517657),
                    "H:mm"
                  )}
                  visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  winSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function WeatherLoadingSkeleton() {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
      {/* today data */}
      <section className="space-y-4 animate-pulse">
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl items-end">
            <p className="text-2xl">Day of the week</p>
            <p className="text-lg">(Date)</p>
          </h2>
          <Container className="gap-10 px-6 items-center">
            {/* Temperature */}
            <div className="flex flex-col px-4">
              <span className="text-5xl">Searching Location</span>
              {/* feels like */}
              <p className="text-xs space-x-1 py-1 whitespace-nowrap">
                <span> Feels like</span>
                <span>Feels like temperature</span>
              </p>
              {/* min & max temp*/}
              <p className="text-xs space-x-2">
                <span>Min temperature↓</span>
                <span>Max temperature↑</span>
              </p>
            </div>

            {/* Time and weather Icon */}
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {/* Weather forecast */}
              <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                <p>Time</p>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <p>Temperature</p>
              </div>
            </div>
          </Container>
        </div>
        <div className="flex gap-4">
          {/* left */}
          <Container className="w-fit justify-center flex-col px-4 items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </Container>
          {/* right */}
          <Container className="bg-green-300/80 px-6 gap-4 justify-between overflow-x-auto">
            {/* Weather Details */}
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </Container>
        </div>
      </section>
      {/* 7 days forecast data */}
      <section className="flex w-full flex-col gap-4">
        <p className="text-2xl">Forecast (7 days)</p>

        {/* Forecast Weather Detail */}
        <div className="flex gap-4">
          <Container className="w-fit justify-center flex-col px-4 items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </Container>
          <Container className="bg-gray-300 px-6 gap-4 justify-between overflow-x-auto">
            {/* Weather Details */}
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </Container>
        </div>
        {/* Second day */}
        <div className="flex gap-4">
          <Container className="w-fit justify-center flex-col px-4 items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </Container>
          <Container className="bg-gray-300 px-6 gap-4 justify-between overflow-x-auto">
            {/* Weather Details */}
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </Container>
        </div>
        {/* Third day */}
        <div className="flex gap-4">
          <Container className="w-fit justify-center flex-col px-4 items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </Container>
          <Container className="bg-gray-300 px-6 gap-4 justify-between overflow-x-auto">
            {/* Weather Details */}
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </Container>
        </div>
        {/* Fourth day */}
        <div className="flex gap-4">
          <Container className="w-fit justify-center flex-col px-4 items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </Container>
          <Container className="bg-gray-300 px-6 gap-4 justify-between overflow-x-auto">
            {/* Weather Details */}
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </Container>
        </div>
        {/* Fifth day */}
        <div className="flex gap-4">
          <Container className="w-fit justify-center flex-col px-4 items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </Container>
          <Container className="bg-gray-300 px-6 gap-4 justify-between overflow-x-auto">
            {/* Weather Details */}
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </Container>
        </div>
        {/* Sixth day */}
        <div className="flex gap-4">
          <Container className="w-fit justify-center flex-col px-4 items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </Container>
          <Container className="bg-gray-300 px-6 gap-4 justify-between overflow-x-auto">
            {/* Weather Details */}
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </Container>
        </div>
        {/* Seventh day */}
        <div className="flex gap-4">
          <Container className="w-fit justify-center flex-col px-4 items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="w-24 h-6 bg-gray-200 rounded"></div>
          </Container>
          <Container className="bg-gray-300 px-6 gap-4 justify-between overflow-x-auto">
            {/* Weather Details */}
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </Container>
        </div>
      </section>
    </main>
  );
}
