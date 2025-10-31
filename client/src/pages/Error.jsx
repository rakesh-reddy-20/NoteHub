import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50 px-4">
      <p className="font-medium text-indigo-500 text-lg mb-2">404 Error</p>
      <h2 className="text-4xl md:text-6xl font-semibold text-gray-800 mb-4">
        Page Not Found
      </h2>
      <p className="text-base text-gray-500 max-w-md">
        Sorry, we couldn’t find the page you’re looking for. It might have been
        removed or the link is broken.
      </p>

      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-7 py-2.5 rounded-full text-sm active:scale-95 transition-all"
        >
          Go back home
        </button>

        <button
          onClick={() => navigate("/contact")}
          className="group flex items-center gap-2 text-gray-700 hover:text-indigo-600 px-7 py-2.5 text-sm active:scale-95 transition-all"
        >
          Contact support
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Error;
