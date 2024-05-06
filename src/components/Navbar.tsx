import React from "react";
import { MdMyLocation, MdOutlineLocationOn, MdSunny } from "react-icons/md";
import SearchBox from "./SearchBox";

export default function Navbar() {
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
          <div>
            {/* Search Box */}
            <SearchBox />
          </div>
        </section>
      </div>
    </nav>
  );
}
