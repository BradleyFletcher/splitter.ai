# Use Python 3.8 which has better Apple Silicon support
FROM python:3.8-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    GRPC_PYTHON_BUILD_SYSTEM_OPENSSL=1 \
    GRPC_PYTHON_BUILD_SYSTEM_ZLIB=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    git \
    build-essential \
    pkg-config \
    curl \
    libhdf5-dev \
    libasound2-dev \
    portaudio19-dev \
    python3-dev \
    libatlas-base-dev \
    gfortran \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir numpy==1.19.2 && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY app/ ./app/

# Create directories for temporary files
RUN mkdir -p /tmp/spleeter

# Expose port
EXPOSE 8000

# Start the application with reload for development
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]