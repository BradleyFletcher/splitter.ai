# Spliter.ai — Full Project Specification

This document describes the architecture, technology stack, and deployment steps for **Spliter.ai**, a web application that separates vocals from audio files (e.g., MP3s). The frontend is built with **Next.js**, deployed on **Vercel**, with **Supabase** used for file storage and database management. A separate Python-based service, hosted on **Render**, runs **Spleeter** for the actual audio separation.

---

## 1. Overview

**High-Level Workflow:**

1. Users upload an audio file (MP3) via the Next.js frontend.
2. The file is stored in a Supabase Storage bucket.
3. Next.js sends a request (with the file’s signed URL) to a Python + Spleeter service (hosted on Render).
4. The Spleeter service downloads the file from Supabase, processes it, and generates separate vocal/accompaniment (or other) stems.
5. The processed stems are uploaded back to Supabase, and the user can access or download them via the Next.js frontend.

---

## 2. Technology Stack

1. **Next.js 13+**
   - Deployed on Vercel.
   - Uses the App Router or Pages Router for UI and server-side routes.
2. **Supabase**
   - Offers user authentication (if needed), file storage, and a database for metadata.
3. **Spleeter (Python)**
   - Deployed separately on Render as a Docker container, handling the audio separation.
4. **Render**
   - Runs the Docker container with Python, FFmpeg, and the Spleeter service.

### 3 Frontend (Next.js)

- Main application routes (upload forms, user interface).
- Components for reusability.
- A custom Supabase client for file uploads.

### 3.2 Spleeter Service

- A Dockerfile that installs Python, FFmpeg, Spleeter, and a minimal web server.
- A requirements file listing Python dependencies.
- A script or small web server that listens for requests with a signed audio URL, runs Spleeter, and returns or uploads results.

---

## 4. Detailed Components

### 4.1 Next.js Frontend + Supabase Setup

1. Install and configure Next.js, React, and Supabase libraries.
2. Create a custom client for Supabase.
3. Implement an upload flow to store MP3s in Supabase Storage, generating signed URLs.
4. Call the Spleeter service endpoint on Render with the signed URL.
5. Deploy the Next.js project to Vercel.

### 4.2 Spleeter Service on Render

1. Use a Docker image that includes Python, FFmpeg, and Spleeter.
2. Define a minimal web server (FastAPI or Flask) to handle POST requests with the file URL.
3. Ingest the file from the signed URL, run the separation process, and optionally upload the results to Supabase.
4. Deploy this container on Render as a “Web Service.”

---

## 5. Environment Variables

### 5.1 Vercel (Next.js)

- Public or server environment variables for your Supabase URL and keys.

### 5.2 Render (Spleeter Service)

- Any additional keys or secrets if uploading results from Python to Supabase.

---

## 6. Deployment Steps Summary

1. **Create Supabase Project**
   - Make a storage bucket (e.g., “audios”).
   - Configure database or authentication if needed.
2. **Build Next.js App**
   - Include file upload functionality.
   - Deploy on Vercel.
   - Set environment variables for Supabase.
3. **Build & Deploy Spleeter Service**
   - Dockerize Python, FFmpeg, Spleeter, and a small server.
   - Deploy on Render.
4. **Integrate**
   - Use signed URLs from Supabase when sending audio to the Spleeter service.
   - Store separated stems back into Supabase.

---

## 7. Additional Notes

- Larger audio files or high concurrency may require higher-tier plans for CPU and memory.
- Consider asynchronous processing or queues for long-running tasks.
- Rely on signed URLs to secure file access in storage.
- Optionally track job status in a database table and update the UI in real time or via polling.

---
