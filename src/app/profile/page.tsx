"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-5">
        <h3 className="text-3xl font-bold leading-6 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Profile
        </h3>
        <p className="mt-2 max-w-4xl text-base text-slate-600 dark:text-slate-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
        <div className="px-6 py-8 sm:p-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
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
                  className="block w-full rounded-lg border-slate-300 dark:border-slate-600 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white 
                    placeholder-slate-400 dark:placeholder-slate-500 text-base
                    transition-colors duration-200"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
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
                  className="block w-full rounded-lg border-slate-300 dark:border-slate-600 shadow-sm 
                    focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white 
                    placeholder-slate-400 dark:placeholder-slate-500 text-base
                    transition-colors duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* API Usage */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-slate-900 dark:text-white">
                API Usage
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Monthly Limit
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    100 tracks
                  </span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: "45%" }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      45 tracks used
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      55 tracks remaining
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 sm:px-8">
          <button
            type="submit"
            className="w-full sm:w-auto flex justify-center py-3 px-6 border border-transparent 
              rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r 
              from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              dark:focus:ring-offset-slate-800 transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
