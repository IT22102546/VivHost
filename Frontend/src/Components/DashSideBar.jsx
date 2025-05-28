import React from "react";
import { FaUser, FaCalendarAlt, FaHeart, FaHome } from "react-icons/fa";

const DashSidebar = ({ onNavItemClick, activeSection }) => {
  return (
    <div className="w-52 h-full bg-white p-2 pt-0 pl-0 rounded-r-lg shadow-lg">
      {/* Logo and Admin Title */}
      <div className="text-black  text-2xl font-semibold flex flex-col items-center mb-8 pt-14">
        <img
          src="../../src/assets/Logo/logo.jpg"
          alt="Logo"
          className="mr-2 rounded-full w-12 h-12"
        />
        <span className="ml-2 text-sm text-dark">Admin</span>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-4 pl-1">
        {/* Dashboard Link */}
        <div className="text-black">
          <button
            onClick={() => onNavItemClick("dashboard")}
            className={`block px-4 py-3 rounded-lg w-full text-xs text-left transition duration-300 font-workSans ${
              activeSection === "dashboard"
                ? "bg-yellow-200"
                : "hover:bg-yellow-300"
            }`}
          >
            <FaHome className="mr-3 inline" /> Dashboard
          </button>
        </div>

        <hr />
        {/* Profile Link */}
        <div className="text-black">
          <button
            onClick={() => onNavItemClick("profile")}
            className={`block px-4 py-3 rounded-lg w-full text-xs text-left transition duration-300 font-workSans ${
              activeSection === "profile"
                ? "bg-yellow-200"
                : "hover:bg-yellow-300"
            }`}
          >
            <FaUser className="mr-3 inline" /> Profile
          </button>
        </div>

        <hr />
        {/* Package Bookings Link */}
        <div className="text-black">
          <button
            onClick={() => onNavItemClick("bookings")}
            className={`block px-4 py-3 rounded-lg w-full text-xs text-left transition duration-300 font-workSans ${
              activeSection === "bookings"
                ? "bg-yellow-200"
                : "hover:bg-yellow-300"
            }`}
          >
            <FaCalendarAlt className="mr-3 inline" /> Package Bookings
          </button>
        </div>
        <hr />

        {/* Interested Link */}
        <div className="text-black">
          <button
            onClick={() => onNavItemClick("interested")}
            className={`block px-4 py-3 rounded-lg w-full text-xs text-left transition duration-300 font-workSans ${
              activeSection === "interested"
                ? "bg-yellow-200"
                : "hover:bg-yellow-300"
            }`}
          >
            <FaHeart className="mr-3 inline" /> Interested
          </button>
        </div>
        <hr />
        {/* Profile Interested Link */}
        <div className="text-black">
          <button
            onClick={() => onNavItemClick("profileinterested")}
            className={`block px-4 py-3 rounded-lg w-full text-xs text-left transition duration-300 font-workSans ${
              activeSection === "profileinterested"
                ? "bg-yellow-200"
                : "hover:bg-yellow-300"
            }`}
          >
            <FaHeart className="mr-3 inline" /> Profile Interested
          </button>
        </div>
        <hr />
      </nav>
    </div>
  );
};

export default DashSidebar;
