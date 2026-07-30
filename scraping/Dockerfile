FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

# Install system dependencies for Selenium, Chromium, and XVFB
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    chromium-driver \
    xvfb \
    ca-certificates \
    fonts-liberation \
    libnss3 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application script and entrypoint
COPY app.py .
COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

# Run 20-second loop entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]