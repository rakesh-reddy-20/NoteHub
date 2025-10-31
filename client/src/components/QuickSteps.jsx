import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { UserLock, CloudUpload, FileDown } from "lucide-react";

const QuickSteps = () => {
  const [isHover, setIsHover] = React.useState(false);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center py-16 bg-gray-50 ">
      {/* Image Section */}
      <img
        className="max-w-2xl w-full xl:-ml-32"
        src={assets.group}
        alt="How NoteHub Works"
      />

      {/* Text Section */}
      <div
        className="px-4 md:px-0"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {/* Step 1 - Secure Login */}
        <Link to="/login">
          <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer">
            <div
              className={`p-6 flex gap-4 rounded-xl transition-colors ${
                !isHover
                  ? "border-indigo-300 bg-indigo-100 border"
                  : "group-hover:bg-indigo-100 group-hover:border-indigo-300 border border-transparent"
              }`}
            >
              <UserLock className="text-indigo-600 w-6 h-6" />
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">
                  Secure Login
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Your identity and data are always protected with encrypted
                  access.
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Step 2 - Easy Upload */}
        <Link to="/upload-notes">
          <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer mt-4">
            <div className="p-6 group-hover:bg-green-100 border border-transparent group-hover:border-green-300 flex gap-4 rounded-xl transition-colors">
              <CloudUpload className="text-green-600 w-6 h-6" />
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">
                  Easy Upload
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Upload your important notes in seconds — simple, quick, and
                  reliable.
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Step 3 - Fast Download */}
        <Link to="/all-notes">
          <div className="flex items-center justify-center gap-6 max-w-md group cursor-pointer mt-4">
            <div className="p-6 group-hover:bg-orange-100 border border-transparent group-hover:border-orange-300 flex gap-4 rounded-xl transition-colors">
              <FileDown className="text-orange-600 w-6 h-6" />
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-slate-700">
                  Fast Download
                </h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Download notes anytime without limits — study materials ready
                  when you are.
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuickSteps;
