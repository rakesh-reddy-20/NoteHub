import React from "react";
import { Menu, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <>
      <section className="relative flex flex-col items-center text-white text-sm pb-20 bg-gray-950 mt-16">
        <a
          href="#"
          className="flex items-center gap-2 border border-slate-700 rounded-full p-1 pr-3 text-sm mt-20"
        >
          <span className="bg-indigo-600 text-xs px-3 py-1 rounded-full">
            New
          </span>
          <p className="flex items-center gap-2">
            <span>NoteHub — free notes sharing platform</span>
            {/* <ArrowRight className="w-4 h-4" /> */}
          </p>
        </a>

        <h1 className="text-center text-[40px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl">
          Upload, share, and access notes anytime.
        </h1>

        <p className="text-center text-base max-w-md mt-2 text-gray-300">
          NoteHub lets you upload and download study notes instantly — built for
          students who want quick, reliable access to important material.
        </p>
      </section>
    </>
  );
};

export default HeroSection;
