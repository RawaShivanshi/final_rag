from pydantic import BaseModel
from typing import Optional, List

class Source(BaseModel):
    title: str
    source: str
    isWebSource: bool
    url: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    mode: str  # 'ai' or 'character'
    character: Optional[str] = None
    session_id: str

class ChatResponse(BaseModel):
    response: str
    character: Optional[str] = None
    confidenceScore: Optional[float] = None
    sources: Optional[List[Source]] = None
