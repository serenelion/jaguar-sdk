from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional, Union
import sentry_sdk

# Import utility modules
from python.utils.supabase import SupabaseClient

# Load environment variables
load_dotenv()

# Initialize Sentry
sentry_sdk.init(
    dsn="https://f64eca0816f3dadfb4c7dcc1a0461e08@o4509532666724352.ingest.us.sentry.io/4509724856877056",
    # Set traces_sample_rate to 1.0 to capture 100% of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100% of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
    # Capture 100% of the errors
    sample_rate=1.0,
    # Set environment
    environment=os.getenv("STAGE", "development"),
)

# Initialize FastAPI app
app = FastAPI(
    title="AI Open Agents Tool Server",
    description="Custom OpenAPI Tool Server for The Spatial Network's AI platform",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client (optional for development)
supabase_client = None
try:
    supabase_url = os.getenv("SUPABASE_API_URL")
    supabase_key = os.getenv("SUPABASE_API_KEY")
    
    # Only initialize if real credentials are provided
    if supabase_url and supabase_key and supabase_url != "optional" and supabase_key != "optional":
        supabase_client = SupabaseClient(
            api_url=supabase_url,
            api_key=supabase_key
        )
        print("✅ Supabase client initialized successfully")
    else:
        print("ℹ️  Supabase client not initialized - using mock mode for development")
except Exception as e:
    print(f"⚠️  Supabase client initialization failed: {e}")

# Models
class Project(BaseModel):
    id: str
    title: str
    category: Optional[str] = None
    created_at: Optional[str] = None
    created_by: str
    funding_needs: Optional[str] = None
    guilds: Optional[List[str]] = None
    latitude: Optional[float] = None
    location: Optional[str] = None
    longitude: Optional[float] = None
    power: Optional[str] = None
    property_status: str
    soil: Optional[str] = None
    structures: Optional[List[str]] = None
    team: Optional[List[str]] = None
    updated_at: Optional[str] = None
    values_mission_goals: Optional[str] = None
    water: Optional[str] = None
    zone_0: Optional[str] = None
    zone_1: Optional[str] = None
    zone_2: Optional[str] = None
    zone_3: Optional[str] = None
    zone_4: Optional[str] = None

class DocumentSubsection(BaseModel):
    id: str
    document_section_id: str
    name: str
    order: int
    priority: int
    content_type: str
    created_at: str
    updated_at: Optional[str] = None

class DocumentSection(BaseModel):
    id: str
    document_type_id: str
    name: str
    order: int
    created_at: str
    updated_at: Optional[str] = None
    document_subsections: Optional[List[DocumentSubsection]] = None

class DocumentType(BaseModel):
    id: str
    name: str
    created_at: str
    updated_at: Optional[str] = None
    document_sections: Optional[List[DocumentSection]]

class DocumentContent(BaseModel):
    id: str
    document_id: str
    document_subsection_id: str
    content: str
    document_subsections: DocumentSubsection
    created_at: str
    updated_at: Optional[str] = None

class Document(BaseModel):
    id: str
    title: str
    document_type_id: str
    project_id: str
    chat_id: Optional[str] = None
    published: bool
    created_at: str
    updated_at: Optional[str] = None
    document_content: Optional[List[DocumentContent]]

class DocumentContentItem(BaseModel):
    subsection_name: str
    content: str

class ContentUpdate(BaseModel):
    content_items: List[DocumentContentItem]

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to the AI Open Agents Tool Server"}

@app.get("/health")
async def health_check(operation_id="health_check"):
    # Check if Supabase connection is working
    if supabase_client:
        try:
            supabase_client.health_check()
            return {"status": "healthy", "services": {"supabase": "connected"}}
        except Exception as e:
            return {"status": "unhealthy", "services": {"supabase": str(e)}}
    else:
        return {"status": "healthy", "services": {"supabase": "not_configured_development_mode"}}

# Project endpoints
@app.get("/projects/{project_id}", response_model=Project, operation_id="get_project")
async def get_project(project_id: str):
    """
    Retrieve information about a specific project.
    """
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase not configured - development mode")
    return supabase_client.get_project(project_id)

# Document endpoints
@app.get("/document_types/{doc_type_name}", response_model=DocumentType, operation_id="get_document_type")
async def get_document_type(doc_type_name: str):
    """
    Retrieve document type information including all sections and metadata.
    """
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase not configured - development mode")
    try:
        result = supabase_client.get_document_type(doc_type_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Document type not found: {str(e)}")

@app.get("/documents/{project_id}/{doc_type_name}", response_model=Document, operation_id="get_document_contents")
async def get_document_contents(project_id: str, doc_type_name: str):
    """
    Retrieve all existing contents of a document.
    """
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase not configured - development mode")
    try:
        result = supabase_client.get_document_contents(project_id, doc_type_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Document not found: {str(e)}")

@app.post("/documents/{project_id}/{doc_type_name}", response_model=Document, operation_id="create_document")
async def create_document(project_id: str, doc_type_name: str):
    """
    Create a new document.
    """
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase not configured - development mode")
    try:
        result = supabase_client.create_document(
            project_id=project_id,
            doc_type_name=doc_type_name,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create document: {str(e)}")

@app.put("/documents/{project_id}/{doc_type_name}", response_model=Document, operation_id="update_document_content")
async def update_document_content(project_id: str, doc_type_name: str, content_updates: ContentUpdate):
    """
    Update an existing document.
    """
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase not configured - development mode")
    try:
        result = supabase_client.update_document_content(
            project_id=project_id,
            doc_type_name=doc_type_name,
            content_items=content_updates.content_items
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update document: {str(e)}")

# Add more endpoints as needed for NextCloud and WordPress integration

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
