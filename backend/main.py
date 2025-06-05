from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import ChatRequest, ChatResponse
from utils import get_history, add_to_history
from rag import retrieve_chunks, build_prompt, call_llm
import json

app = FastAPI()

# CORS middleware to allow frontend requests
origins = [
    "https://final-rag.vercel.app"
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://ominous-enigma-vxqp775j77jfx65r-3000.app.github.dev",
    "https://final-rag-rawashivanshis-projects.vercel.app",
    "https://final-rag-cl23.onrender.com", 
    "https://final-kk8fdc0i9-rawashivanshis-projects.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Mahabharata RAG API is running"}

@app.get("/characters")
async def get_characters():
    """Get available characters for character mode"""
    try:
        with open("character_profiles.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        return [{"name": k, "description": v.get("summary", "")} for k, v in data.items()]
    except FileNotFoundError:
        return [
            {"name": "Karna", "description": "Generous warrior"},
            {"name": "Krishna", "description": "Divine guide"},
            {"name": "Arjuna", "description": "Skilled archer"},
            {"name": "Draupadi", "description": "Powerful queen"},
            {"name": "Bhishma", "description": "Grand patriarch"},
            {"name": "Yudhishthira", "description": "King of dharma"},
            {"name": "Duryodhana", "description": "Rival king"}
        ]

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    history = get_history(req.session_id)
    retrieved_chunks = retrieve_chunks(req.message)
    
    if not retrieved_chunks:
        prompt = build_prompt(req.message, history, req.mode, req.character, None)
        confidence = 0.0
        sources = None
    else:
        prompt = build_prompt(req.message, history, req.mode, req.character, retrieved_chunks)
        confidence = max(chunk.get("similarity_score", 0.0) for chunk in retrieved_chunks)
        sources = [
            {
                "title": chunk.get("document_title", "Mahabharata"),
                "source": f"Page {chunk.get('page_number', 'Unknown')}",
                "isWebSource": False
            }
            for chunk in retrieved_chunks
        ]
    
    response = call_llm(prompt)
    add_to_history(req.session_id, f"User: {req.message}")
    add_to_history(req.session_id, f"Bot: {response}")
    
    return ChatResponse(
        response=response,
        character=req.character if req.mode == "character" else None,
        confidenceScore=confidence,
        sources=sources
    )
