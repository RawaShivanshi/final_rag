import os
import json
from typing import List, Dict, Optional
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

# Debug prints
print("TOGETHER_API_KEY from env:", os.getenv("TOGETHER_API_KEY"))

# Initialize Sentence Transformers model (same as ingestion)
print("Loading sentence-transformers model for retrieval...")
embedding_model = SentenceTransformer("intfloat/e5-base-v2")

# Try to import required packages with fallbacks
try:
    from pinecone import Pinecone
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False
    print("Warning: Pinecone not available")

try:
    from together import Together
    TOGETHER_AVAILABLE = True
except ImportError:
    TOGETHER_AVAILABLE = False
    print("Warning: Together AI not available")

try:
    import cohere
    COHERE_AVAILABLE = True
except ImportError:
    COHERE_AVAILABLE = False
    print("Warning: Cohere not available")

# Initialize Pinecone if available
if PINECONE_AVAILABLE:
    try:
        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        index = pc.Index("mahabharat")
        print("Pinecone initialized successfully")
    except Exception as e:
        print(f"Warning: Could not initialize Pinecone: {e}")
        PINECONE_AVAILABLE = False

# Load character profiles with proper error handling
CHARACTER_PROFILES = {}
try:
    with open("character_profiles.json", "r", encoding="utf-8") as f:
        content = f.read().strip()
        if content:
            CHARACTER_PROFILES = json.loads(content)
            print(f"Loaded {len(CHARACTER_PROFILES)} character profiles")
        else:
            raise FileNotFoundError("Empty file")
except (FileNotFoundError, json.JSONDecodeError) as e:
    print(f"Warning: Could not load character_profiles.json ({e}), using fallback profiles")
    # Fallback character profiles
    CHARACTER_PROFILES = {
        "Karna": {
            "persona_prompt": "Respond as Karna: noble, generous, proud, and fiercely loyal to Duryodhana.",
            "traits": ["Generous", "Loyal", "Courageous", "Proud"],
            "summary": "Karna, son of Kunti and Surya, is known for his unwavering loyalty and generosity."
        },
        "Krishna": {
            "persona_prompt": "Respond as Krishna: wise, compassionate, strategic, and divine guide.",
            "traits": ["Wise", "Compassionate", "Strategic", "Divine"],
            "summary": "Krishna, the divine guide, is known for his wisdom and compassion."
        },
        "Arjuna": {
            "persona_prompt": "Respond as Arjuna: skilled archer, devoted student, conflicted warrior.",
            "traits": ["Skilled", "Devoted", "Conflicted", "Noble"],
            "summary": "Arjuna, the great archer, is known for his skill and moral dilemmas."
        },
        "Draupadi": {
            "persona_prompt": "Respond as Draupadi: strong, intelligent, proud, and seeking justice.",
            "traits": ["Strong", "Intelligent", "Proud", "Justice-seeking"],
            "summary": "Draupadi, the queen of the Pandavas, is known for her strength and quest for justice."
        },
        "Bhishma": {
            "persona_prompt": "Respond as Bhishma: wise grandfather, bound by vows, tragic figure.",
            "traits": ["Wise", "Honorable", "Bound by duty", "Tragic"],
            "summary": "Bhishma, the grand patriarch, is known for his wisdom and unwavering commitment to his vows."
        },
        "Yudhishthira": {
            "persona_prompt": "Respond as Yudhishthira: righteous king, follower of dharma, sometimes conflicted.",
            "traits": ["Righteous", "Dharmic", "Just", "Sometimes naive"],
            "summary": "Yudhishthira, the eldest Pandava, is known for his commitment to dharma and righteousness."
        },
        "Duryodhana": {
            "persona_prompt": "Respond as Duryodhana: proud prince, jealous of Pandavas, believes in his righteousness.",
            "traits": ["Proud", "Jealous", "Strong-willed", "Ambitious"],
            "summary": "Duryodhana, the Kaurava prince, is known for his pride and rivalry with the Pandavas."
        }
    }

def retrieve_chunks(query: str, top_k: int = 5) -> List[Dict]:
    """Retrieve relevant chunks from Pinecone using sentence transformers"""
    if not PINECONE_AVAILABLE:
        print("Pinecone not available, returning empty chunks")
        return []
    
    try:
        # Generate embedding for the query using same model as ingestion
        query_vector = embedding_model.encode([query])[0]
        
        # Query Pinecone
        results = index.query(
            vector=query_vector.tolist(),
            top_k=top_k,
            include_metadata=True
        )
        
        # Extract metadata from results with source information
        chunks = []
        for match in results.get('matches', []):
            if 'metadata' in match:
                chunk_data = match['metadata']
                # Add similarity score for ranking
                chunk_data['similarity_score'] = match.get('score', 0.0)
                chunks.append(chunk_data)
        
        print(f"Retrieved {len(chunks)} chunks from Pinecone")
        return chunks
    except Exception as e:
        print(f"Error retrieving chunks: {e}")
        return []

