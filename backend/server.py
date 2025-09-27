#!/usr/bin/env python3
"""
FastAPI Backend Server for AI Open Agents
Configured to run natively on Replit in a monorepo structure
"""

import sys
import os
from pathlib import Path

# Add the tools directory to Python path for imports
backend_dir = Path(__file__).parent
tools_dir = backend_dir / "tools"
sys.path.insert(0, str(tools_dir))

# Now import the main FastAPI app
from main import app

if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment or default to 8000
    port = int(os.getenv("BACKEND_PORT", "8000"))
    
    # Run the server
    uvicorn.run(
        "main:app",  # Use import string format for reload
        host="0.0.0.0", 
        port=port,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )