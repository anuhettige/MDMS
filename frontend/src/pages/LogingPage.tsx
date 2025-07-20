import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path
import loginIllustration from "/mahapola.jpg"; // Replace with your own image

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setAuthData } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/user/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Login failed");
      }

      const data = await response.json();
      setAuthData(data.id, data.accessToken, data.userType, data.username);
      onLoginSuccess(username);
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500 p-4">
      <div className="w-full max-w-4xl flex bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Image Section */}
        <div className="hidden md:block w-1/2 bg-blue-100 dark:bg-blue-900 p-8">
          <img
            src={loginIllustration}
            alt="Login illustration"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white text-center">
            Document & Certificate Management System
          </h2>
          <p className="text-sm text-center text-gray-500 dark:text-gray-300 mb-6">
            Login to continue
          </p>

          {error && (
            <div className="mb-4 text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-1 text-gray-700 dark:text-gray-300 font-medium"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
