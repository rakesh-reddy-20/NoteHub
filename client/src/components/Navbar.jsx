import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ArrowRight, LogOut, Trash2, BellRing } from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { assets } from "../assets/assets";
import { Toaster, toast } from "react-hot-toast";

const Navbar = () => {
  const { user, backendUrl, isLoggedIn, setIsLoggedIn, setUser } =
    useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(data?.message || "Logged out successfully");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Internal error, please try again."
      );
    }
  };

  // Send verification OTP
  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/auth/send-verify-otp`,
        {},
        { withCredentials: true }
      );
      if (data?.success) {
        toast.success("OTP sent successfully to your email!");
        setIsOpen(false);
        setShowDropdown(false);
        navigate("/email-verify");
      } else {
        toast.error(data?.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  // Delete account popup confirm
  const deleteAccount = async () => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/v1/auth/delete-account`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message || "Account deleted successfully.");
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
        setShowDeletePopup(false);
      } else {
        toast.error(data.message || "Failed to delete account.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Internal error. Please try again."
      );
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 h-[70px] w-full px-6 md:px-14 lg:px-20 xl:px-28 flex items-center justify-between z-50 bg-white text-gray-700 shadow-[0px_4px_25px_0px_#0000000D]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <img src={assets.book} alt="NoteHub Logo" className="w-8 h-8" />
          <p className="text-black">
            Note<span className="text-rose-500">Hub</span>
          </p>
        </Link>

        {/* Desktop Menu */}
        <ul className="md:flex hidden items-center gap-10">
          <li>
            <Link className="hover:text-rose-500/80" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:text-rose-500/80" to="/about">
              About
            </Link>
          </li>
          <li>
            <Link className="hover:text-rose-500/80" to="/upload-notes">
              Upload Notes
            </Link>
          </li>
          <li>
            <Link className="hover:text-rose-500/80" to="/all-notes">
              All Notes
            </Link>
          </li>
          <li>
            <Link className="hover:text-rose-500/80" to="/contact">
              Contact
            </Link>
          </li>
        </ul>

        {/* User Section */}
        <div className="hidden md:flex relative" ref={dropdownRef}>
          {isLoggedIn && user ? (
            <>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 hover:shadow-sm active:scale-95 transition-all"
              >
                <img
                  src={assets.download}
                  alt="user avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-lg p-2 z-50 border border-gray-100">
                  {/* User Info */}
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="mt-1">
                    {/* {!user.isVerified && (
                      <div
                        onClick={sendVerificationOtp}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition cursor-pointer"
                      >
                        <BellRing className="w-4 h-4 text-gray-600" />
                        Get all Notifications
                      </div>
                    )} */}

                    <div
                      onClick={() => setShowDeletePopup(true)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                      Delete Account
                    </div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-100 rounded-md transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-black border border-gray-300 hidden md:inline-flex items-center justify-center gap-2 text-sm text-white hover:bg-white hover:text-black active:scale-95 transition-all w-40 h-11 rounded-full"
            >
              Login
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          aria-label="menu-btn"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="menu-btn inline-block md:hidden active:scale-90 transition"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        {isOpen && (
          <div className="absolute top-[70px] left-0 w-full bg-white p-6 md:hidden shadow-lg animate-fadeIn">
            <ul className="flex flex-col space-y-4 text-lg">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="text-sm hover:text-rose-500/80 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="text-sm hover:text-rose-500/80 transition"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/upload-notes"
                  onClick={() => setIsOpen(false)}
                  className="text-sm hover:text-rose-500/80 transition"
                >
                  Upload Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/all-notes"
                  onClick={() => setIsOpen(false)}
                  className="text-sm hover:text-rose-500/80 transition"
                >
                  All Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-sm hover:text-rose-500/80 transition"
                >
                  Contact
                </Link>
              </li>
              {isLoggedIn && user ? (
                <>
                  {/* <li>
                    <Link
                      to="/contact"
                      onClick={() => setIsOpen(false)}
                      className="text-sm hover:text-rose-500/80 transition"
                    >
                      Get all notifications
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      to="/contact"
                      onClick={() => setShowDeletePopup(true)}
                      className="text-sm hover:text-rose-500/80 transition"
                    >
                      Delete Account
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="text-sm text-red-600 hover:text-red-800 transition"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-sm hover:text-rose-500/80 transition"
                    >
                      SignUp / Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Delete Account Modal */}
      {showDeletePopup && (
        <div className="fixed z-50 inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] sm:w-96 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Account?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. Are you sure you want to continue?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={deleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-5 py-2 rounded-lg transition-shadow hover:shadow-md"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-100 hover:bg-gray-200 text-sm px-5 py-2 rounded-lg border border-gray-300 transition-shadow hover:shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
