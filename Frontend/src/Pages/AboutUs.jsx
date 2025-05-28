import React from "react";
import img from "../assets/images/homeTile.jpg";

const AboutUs = () => {
  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-[48px] font-Sacremento font-semibold text-[#f97316] mb-4">
            Welcome to Viwahaa Matrimony
          </h1>
          <div className="w-24 h-1 bg-[#f97316] mx-auto mb-8"></div>
          <p className="text-gray-500 max-w-2xl mx-auto mb-12 font-workSans">
            Where genuine connections flourish, and lifelong unions are forged
            with trust, care, and expertise.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* First Paragraph */}
          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 bg-[#f97316] rounded-full mt-1 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-500 font-workSans leading-relaxed">
                At Vivahaa Matrimony, we pride ourselves on fostering authentic
                relationships through our meticulous profile verification
                process. We understand the importance of authenticity and
                security in your quest for a life partner, which is why we
                ensure that each profile is rigorously vetted to guarantee
                genuineness and reliability.
              </p>
            </div>
          </div>

          {/* Second Paragraph */}
          <div className="flex gap-4 items-start">
            <div className="w-6 h-6 bg-[#f97316] rounded-full mt-1 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-gray-500 font-workSans leading-relaxed">
                Our approach to matchmaking goes beyond algorithms and swipes.
                With our expert team's personalized touch, we delve into the
                intricacies of shared values and compatibility, curating
                connections that are not just based on surface-level attraction,
                but on deep resonance and understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="mt-16 flex justify-center">
          <img
            src={img}
            alt="Happy couple"
            className="rounded-lg shadow-xl w-full max-w-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;