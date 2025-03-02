from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
import tempfile
from pathlib import Path
import torch
from demucs.pretrained import get_model
from demucs.audio import AudioFile, save_audio
import numpy as np
from supabase import create_client, Client

app = FastAPI(title="Splitter.ai API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

# Initialize Demucs model (do this at startup to avoid reloading)
model = get_model('htdemucs')
model.cpu()  # Use CPU for inference
device = torch.device("cpu")

class ProcessRequest(BaseModel):
    url: str

@app.post("/process")
async def process_audio(request: ProcessRequest):
    try:
        # Create a temporary directory for processing
        with tempfile.TemporaryDirectory() as temp_dir:
            # Download the file
            async with httpx.AsyncClient() as client:
                response = await client.get(request.url)
                if response.status_code != 200:
                    raise HTTPException(status_code=400, detail="Failed to download file")
                
                input_path = Path(temp_dir) / "input.mp3"
                input_path.write_bytes(response.content)

            # Load and process with Demucs
            wav = AudioFile(input_path).read(streams=0, samplerate=model.samplerate, channels=model.audio_channels)
            ref = wav.mean(0)
            wav = (wav - ref.mean()) / ref.std()
            
            # Apply source separation
            sources = model.separate(wav[None])
            sources = sources * ref.std() + ref.mean()

            # Get source names
            source_names = model.sources

            # Save separated tracks
            results = {}
            for source, name in zip(sources[0], source_names):
                source_path = Path(temp_dir) / f"{name}.wav"
                save_audio(source, str(source_path), model.samplerate)

                # Upload to Supabase
                filename = f"{name}_{Path(request.url).stem}.wav"
                with source_path.open('rb') as f:
                    supabase.storage.from_("processed").upload(
                        filename,
                        f.read()
                    )
                
                # Get public URL
                results[name] = supabase.storage.from_("processed").get_public_url(filename)

            return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"} 