from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
import tempfile
from pathlib import Path
import subprocess
import shutil
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

            # Process with Spleeter
            output_path = Path(temp_dir) / "output"
            output_path.mkdir(exist_ok=True)
            
            subprocess.run([
                "spleeter", "separate",
                "-p", "spleeter:2stems",
                "-o", str(output_path),
                str(input_path)
            ], check=True)

            # Upload results to Supabase
            vocals_path = output_path / "input/vocals.wav"
            accompaniment_path = output_path / "input/accompaniment.wav"

            # Upload vocals
            vocals_filename = f"vocals_{Path(request.url).stem}.wav"
            with vocals_path.open('rb') as f:
                supabase.storage.from_("processed").upload(
                    vocals_filename,
                    f.read()
                )

            # Upload accompaniment
            accompaniment_filename = f"accompaniment_{Path(request.url).stem}.wav"
            with accompaniment_path.open('rb') as f:
                supabase.storage.from_("processed").upload(
                    accompaniment_filename,
                    f.read()
                )

            # Get public URLs
            vocals_url = supabase.storage.from_("processed").get_public_url(vocals_filename)
            accompaniment_url = supabase.storage.from_("processed").get_public_url(accompaniment_filename)

            return {
                "vocals": vocals_url,
                "accompaniment": accompaniment_url
            }

    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail="Spleeter processing failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"} 