"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Apply dark mode class to document
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/profile", label: "My Profile" },
    { href: "/history", label: "History" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href="/"
                  className="text-2xl font-bold text-primary-600 dark:text-primary-400"
                >
                  Splitter.ai
                </Link>
              </div>

              {/* Navigation Items */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                      ${
                        pathname === item.href
                          ? "border-b-2 border-primary-500 text-gray-900 dark:text-white"
                          : "border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {isDark ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
