import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url =
        state === "Login"
          ? `${backendUrl}/api/v1/auth/login`
          : `${backendUrl}/api/v1/auth/register`;

      const payload =
        state === "Login" ? { email, password } : { name, email, password };

      const { data } = await axios.post(url, payload);

      if (data.success) {
        setIsLoggedIn(true);
        toast.success(
          state === "Login" ? "Login successful" : "Registration successful"
        );
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Server error, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 mt-20 md:mt-0">
      <div className="flex flex-col items-center justify-center w-full max-w-sm rounded-xl px-6 py-8 border border-gray-200 bg-white text-gray-800 shadow-sm">
        <h2 className="text-2xl font-semibold">
          {state === "Login" ? "Login" : "Register"}
        </h2>
        <p className="text-gray-500 mt-1">
          {state === "Login" ? "Welcome back!" : "Create your account"}
        </p>

        <form className="mt-8 w-full" onSubmit={onSubmitHandler}>
          {state !== "Login" && (
            <>
              <label
                htmlFor="name"
                className="block mb-1 font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-2 mb-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
            </>
          )}

          <label
            htmlFor="email"
            className="block mb-1 font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 mb-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />

          <label
            htmlFor="password"
            className="block mb-1 font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-2 mb-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
          />

          {state === "Login" && (
            <div className="text-right">
              <Link
                to="/reset-password"
                className="font-medium text-indigo-600 hover:text-indigo-500 text-sm"
              >
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-8 px-4 py-2.5 font-medium text-white rounded-md transition cursor-pointer ${
              loading
                ? "bg-rose-300 cursor-not-allowed"
                : "bg-rose-500 hover:bg-rose-400"
            }`}
          >
            {loading
              ? "Processing..."
              : state === "Register"
              ? "Register"
              : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          {state === "Login" ? (
            <p>
              Don’t have an account?{" "}
              <span
                onClick={() => setState("Register")}
                className="text-rose-500 cursor-pointer hover:underline"
              >
                Create one
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-rose-500 cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
