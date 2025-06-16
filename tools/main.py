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
class EnvironmentalDataInput(BaseModel):
    location: str
    data_type: str
    value: float
    timestamp: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None

class EnvironmentalDataOutput(BaseModel):
    id: str
    location: str
    data_type: str
    value: float
    timestamp: str
    source: Optional[str] = None
    notes: Optional[str] = None

class QueryParams(BaseModel):
    location: Optional[str] = None
    data_type: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    limit: int = 100

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to the AI Open Agents Tool Server"}

@app.get("/health")
async def health_check():
    # Check if Supabase connection is working
    try:
        supabase_client.health_check()
        return {"status": "healthy", "services": {"supabase": "connected"}}
    except Exception as e:
        return {"status": "unhealthy", "services": {"supabase": str(e)}}

# Environmental data endpoints
@app.post("/environmental-data", response_model=EnvironmentalDataOutput)
async def create_environmental_data(data: EnvironmentalDataInput):
    """
    Store environmental data in the database.
    This can include measurements like temperature, air quality, biodiversity counts, etc.
    """
    try:
        result = supabase_client.store_environmental_data(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store data: {str(e)}")

@app.get("/environmental-data", response_model=List[EnvironmentalDataOutput])
async def get_environmental_data(
    location: Optional[str] = None,
    data_type: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 100
):
    """
    Retrieve environmental data based on query parameters.
    Filter by location, data type, and date range.
    """
    try:
        query_params = QueryParams(
            location=location,
            data_type=data_type,
            start_date=start_date,
            end_date=end_date,
            limit=limit
        )
        results = supabase_client.get_environmental_data(query_params.dict())
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve data: {str(e)}")

@app.get("/environmental-data/summary")
async def get_environmental_data_summary(
    location: Optional[str] = None,
    data_type: str = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """
    Get summary statistics for environmental data.
    Returns min, max, average, and count for the specified data type and filters.
    """
    if not data_type:
        raise HTTPException(status_code=400, detail="data_type is required for summary statistics")
    
    try:
        summary = supabase_client.get_environmental_data_summary(
            data_type=data_type,
            location=location,
            start_date=start_date,
            end_date=end_date
        )
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")

# Add more endpoints as needed for NextCloud and WordPress integration

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
