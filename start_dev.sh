#!/bin/bash

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements if needed
if [ ! -f "venv/requirements_installed" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
    touch venv/requirements_installed
fi

# Start the Python server in the background
echo "Starting Python server..."
python server.py &
PYTHON_PID=$!

# Navigate to chat-ui directory and start Bun dev server
echo "Starting Bun development server..."
cd chat-ui
bun dev &
BUN_PID=$!

# Function to handle cleanup on script termination
cleanup() {
    echo "Shutting down servers..."
    kill $PYTHON_PID
    kill $BUN_PID
    deactivate
    exit 0
}

# Set up trap for cleanup on script termination
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 
