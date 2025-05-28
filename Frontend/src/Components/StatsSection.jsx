import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer"; // Import intersection observer hook
import stat from '../assets/images/img_bg_3.jpg';

const StatsSection = () => {
  const [countStarted, setCountStarted] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger once when it comes into view
    threshold: 0.5, // Trigger when 50% of the section is visible
  });

  // Animate count from 0 to the target value
  const animateCount = (id, start, end) => {
    let startTime = Date.now();
    let duration = 3000; // Duration in ms (1.5 seconds)
    let frame = () => {
      let timeElapsed = Date.now() - startTime;
      let progress = Math.min(timeElapsed / duration, 1); // Progress of animation
      let current = Math.floor(start + progress * (end - start)); // Calculate the current count
      document.getElementById(id).innerText = current; // Update the DOM with the current number

      if (progress < 1) {
        requestAnimationFrame(frame); // Continue the animation
      } else {
        setCountStarted(true); // End the animation when it's done
      }
    };
    requestAnimationFrame(frame); // Start the animation
  };

  useEffect(() => {
    if (inView && !countStarted) {
      // Start animation only once when the section comes into view
      animateCount("count1", 0, 3056);
      animateCount("count2", 0, 5000);
      animateCount("count3", 0, 1852);
      animateCount("count4", 0, 2345);
    }
  }, [inView, countStarted]); // Trigger animation when the section comes into view

  return (
    <div
      className="bg-white py-12 sm:py-16 lg:py-20"
      style={{ backgroundImage: `url(${stat})` }}
      ref={ref}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
          {/* Stat 1 */}
          <div className="text-center">
            <div
              id="count1"
              className="text-4xl font-thin text-white sm:text-5xl lg:text-6xl font-workSans"
            >
              {inView && !countStarted ? "0" : "3056"}
            </div>
            <p className="mt-2 text-lg font-light text-white sm:text-xl">
              HAPPY COUPLES
            </p>
          </div>

          {/* Stat 2 */}
          <div className="text-center">
            <div
              id="count2"
              className="text-4xl font-thin text-white sm:text-5xl lg:text-6xl font-workSans"
            >
              {inView && !countStarted ? "0" : "5000"}
            </div>
            <p className="mt-2 text-lg font-light text-white sm:text-xl">
              PROFILES
            </p>
          </div>

          {/* Stat 3 */}
          <div className="text-center">
            <div
              id="count3"
              className="text-4xl font-thin text-white sm:text-5xl lg:text-6xl font-workSans"
            >
              {inView && !countStarted ? "0" : "1852"}
            </div>
            <p className="mt-2 text-lg font-light text-white sm:text-xl">
              EVENTS DONE
            </p>
          </div>

          {/* Stat 4 */}
          <div className="text-center">
            <div
              id="count4"
              className="text-4xl font-thin text-white sm:text-5xl lg:text-6xl font-workSans"
            >
              {inView && !countStarted ? "0" : "2345"}
            </div>
            <p className="mt-2 text-lg font-light text-white sm:text-xl">
              HOURS SPENT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
