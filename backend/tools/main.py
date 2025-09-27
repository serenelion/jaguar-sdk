from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import os
import json
import time
import uuid
import asyncio
from datetime import datetime
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional, Union, Literal, AsyncGenerator
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

# OpenAI Chat Completion Models
class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    stream: Optional[bool] = False
    max_tokens: Optional[int] = None
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 1.0
    n: Optional[int] = 1
    stop: Optional[Union[str, List[str]]] = None

class ChatCompletionChoice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: Optional[str] = None

class ChatCompletionResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[ChatCompletionChoice]
    usage: Dict[str, int] = {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}

class ChatCompletionStreamChoice(BaseModel):
    index: int
    delta: Dict[str, Any]
    finish_reason: Optional[str] = None

class ChatCompletionStreamResponse(BaseModel):
    id: str
    object: str = "chat.completion.chunk"
    created: int
    model: str
    choices: List[ChatCompletionStreamChoice]

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

# Model configurations with different personalities and capabilities
MODEL_CONFIGS = {
    "jaguar": {
        "name": "Jaguar (lite)", 
        "description": "AI developer agent with masterclass wisdom",
        "system_prompt": "You are Jaguar, an AI developer agent for The Spatial Network with masterclass wisdom. You embody the ethics of Earth Care, People Care, and Fair Share. Help users with coding, workflows, and mentoring while keeping sustainability and regenerative practices in mind."
    },
    "jaguar-pro": {
        "name": "Jaguar (pro)",
        "description": "Advanced AI agent with enhanced capabilities", 
        "system_prompt": "You are Jaguar Pro, an advanced AI agent with enhanced capabilities for The Spatial Network. You excel at advanced coding, architecture, and strategic thinking. You embody the ethics of Earth Care, People Care, and Fair Share, and provide deep technical wisdom while considering long-term sustainability."
    },
    "nature": {
        "name": "Nature",
        "description": "GaiaGuard - AI dedicated to ecological regeneration",
        "system_prompt": "You are Nature (GaiaGuard), an AI dedicated to ecological regeneration and natural capital monitoring. You think with ecocentric values and seven generations thinking. You help with permaculture, ecology, and sustainability while prioritizing the health of living systems."
    },
    "codewriter:latest": {
        "name": "CodeWriter",
        "description": "Senior full-stack developer focused on optimal code",
        "system_prompt": "You are CodeWriter, a senior full-stack developer focused on efficient, optimal code. You embody technical excellence and clean code principles. Help users with coding, architecture, and optimization while maintaining high code quality standards."
    }
}

def generate_chat_response(messages: List[ChatMessage], model: str) -> str:
    """
    Generate a chat response based on the model and messages.
    This is a simple implementation - in production you'd integrate with actual LLMs.
    """
    config = MODEL_CONFIGS.get(model, MODEL_CONFIGS["jaguar"])
    
    # Get the last user message
    user_messages = [msg for msg in messages if msg.role == "user"]
    if not user_messages:
        return "Hello! How can I assist you today?"
    
    last_message = user_messages[-1].content.lower()
    
    # Simple response generation based on model personality
    if model == "nature":
        if "code" in last_message or "program" in last_message:
            return "While I can help with coding, let me approach this from an ecological perspective. How can we create code that serves both human needs and environmental regeneration? Consider the energy efficiency and long-term sustainability of your solution."
        elif "environment" in last_message or "climate" in last_message:
            return "Thank you for thinking about environmental impact! From a seven generations perspective, we must consider how our actions today affect the world our descendants will inherit. What specific ecological aspects would you like to explore?"
        else:
            return "Greetings! I'm Nature, your ecological AI companion. I see every challenge through the lens of living systems and regenerative principles. How can we work together to create solutions that benefit both people and the planet?"
    
    elif model == "jaguar-pro":
        if "architecture" in last_message or "system" in last_message:
            return "Excellent question about system architecture! Let's think strategically about this. From an advanced perspective, we need to consider scalability, maintainability, and long-term impact. I recommend we start with a clean architecture pattern that embodies both technical excellence and our values of Earth Care, People Care, and Fair Share."
        elif "code" in last_message:
            return "As Jaguar Pro, I'll help you with advanced coding solutions. Let's create something that's not just technically sound, but also sustainable and beneficial for the community. What specific technical challenge are you facing?"
        else:
            return "Hello! I'm Jaguar Pro, your advanced AI agent. I bring deep technical wisdom and strategic thinking to help you solve complex challenges while staying true to our regenerative values. What can we build together?"
    
    elif model == "codewriter:latest":
        if "bug" in last_message or "error" in last_message:
            return "I see you're facing a technical issue. As CodeWriter, I focus on clean, efficient solutions. Let's debug this systematically - can you share the specific error message and relevant code? I'll help you identify the root cause and implement a robust fix."
        elif "optimize" in last_message or "performance" in last_message:
            return "Performance optimization is my specialty! Let's analyze your code for bottlenecks and inefficiencies. I'll help you implement clean, fast solutions that follow best practices. What specific performance issues are you experiencing?"
        else:
            return "Hi there! I'm CodeWriter, your technical excellence companion. I specialize in writing clean, efficient, and maintainable code. Ready to create something amazing together?"
    
    else:  # jaguar (default)
        return f"Hello! I'm Jaguar, your AI developer agent. I'm here to help you with coding, workflows, and mentoring while keeping our values of Earth Care, People Care, and Fair Share at the center. I understand you mentioned: '{user_messages[-1].content[:100]}...' - how can I assist you with this?"

