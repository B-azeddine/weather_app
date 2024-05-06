import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import { WeatherDetailProps } from "./WeatherDetails";

export interface ForcasteWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForcasteWeatherDetail(
  props: ForcasteWeatherDetailProps
) {
  const {
    weatherIcon = "string",
    date = "string",
    day = "string",
    temp = "number",
    feels_like = "number",
    temp_min = "number",
    temp_max = "number",
    description = "string",
  } = props;
  return (
    <Container className="gap-4">
      <section className="flex gap-4 items-center px-4">
        <div className="">
          <WeatherIcon iconName={weatherIcon} />
        </div>
      </section>
    </Container>
  );
}
