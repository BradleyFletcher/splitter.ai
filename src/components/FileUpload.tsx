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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Split Your Audio
        </h2>
        <p className="mt-3 text-lg leading-6 text-gray-500 dark:text-gray-400">
          Upload your audio file and we'll separate it into individual stems
          using AI.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-primary-500 bg-primary-50 dark:bg-dark-800"
              : "border-gray-300 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-500"
          }
          ${
            (status === "uploading" || status === "processing") &&
            "opacity-50 cursor-not-allowed"
          }`}
      >
        <input {...getInputProps()} />
        {status === "uploading" ? (
          <p className="text-gray-600 dark:text-gray-400">
            Uploading your file...
          </p>
        ) : status === "processing" ? (
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              Processing your audio file...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              This may take a few minutes
            </p>
          </div>
        ) : isDragActive ? (
          <p className="text-primary-600 dark:text-primary-400">
            Drop the audio file here
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop an audio file here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {status === "complete" && processedFiles && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 space-y-4">
          <p className="text-green-600 dark:text-green-400 font-medium text-center">
            Processing complete!
          </p>
          <div className="grid grid-cols-2 gap-4">
            <a
              href={processedFiles.vocals}
              download
              className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
            >
              Download Vocals
            </a>
            <a
              href={processedFiles.drums}
              download
              className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
            >
              Download Drums
            </a>
            <a
              href={processedFiles.bass}
              download
              className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
            >
              Download Bass
            </a>
            <a
              href={processedFiles.other}
              download
              className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800"
            >
              Download Other
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
