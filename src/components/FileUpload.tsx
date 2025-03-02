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
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${
            (status === "uploading" || status === "processing") &&
            "opacity-50 cursor-not-allowed"
          }`}
      >
        <input {...getInputProps()} />
        {status === "uploading" ? (
          <p className="text-gray-600">Uploading your file...</p>
        ) : status === "processing" ? (
          <div className="space-y-2">
            <p className="text-gray-600">Processing your audio file...</p>
            <p className="text-sm text-gray-500">This may take a few minutes</p>
          </div>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the audio file here</p>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">
              Drag and drop an audio file here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {status === "complete" && processedFiles && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
          <p className="text-green-600 font-medium">Processing complete!</p>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={processedFiles.vocals}
              download
              className="text-center bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors"
            >
              Download Vocals
            </a>
            <a
              href={processedFiles.drums}
              download
              className="text-center bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors"
            >
              Download Drums
            </a>
            <a
              href={processedFiles.bass}
              download
              className="text-center bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors"
            >
              Download Bass
            </a>
            <a
              href={processedFiles.other}
              download
              className="text-center bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors"
            >
              Download Other
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