async def generate_streaming_response(messages: List[ChatMessage], model: str, request_id: str) -> AsyncGenerator[str, None]:
    """
    Generate a streaming chat response.
    """
    response_text = generate_chat_response(messages, model)
    words = response_text.split()
    
    # Stream the response word by word
    for i, word in enumerate(words):
        chunk_data = {
            "id": request_id,
            "object": "chat.completion.chunk",
            "created": int(time.time()),
            "model": model,
            "choices": [{
                "index": 0,
                "delta": {
                    "content": word + " " if i < len(words) - 1 else word
                },
                "finish_reason": None
            }]
        }
        
        yield f"data: {json.dumps(chunk_data)}\n\n"
        
        # Add slight delay for realistic streaming
        await asyncio.sleep(0.05)
    
    # Send final chunk
    final_chunk = {
        "id": request_id,
        "object": "chat.completion.chunk", 
        "created": int(time.time()),
        "model": model,
        "choices": [{
            "index": 0,
            "delta": {},
            "finish_reason": "stop"
        }]
    }
    
    yield f"data: {json.dumps(final_chunk)}\n\n"
    yield "data: [DONE]\n\n"

# Chat Completion Endpoints
@app.post("/api/chat/completions", operation_id="create_chat_completion")
async def create_chat_completion(request: ChatCompletionRequest):
    """
    Create a chat completion, compatible with OpenAI API format.
    Supports both streaming and non-streaming responses.
    """
    
    # Validate model
    if request.model not in MODEL_CONFIGS:
        raise HTTPException(
            status_code=400, 
            detail=f"Model '{request.model}' not supported. Available models: {list(MODEL_CONFIGS.keys())}"
        )
    
    request_id = f"chatcmpl-{uuid.uuid4().hex[:29]}"
    created = int(time.time())
    
    if request.stream:
        # Return streaming response
        return StreamingResponse(
            generate_streaming_response(request.messages, request.model, request_id),
            media_type="text/plain",
            headers={"Cache-Control": "no-cache"}
        )
    else:
        # Return non-streaming response
        response_content = generate_chat_response(request.messages, request.model)
        
        response = ChatCompletionResponse(
            id=request_id,
            created=created,
            model=request.model,
            choices=[ChatCompletionChoice(
                index=0,
                message=ChatMessage(role="assistant", content=response_content),
                finish_reason="stop"
            )]
        )
        
        return response

@app.get("/api/models", operation_id="list_models")
async def list_models():
    """
    List available models, compatible with OpenAI API format.
    """
    models = []
    for model_id, config in MODEL_CONFIGS.items():
        models.append({
            "id": model_id,
            "object": "model",
            "created": int(time.time()),
            "owned_by": "ai-open-agents",
            "permission": [],
            "root": model_id,
            "parent": None,
            "description": config["description"]
        })
    
    return {"object": "list", "data": models}

# Add more endpoints as needed for NextCloud and WordPress integration

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
