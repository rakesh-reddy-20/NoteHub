import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <>
      <footer className="px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-500 bg-white pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 text-indigo-600 font-semibold text-lg"
            >
              <img src={assets.book} alt="NoteHub Logo" className="w-8 h-8" />
              <p className="text-black">
                Note<span className="text-rose-500">Hub</span>
              </p>
            </Link>
            <p className="text-sm/7 mt-6">
              NoteHub — a free platform to upload and download important notes
              anytime.
            </p>
          </div>
          <div className="flex flex-col lg:items-center lg:justify-center">
            <div className="flex flex-col text-sm space-y-2.5">
              <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
              <Link to="/about" className="hover:text-slate-600 transition">
                About us
              </Link>
              <Link to="/contact" className="hover:text-slate-600 transition">
                Contact us
                <span className="text-xs text-white bg-red-600 rounded-md ml-2 px-2 py-1">
                  If any issue!
                </span>
              </Link>
              <Link to="/upload" className="hover:text-slate-600 transition">
                Upload Notes
              </Link>
              <Link to="/complain" className="hover:text-slate-600 transition">
                Complain
              </Link>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 mb-5">
              Subscribe to our newsletter
            </h2>
            <div className="text-sm space-y-6 max-w-sm">
              <p>
                Get email if any new updates or notes are uploaded. No spam,
              </p>
              <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-indigo-50">
                <input
                  className="focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 py-2 rounded px-2"
                  type="email"
                  placeholder="Enter your email"
                />
                <button className="bg-indigo-600 px-4 py-2 text-white rounded cursor-pointer">
                  Subscribe!
                </button>
              </div>
            </div>
          </div>
        </div>
        <p className="py-4 text-center border-t mt-6 border-slate-200">
          Copyright 2025 © <a href="#">ARA tech soluctions</a> All Right
          Reserved.
        </p>
      </footer>
    </>
  );
};

export default Footer;
