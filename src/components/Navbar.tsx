"use client";

import React, { useState } from "react";
import { MdMyLocation, MdOutlineLocationOn, MdSunny } from "react-icons/md";
import SearchBox from "./SearchBox";
import axios from "axios";

export default function Navbar() {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setsuggestions] = useState<string[]>([]);
  const [showSuggestions, setshowSuggestions] = useState(false);

  async function handleChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value},ma&APPID=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
        );

        const suggestions = response.data.list.map((item: any) => item.name);
        setsuggestions(suggestions);
        setError("");
        setshowSuggestions(true);
      } catch (error) {
        setsuggestions([]);
        setshowSuggestions(false);
      }
    } else {
      setsuggestions([]);
      setshowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setshowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (suggestions.length == 0) {
      setError("Location not found !");
    } else {
      setError("");
      setshowSuggestions(false);
    }
  }
  return (
    <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-gray-500 text-3xl">Weather</h2>
          <MdSunny className="text-3xl mt-1 text-yellow-300" />
        </div>
        <section className="flex gap-2 items-center ">
          <MdMyLocation className="text-2xl text-gray-500 hover:opacity-80 cursor-pointer" />
          <MdOutlineLocationOn className="text-2xl" />
          <p className="text-slate-900/80 text-sm">Kenitra</p>
          <div className="relative">
            {/* Search Box */}
            <SearchBox
              value={city}
              onSubmit={handleSubmitSearch}
              onChange={(e) => handleChange(e.target.value)}
            />
            <SuggestionsBox
              {...{
                showSuggestions,
                suggestions,
                handleSuggestionClick,
                error,
              }}
            />
          </div>
        </section>
      </div>
    </nav>
  );
}

function SuggestionsBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="mb-4 bg-white absolute top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
          {error && suggestions.length < 1 && (
            <li className="p-1 bg-red-500">{error} </li>
          )}

          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-1 rounded hover:bg-gray-200 text-black"
            >
              {item}{" "}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
