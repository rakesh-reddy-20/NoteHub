import React, { useState, useContext, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const EmailVerify = () => {
  const { backendUrl, setUser } = useContext(AppContext);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits allowed
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrors((prev) => ({ ...prev, [index]: false }));

    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark empty inputs red
    const newErrors = {};
    otp.forEach((digit, i) => {
      if (!digit.trim()) newErrors[i] = true;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const otpCode = otp.join("");

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/auth/verify-account`,
        { otp: otpCode },
        { withCredentials: true }
      );
      if (data?.success) {
        if (data.message === "Already verified!") {
          toast.success("Already verified");
        } else {
          toast.success(data.message || "Account verified successfully!");
        }
        navigate("/");
        return; // prevent any further execution
      }

      toast.error(data.message || "Verification failed, try again.");
    } catch (error) {
      console.error(
        "Verification error details:",
        error.response?.data || error
      );
      toast.error(
        error.response?.data?.message || "Internal error, please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-600 max-w-96 mx-4 md:py-10 md:px-6 px-4 py-8 rounded-lg shadow-[0_0_10px_0_rgba(0,0,0,0.1)] transition-all"
      >
        <h2 className="text-2xl font-semibold mb-3 text-center text-gray-800">
          Email Verification
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <div className="flex justify-between mb-6 gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              className={`w-10 h-12 border rounded text-center text-lg font-medium transition duration-300 outline-none ${
                errors[index]
                  ? "border-red-500 animate-shake"
                  : "border-gray-300 focus:border-indigo-500/60"
              }`}
              type="text"
              maxLength={1}
              autoFocus={index === 0}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2.5 rounded hover:opacity-90 active:scale-95 transition cursor-pointer"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
