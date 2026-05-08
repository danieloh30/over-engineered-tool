#!/bin/bash

# Development helper script
# Runs both Quarkus backend and Vite frontend in parallel

echo "🚀 Starting Over-Engineered Help Desk in Development Mode"
echo ""
echo "This will start:"
echo "  - Quarkus backend on http://localhost:8080"
echo "  - React frontend on http://localhost:5173 (with HMR)"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill 0
}
trap cleanup EXIT

# Start Quarkus in background
echo "📦 Starting Quarkus backend..."
./mvnw quarkus:dev &
QUARKUS_PID=$!

# Give Quarkus a moment to start
sleep 3

# Start Vite dev server
echo "🎨 Starting React frontend..."
cd src/main/webui && npm run dev

# Wait for all background jobs
wait
