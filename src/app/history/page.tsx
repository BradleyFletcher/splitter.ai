"use client";

import { useState, useEffect } from "react";

interface SeparationHistory {
  id: string;
  filename: string;
  date: string;
  status: "complete" | "failed";
  stems: {
    vocals?: string;
    drums?: string;
    bass?: string;
    other?: string;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<SeparationHistory[]>([
    // Sample data - replace with actual data from your backend
    {
      id: "1",
      filename: "song1.mp3",
      date: "2024-03-02",
      status: "complete",
      stems: {
        vocals: "#",
        drums: "#",
        bass: "#",
        other: "#",
      },
    },
    {
      id: "2",
      filename: "song2.mp3",
      date: "2024-03-01",
      status: "failed",
      stems: {},
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-dark-700 pb-5">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">
          Separation History
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500 dark:text-gray-400">
          View and download your previously separated audio files.
        </p>
      </div>

      <div className="bg-white dark:bg-dark-800 shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead className="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                File Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Downloads
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            {history.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {item.filename}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {item.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      item.status === "complete"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {item.status === "complete" && (
                    <div className="flex space-x-2">
                      {Object.entries(item.stems).map(([type, url]) => (
                        <a
                          key={type}
                          href={url}
                          download
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                        >
                          {type}
                        </a>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
