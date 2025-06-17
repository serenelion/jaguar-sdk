from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional

# Import utility modules
from python.utils.supabase import SupabaseClient

# Load environment variables
load_dotenv()

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

# Initialize Supabase client
supabase_client = SupabaseClient(
    api_url=os.getenv("SUPABASE_API_URL"),
    api_key=os.getenv("SUPABASE_API_KEY")
)

# Models
class Project(BaseModel):
    id: str
    title: str
    location: Optional[str] = None
    description: Optional[str] = None
    property_status: str
    created_at: str
    updated_at: Optional[str] = None

class BusinessPlan(BaseModel):
    id: str
    project_id: str
    created_at: str
    content: Optional[str]
    update_at: Optional[str] = None

class BusinessPlanUpdate(BaseModel):
    content: str

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to the AI Open Agents Tool Server"}

@app.get("/health")
async def health_check(operation_id="health_check"):
    # Check if Supabase connection is working
    try:
        supabase_client.health_check()
        return {"status": "healthy", "services": {"supabase": "connected"}}
    except Exception as e:
        return {"status": "unhealthy", "services": {"supabase": str(e)}}

# Project endpoints
@app.get("/projects/{project_id}", response_model=Project, operation_id="get_project")
async def get_project(project_id: str):
    """
    Retrieve information about a specific project.
    """
    return supabase_client.get_project(project_id)

# Business plan endpoints
@app.get("/business_plans/{plan_id}", response_model=BusinessPlan, operation_id="get_business_plan")
async def get_business_plan(plan_id: str):
    """
    Retrieve a business plan by ID.
    """
    try:
        result = supabase_client.get_business_plan(plan_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Business plan not found: {str(e)}")

@app.patch("/business_plans/{plan_id}", response_model=BusinessPlan, operation_id="update_business_plan")
async def update_business_plan(plan_id: str, updates: BusinessPlanUpdate):
    """
    Update a business plan with new information.
    Only the provided fields will be updated.
    """
    try:
        result = supabase_client.update_business_plan(plan_id, updates.dict(exclude_unset=True))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update business plan: {str(e)}")

# Add more endpoints as needed for NextCloud and WordPress integration

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
