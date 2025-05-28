import React from "react";
import logo from '../assets/Logo/logo.jpg';

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4">
        {/* Logo and other things */}
        <div className="space-y-3">
          <img
            src={logo}
            alt="logo"
            className="h-[68px] w-[68px]"
          />
          <h1 className="text-2xl">Viwahaa Matrimony</h1>
          <span className="text-gray-400">Find your Tamil soulmate here.</span>
        </div>

        {/* Useful Links Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Useful Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-orange-600 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-600 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-600 transition">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-600 transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-600 transition">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-orange-600 transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Our Services Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Our Services</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-gray-600 transition">
                Verified Profiles
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-600 transition">
                Manual Profile Matching
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-600 transition">
                Expert Horoscope Matching
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-600 transition">
                Cultural Resonance
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-600 transition">
                Tailored Relationship Guidance
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-600 transition">
                Local Expertise in Jaffna
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Contact</h3>
          <address className="not-italic">
            <p>No.222, 2nd Cross Street, Jaffna, Sri Lanka</p>
            <p className="mt-2">
              <strong>Mobile:</strong> +94 74 174 4952
            </p>
            <p>
              <strong>Landline:</strong> +94 21 728 4036
            </p>
            <p className="mt-2">
              <strong>Email:</strong> vivahsamattimony@gmail.com
            </p>
          </address>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-gray-300 text-center">
        <p>© Copyright vivahsamattimony.com. All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
