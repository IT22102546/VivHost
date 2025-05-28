import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const authResponse = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          isAdmin: true,
        }),
      });

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        throw new Error(authData.message || "Login failed");
      }

      if (!authData.isAdmin) {
        throw new Error("Admin verification failed");
      }

      // Dispatch to Redux store
      dispatch(
        signInSuccess({
          token: authData.token,
          user: authData.user,
          isAdmin: true,
        })
      );

      // Store in localStorage
      localStorage.setItem("token", authData.token);
      localStorage.setItem("user", JSON.stringify(authData.user));
      localStorage.setItem("isAdmin", "true");

      navigate("/dashboard");
    } catch (err) {
      // Clear all auth data on error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      dispatch(signOut());

      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Container with yellow background and form */}
      <div className="relative w-full h-40">
        {" "}
        {/* Changed to h-screen to fill viewport */}
        {/* Yellow Background Section - now takes full height */}
        <div className="absolute inset-0 bg-yellow-200 flex items-center justify-center">
          <img
            src="../../src/assets/Logo/logowhite.png"
            alt="Logo"
            className="h-14 absolute top-10" /* Positioned at top */
          />
        </div>
        {/* Form Section - positioned absolutely over the yellow background */}
        <div className="absolute top-[350px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          {/* Sign In Header */}
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold font-workSans text-gray-900">
              Admin Portal Sign In
            </h2>
            <p className="mt-2 text-sm text-gray-600 font-workSans">
              Please enter your admin credentials
            </p>
          </div>

          {/* Rest of your form content remains the same */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-workSans text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-200 focus:border-blue-500"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-workSans text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-200 focus:border-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-workSans text-black bg-yellow-200 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex justify-center items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Thank you.{" "}
              <a href="/" className="text-yellow-600 hover:text-yellow-700">
                Back to website
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
