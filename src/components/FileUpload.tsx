"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";

type ProcessingStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "complete"
  | "error";

interface ProcessedFile {
  vocals: string;
  drums: string;
  bass: string;
  other: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload() {
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile | null>(
    null
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      setError("Please upload an audio file");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    setStatus("uploading");
    setError(null);
    setProcessedFiles(null);

    try {
      const filename = `${Date.now()}-${file.name}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from("audios")
        .upload(filename, file, {
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("audios").getPublicUrl(filename);

      // Start processing
      setStatus("processing");

      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL + "/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: publicUrl }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Processing failed");
      }

      const result = await response.json();
      setProcessedFiles(result);
      setStatus("complete");
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setStatus("error");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: status === "uploading" || status === "processing",
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent sm:text-5xl">
          Split Your Audio
        </h2>
        <p className="text-lg leading-8 text-slate-600 dark:text-slate-400">
          Upload your audio file and we'll separate it into individual stems
          using AI.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50/50 dark:bg-slate-800/50"
              : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/30"
          }
          ${
            (status === "uploading" || status === "processing") &&
            "opacity-50 cursor-not-allowed"
          }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          {status === "uploading" ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto" />
              <p className="text-slate-600 dark:text-slate-400">
                Uploading your file...
              </p>
            </div>
          ) : status === "processing" ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto" />
              <p className="text-slate-600 dark:text-slate-400">
                Processing your audio file...
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                This may take a few minutes
              </p>
            </div>
          ) : isDragActive ? (
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 text-blue-500">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-blue-500 dark:text-blue-400 text-lg font-medium">
                Drop the audio file here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 text-slate-400 dark:text-slate-500">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Drag and drop an audio file here, or click to select
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/20 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {status === "complete" && processedFiles && (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-8 space-y-6">
          <div className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 text-green-500 dark:text-green-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xl font-medium text-slate-900 dark:text-white">
              Processing complete!
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Your audio has been successfully separated into stems
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={processedFiles.vocals}
              download
              className="flex items-center justify-center px-4 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-all duration-200"
            >
              Download Vocals
            </a>
            <a
              href={processedFiles.drums}
              download
              className="flex items-center justify-center px-4 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-all duration-200"
            >
              Download Drums
            </a>
            <a
              href={processedFiles.bass}
              download
              className="flex items-center justify-center px-4 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-all duration-200"
            >
              Download Bass
            </a>
            <a
              href={processedFiles.other}
              download
              className="flex items-center justify-center px-4 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-all duration-200"
            >
              Download Other
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