def build_prompt(message: str, history: List[str], mode: str, character: Optional[str] = None, retrieved_chunks: Optional[List[Dict]] = None) -> str:
    """Build the prompt for the LLM with character persona handling"""
    prompt_parts = []
    
    # Add character persona if in character mode
    if mode == "character" and character and character in CHARACTER_PROFILES:
        character_data = CHARACTER_PROFILES[character]
        persona = character_data['persona_prompt']
        traits = ", ".join(character_data['traits'])
        
        prompt_parts.append(f"CHARACTER PERSONA: {persona}")
        prompt_parts.append(f"CHARACTER TRAITS: {traits}")
        prompt_parts.append("You must respond in character, staying true to this persona throughout your response.")
        prompt_parts.append("")
    
    # Add chat history if available
    if history:
        prompt_parts.append("CHAT HISTORY:")
        for hist_msg in history[-5:]:  # Last 5 messages
            prompt_parts.append(hist_msg)
        prompt_parts.append("")
    
    # Add retrieved context if available
    if retrieved_chunks:
        prompt_parts.append("RELEVANT CONTEXT FROM MAHABHARATA:")
        for i, chunk in enumerate(retrieved_chunks):
            # Include source information for citation
            page_info = chunk.get('page_number', 'Unknown')
            source_text = f"[Source: Page {page_info}]"
            
            if 'summary' in chunk:
                prompt_parts.append(f"{i+1}. {chunk['summary']} {source_text}")
            elif 'text' in chunk:
                prompt_parts.append(f"{i+1}. {chunk['text'][:200]}... {source_text}")
        prompt_parts.append("")
    
    # Add the user's message
    prompt_parts.append(f"USER QUESTION: {message}")
    prompt_parts.append("")
    
    # Different instructions based on mode
    if mode == "character" and character:
        prompt_parts.append(f"Please respond as {character} based on the Mahabharata context provided above. Stay in character and provide insights from {character}'s perspective.")
    else:
        prompt_parts.append("Please provide a helpful and accurate response based on the Mahabharata context provided above. Include source references when possible.")
    
    return "\n".join(prompt_parts)

def call_llm(prompt: str) -> str:
    """Call the LLM API to generate a response, with fallback to Cohere if Together fails"""
    # Try Together AI first
    if TOGETHER_AVAILABLE and os.getenv("TOGETHER_API_KEY"):
        try:
            client = Together(api_key=os.getenv("TOGETHER_API_KEY"))
            response = client.chat.completions.create(
                model="meta-llama/Llama-3-70b-chat-hf",
                messages=[
                    {"role": "system", "content": "You are an expert on the Mahabharata. Provide accurate, helpful responses based on the epic. When responding as a character, stay true to their personality and perspective."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=512,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Together API: {e}")
            # Fallback to Cohere if available
            if COHERE_AVAILABLE and os.getenv("COHERE_API_KEY"):
                try:
                    co = cohere.Client(os.getenv("COHERE_API_KEY"))
                    co_response = co.generate(
                        model="command-r-plus",
                        prompt=prompt,
                        max_tokens=512,
                        temperature=0.7
                    )
                    return co_response.generations[0].text
                except Exception as e2:
                    print(f"Error calling Cohere API: {e2}")
                    return f"I apologize, but I'm having trouble accessing the AI services. Errors: Together: {str(e)}, Cohere: {str(e2)}"
            else:
                return f"I apologize, but I'm having trouble accessing the AI service. Error: {str(e)}"
    # If Together is not available, try Cohere
    elif COHERE_AVAILABLE and os.getenv("COHERE_API_KEY"):
        try:
            co = cohere.Client(os.getenv("COHERE_API_KEY"))
            co_response = co.generate(
                model="command-r-plus",
                prompt=prompt,
                max_tokens=512,
                temperature=0.7
            )
            return co_response.generations[0].text
        except Exception as e:
            print(f"Error calling Cohere API: {e}")
            return f"I apologize, but I'm having trouble accessing the Cohere AI service. Error: {str(e)}"
    else:
        return "No AI service is available. Please check your API configuration."