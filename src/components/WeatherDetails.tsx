import React from "react";
import Container from "./Container";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { ImMeter } from "react-icons/im";
import { MdAir } from "react-icons/md";

export interface WeatherDetailProps {
  visability: string;
  humidity: string;
  winSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}
export default function WeatherDetails(props: WeatherDetailProps) {
  const {
    visability = "25km",
    humidity = "61%",
    winSpeed = "7 km/h",
    airPressure = "1012 hPa",
    sunrise = "6:20",
    sunset = "18:48",
  } = props;
  return (
    <>
      <SingleWeatherDetail
        icon={<LuEye />}
        information="visability"
        value={visability}
      />
      <SingleWeatherDetail
        icon={<FiDroplet />}
        information="humidity"
        value={humidity}
      />
      <SingleWeatherDetail
        icon={<MdAir />}
        information="winSpeed"
        value={winSpeed}
      />
      <SingleWeatherDetail
        icon={<ImMeter />}
        information="Air Pressure"
        value={airPressure}
      />
      <SingleWeatherDetail
        icon={<LuSunrise />}
        information="Sunrise"
        value={sunrise}
      />
      <SingleWeatherDetail
        icon={<LuSunset />}
        information="Sunset"
        value={sunset}
      />
    </>
  );
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
      <p className="whitespace-nowrap">{props.information}</p>
      <div className="text-3xl">{props.icon}</div>
      <p>{props.value}</p>
    </div>
  );
}
