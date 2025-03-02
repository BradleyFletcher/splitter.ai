# Splitter.ai

A web application that separates vocals from audio files using Spleeter.

## Tech Stack

- Next.js 13+ (Frontend)
- Supabase (Storage & Database)
- Spleeter (Audio Processing)
- Render (Spleeter Service Hosting)

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- Docker (for running the Spleeter service locally)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   cp .env.local.example .env.local
   ```
4. Create a storage bucket named 'audios' in your Supabase project
5. Update the environment variables in `.env.local` with your Supabase project URL and anon key

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add the environment variables from `.env.local`
4. Deploy

### Spleeter Service (Render)

The Spleeter service deployment instructions will be added once the service is implemented.

## Features

- Upload MP3 files
- Separate vocals from accompaniment
- Download processed stems

## License

MIT
