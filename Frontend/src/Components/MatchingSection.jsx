import React from "react";
import groom from '../assets/images/groom.jpg';
import bride from '../assets/images/bride.jpg';

const MatchingSection = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* For Large Screens (Desktop View) */}
        <div className="hidden md:flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
          {/* Left Text Block */}
          <div className="max-w-md text-center md:text-right">
            <h3 className="text-4xl font-semibold font-Sacremento text-orange-500 mb-4">
              Manual profile matching
            </h3>
            <p className="text-gray-600 font-workSans leading-relaxed">
              Elevate your matrimony experience with vivrahamatrimony.com and
              our distinctive approach to connections – "manual profile
              matching." Unlike automated systems, our expert team meticulously
              analyzes and matches profiles based on shared values and
              compatibility.
            </p>
          </div>

          {/* Image Pair with Heart */}
          <div className="relative flex items-center justify-center gap-3">
            {/* Groom Image */}
            <img
              src={groom}
              alt="Groom"
              className="w-32 h-32 rounded-full object-cover"
            />

            {/* Heart Icon in Circle */}
            <div className="absolute left-1/2 -translate-x-1/2 bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md z-10">
              <span className="text-orange-500 text-lg">🧡</span>
            </div>

            {/* Bride Image */}
            <img
              src={bride}
              alt="Bride"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>

          {/* Right Text Block */}
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-4xl font-semibold font-Sacremento text-orange-500 mb-4">
              Expert horoscope matching
            </h3>
            <p className="text-gray-600 font-workSans leading-relaxed">
              Embark on a journey of celestial love with vivrahamatrimony.com,
              where meaningful connections are forged through "Expert Horoscope
              Matching." Our seasoned astrological experts meticulously analyze
              horoscopes, aligning cosmic energies to pave the way for
              harmonious unions.
            </p>
          </div>
        </div>

        {/* For Small Screens (Mobile View) */}
        <div className="block md:hidden">
          {/* Manual Profile Matching */}
          <div className="flex flex-col items-center text-center px-6">
            <h3 className="text-3xl font-Sacramento font-semibold mb-4 text-orange-500">
              Manual profile matching
            </h3>
            <p className="text-gray-600 font-workSans px-4">
              Elevate your matrimony experience with vivrahamatrimony.com and
              our distinctive approach to connections – "manual profile
              matching." Unlike automated systems, our expert team meticulously
              analyzes and matches profiles based on shared values and
              compatibility.
            </p>
            <div className="flex items-center justify-center mt-6">
              <img
                src={groom}
                alt="groom_img"
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
          </div>

          {/* Heart Icon */}
          <div className="my-6 text-xl">🧡</div>

          {/* Expert Horoscope Matching */}
          <div className="flex flex-col items-center text-center px-6">
            <h3 className="text-3xl font-Sacramento font-semibold mb-4 text-orange-500">
              Expert horoscope matching
            </h3>
            <p className="text-gray-600 font-workSans px-4">
              Embark on a journey of celestial love with vivrahamatrimony.com,
              where meaningful connections are forged through "Expert Horoscope
              Matching." Our seasoned astrological experts meticulously analyze
              horoscopes, aligning cosmic energies to pave the way for
              harmonious unions.
            </p>
            <div className="flex items-center justify-center mt-6">
              <img
                src={bride}
                alt="bride_img"
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatchingSection;
