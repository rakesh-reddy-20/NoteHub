import React from "react";

const Contact = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 mt-20 md:mt-0">
      <form className="bg-white text-gray-600 w-full max-w-md mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Need Help? Contact Us
        </h2>

        {/* Name */}
        <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          className="w-full border mt-1 border-gray-300 outline-none rounded p-2 focus:border-indigo-500"
          type="text"
          placeholder="Enter your name"
          required
        />

        {/* Email + Issue Type (same line on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              className="w-full border mt-1 border-gray-300 outline-none rounded p-2 focus:border-indigo-500"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="issue"
              className="block mb-1 font-medium text-gray-700"
            >
              Type of Issue
            </label>
            <select
              id="issue"
              className="w-full border mt-1 border-gray-300 outline-none rounded p-2 focus:border-indigo-500 bg-white"
              required
            >
              <option value="">Select issue</option>
              <option value="download">Download Problem</option>
              <option value="upload">Upload Problem</option>
              <option value="account">Account / Login</option>
              <option value="security">Security</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <label
          htmlFor="msg"
          className="block mt-4 mb-1 font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          rows="4"
          id="msg"
          className="w-full border mt-1 resize-none border-gray-300 outline-none rounded p-2 focus:border-indigo-500"
          placeholder="Describe your issue..."
          required
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition py-2.5 rounded text-white font-medium"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
