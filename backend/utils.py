import redis
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Redis connection
r = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"))

def get_history(session_id: str, limit: int = 10) -> list:
    """Get chat history for a session"""
    try:
        history = r.lrange(f"history:{session_id}", -limit, -1)
        return [h.decode() for h in history]
    except:
        # Fallback if Redis is not available
        return []

def add_to_history(session_id: str, message: str) -> None:
    """Add a message to chat history"""
    try:
        r.rpush(f"history:{session_id}", message)
        # Optional: Limit history to last 50 messages
        r.ltrim(f"history:{session_id}", -50, -1)
    except:
        # Fallback if Redis is not available
        pass
