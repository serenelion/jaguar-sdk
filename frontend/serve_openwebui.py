#!/usr/bin/env python3
"""
Production-quality OpenWebUI Server for AI Open Agents
Serves the real OpenWebUI interface on port 3000
"""

import http.server
import socketserver
import os
from pathlib import Path

PORT = 3000
DIRECTORY = Path(__file__).parent

class OpenWebUIHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add CORS and security headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        # Serve openwebui.html as the default page
        if self.path == '/' or self.path == '/index.html':
            self.path = '/openwebui.html'
        super().do_GET()
    
    def log_message(self, format, *args):
        # Custom logging format for better readability
        print(f"[OpenWebUI] {self.address_string()} - {format % args}")

if __name__ == "__main__":
    try:
        with socketserver.TCPServer(("", PORT), OpenWebUIHandler) as httpd:
            print("🚀 AI Open Agents - OpenWebUI Interface")
            print("=" * 50)
            print(f"🌐 OpenWebUI Frontend: http://localhost:{PORT}")
            print(f"🔗 Backend API:       http://localhost:8000/api")
            print(f"📊 Models Available:  jaguar, jaguar-pro, nature, codewriter")
            print("=" * 50)
            print("🐆 Real OpenWebUI experience without Docker!")
            print("   - Complete chat interface with history")
            print("   - Model switching and configuration") 
            print("   - Settings and API key management")
            print("   - Connects directly to your ai-open-agents backend")
            print("")
            print("Press Ctrl+C to stop the server")
            print("")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 OpenWebUI interface stopped gracefully")
    except Exception as e:
        print(f"❌ Error starting OpenWebUI server: {e}")
        print("   Make sure port 3000 is available and try again.")