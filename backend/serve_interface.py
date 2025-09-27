#!/usr/bin/env python3
"""
Simple HTTP server to serve the test interface on port 3000
"""

import http.server
import socketserver
import os
from pathlib import Path

PORT = 3000
DIRECTORY = Path(__file__).parent

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS headers to allow cross-origin requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def do_OPTIONS(self):
        # Handle preflight CORS requests
        self.send_response(200)
        self.end_headers()

if __name__ == "__main__":
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🐆 Jaguar AI Test Interface")
            print(f"   Serving at: http://localhost:{PORT}/test_interface.html")
            print(f"   Backend API: http://localhost:8000/api")
            print(f"   Press Ctrl+C to stop")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Test interface stopped")
    except Exception as e:
        print(f"❌ Error starting server: {e}")