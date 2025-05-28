import React from "react";
import bg4 from '../assets/images/img_bg_4.jpg'

const InterestedForm = () => {
  return (
    <div
      className="flex items-center justify-center from-gray-800 to-gray-900 h-96"
           style={{ backgroundImage: `url(${bg4})` }}
    >
      <div className="text-center px-4">
        <h1 className="text-4xl md:text-5xl font-semibold font-Sacremento text-white mb-4">
          Are You Interested?
        </h1>
        <p className="text-lg text-gray-300 mb-8 font-workSans">
          Please fill-up the form to notify you that you're interested.
        </p>
        <form className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Enter your name"
            className="px-5 py-3 rounded-md w-72 md:w-80 bg-gray-600 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="px-5 py-3 rounded-md w-72 md:w-80 bg-gray-600 text-white placeholder-gray-300 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full transition-all duration-300"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterestedForm;
