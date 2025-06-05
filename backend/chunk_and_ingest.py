import os
from pathlib import Path
import pdfplumber
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import numpy as np

# Load .env with explicit path
env_path = Path(__file__).parent / '.env'
print(f"Loading .env from: {env_path}")
print(f".env file exists: {env_path.exists()}")
load_dotenv(dotenv_path=env_path, override=True)

# Initialize Pinecone
pinecone_api_key = os.getenv("PINECONE_API_KEY")
if not pinecone_api_key:
    print("ERROR: PINECONE_API_KEY is missing from .env")
    exit(1)

pc = Pinecone(api_key=pinecone_api_key)
index_name = "mahabharat"

# Ensure index exists with correct dimension (1024)
try:
    existing_indexes = [idx.name for idx in pc.list_indexes()]
    if index_name not in existing_indexes:
        print(f"Creating index '{index_name}' with dimension 1024...")
        pc.create_index(
            name=index_name,
            dimension=1024,  # e5-base-v2 outputs 1024 dimensions
            metric='cosine',
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'
            )
        )
        print("Index created successfully!")
    else:
        print(f"Index '{index_name}' already exists")
except Exception as e:
    print(f"Error with Pinecone: {e}")
    exit(1)

index = pc.Index(index_name)

# Prepare data folder and PDF path
data_folder = Path(__file__).parent / "data"
data_folder.mkdir(exist_ok=True)
pdf_path = data_folder / "mahabharata.pdf"
if not pdf_path.exists():
    print(f"Error: {pdf_path} not found. Please place your Mahabharata PDF in the data folder.")
    exit(1)

print("Extracting text from PDF...")
text = ""
page_metadata = []  # Store page info for better source citation

with pdfplumber.open(pdf_path) as pdf:
    total_pages = len(pdf.pages)
    for i, page in enumerate(pdf.pages):
        page_text = page.extract_text()
        if page_text:
            # Store page start position for source tracking
            page_start = len(text)
            text += page_text + "\n"
            page_metadata.append({
                'page_num': i + 1,
                'start_char': page_start,
                'end_char': len(text)
            })
        if i % 50 == 0:
            print(f"Processed {i}/{total_pages} pages...")

print(f"Extracted {len(text)} characters from PDF")

# Enhanced chunking with better metadata
print("Chunking text...")
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000, 
    chunk_overlap=100,
    separators=["\n\n", "\n", ". ", " ", ""]  # Better text splitting
)
chunks = splitter.split_text(text)
print(f"Created {len(chunks)} chunks")

# Initialize Sentence Transformers model (1024-dim)
print("Loading sentence-transformers model (intfloat/e5-base-v2, 1024d)...")
model = SentenceTransformer("intfloat/e5-base-v2")

# Generate all embeddings in batches for efficiency
print("Generating embeddings...")
embeddings = model.encode(chunks, show_progress_bar=True, batch_size=32)

# Function to find which page a chunk belongs to
def get_chunk_page_info(chunk_text, original_text, page_metadata):
    # Find the chunk position in original text
    chunk_start = original_text.find(chunk_text)
    if chunk_start == -1:
        return {"page_num": "Unknown", "chapter": "Unknown"}
    
    # Find which page this chunk belongs to
    for page_info in page_metadata:
        if page_info['start_char'] <= chunk_start <= page_info['end_char']:
            return {"page_num": page_info['page_num']}
    
    return {"page_num": "Unknown"}

# Upload to Pinecone with enhanced metadata
print("Uploading embeddings and metadata to Pinecone...")
batch_size = 100
vectors_to_upsert = []

for i, (chunk, vector) in enumerate(zip(chunks, embeddings)):
    # Create enhanced summary
    summary = chunk[:200].strip()
    if len(chunk) > 200:
        summary += "..."
    
    # Get page information for source citation
    page_info = get_chunk_page_info(chunk, text, page_metadata)
    
    # Enhanced metadata for better source citation
    metadata = {
        "text": chunk,
        "summary": summary,
        "section": f"Section {i+1}",
        "chunk_id": i,
        "source": "Mahabharata",
        "page_number": page_info.get("page_num", "Unknown"),
        "document_title": "Mahabharata",
        "chunk_length": len(chunk),
        "embedding_model": "intfloat/e5-base-v2"
    }
    
    vectors_to_upsert.append((f"chunk-{i}", vector.tolist(), metadata))
    
    # Batch upsert for efficiency
    if len(vectors_to_upsert) >= batch_size or i == len(chunks) - 1:
        index.upsert(vectors=vectors_to_upsert)
        print(f"Uploaded {i+1}/{len(chunks)} chunks...")
        vectors_to_upsert = []

print(f"Successfully ingested {len(chunks)} chunks into Pinecone index '{index_name}'")
stats = index.describe_index_stats()
print(f"Index now contains {stats['total_vector_count']} vectors")
