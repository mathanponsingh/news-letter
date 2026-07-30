#!/bin/bash
set -e

echo "=== Container Started at $(date) ==="
echo "Starting loop: Executing app.py every 2 hours..."

while true; do
    echo -e "\n------------------------------------------------------------"
    echo "=== Executing app.py at $(date) ==="
    python /app/app.py || true
    echo "=== Finished execution. Sleeping for 2 hours (7200s)... ==="
    sleep 7200
done

