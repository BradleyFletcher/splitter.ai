"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-dark-700 pb-5">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">
          Profile
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-dark-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 dark:border-dark-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-700 dark:text-white sm:text-sm"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-gray-300 dark:border-dark-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-700 dark:text-white sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* API Usage */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                API Usage
              </h4>
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Monthly Limit
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    100 tracks
                  </span>
                </div>
                <div className="mt-4 h-2 bg-gray-200 dark:bg-dark-600 rounded-full">
                  <div
                    className="h-2 bg-primary-500 rounded-full"
                    style={{ width: "45%" }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    45 tracks used
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    55 tracks remaining
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-dark-700 px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
