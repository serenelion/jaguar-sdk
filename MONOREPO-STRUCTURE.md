# Monorepo Structure Documentation

This repository has been structured as a monorepo with clear separation between frontend and backend components.

## Project Structure

```
├── frontend/                     # Next.js Frontend (Jaguar SDK)
│   ├── app/                     # Next.js App Router
│   ├── components/              # React components
│   ├── lib/                     # Utilities and configurations
│   ├── hooks/                   # Custom React hooks
│   ├── public/                  # Static assets
│   ├── package.json             # Frontend dependencies
│   └── next.config.ts           # Next.js configuration
│
├── backend/                     # FastAPI Backend (AI Open Agents)
│   ├── tools/                   # FastAPI application
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── requirements.txt    # Python dependencies
│   │   └── python/             # Python utilities
│   │       └── utils/          # Utility modules
│   │           ├── supabase.py # Supabase client
│   │           ├── nextcloud.py# NextCloud integration (future)
│   │           └── wordpress.py# WordPress integration (future)
│   ├── server.py               # Backend startup script
│   ├── .env                    # Backend environment variables
│   ├── .env.example            # Backend environment template
│   └── README.md               # AI Open Agents documentation
│
├── shared/                      # Shared configurations and types
├── docs/                        # Documentation
├── tests/                       # Testing configurations
└── README.md                    # Main project documentation
```

## Development Workflow

### Frontend Development (Port 5000)
```bash
npm run dev
```
- Runs the Next.js development server
- Available at http://localhost:5000
- Hot reloading enabled

### Backend Development (Port 8000)
```bash
cd backend && python server.py
```
- Runs the FastAPI development server
- Available at http://localhost:8000
- Auto-reload enabled
- API documentation at http://localhost:8000/docs

## Environment Configuration

### Frontend Environment
- Configured via standard Next.js environment variables
- See existing `.env.local` files for configuration

### Backend Environment
- Copy `backend/.env.example` to `backend/.env`
- Configure Supabase credentials for full functionality
- Runs in development mode without Supabase if not configured

## Integration Points

### API Integration
- Frontend can call backend API at `http://localhost:8000`
- Backend provides OpenAPI tools for AI agents
- Supports CORS for cross-origin requests

### Database Integration
- Backend connects to Supabase for data storage
- Frontend uses existing PostgreSQL database
- Both can be configured to use the same Supabase instance

### Deployment
- Frontend: Vercel deployment (existing)
- Backend: Can be deployed as containerized service or serverless function
- Both maintain environment separation

## Getting Started

1. **Clone the repository** (already done)
2. **Install dependencies**:
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   pip install -r tools/requirements.txt
   ```
3. **Configure environment**:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your Supabase credentials (optional)
   ```
4. **Start development servers**:
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   cd backend && python server.py
   ```

## Status

✅ **Completed:**
- AI Open Agents repository cloned to `backend/`
- Python 3.11 installed and configured
- FastAPI backend running natively on Replit (no Docker)
- All Python dependencies installed
- Backend server accessible on port 8000
- Development environment configured
- Frontend preserved in existing structure
- Both servers running simultaneously

🔄 **Ready for Integration:**
- Backend API available for frontend consumption
- OpenAPI tools ready for AI agent integration
- Supabase integration available when configured
- Monorepo structure established for collaborative development