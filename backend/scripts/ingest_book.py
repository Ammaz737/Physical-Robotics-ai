import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient, models
import cohere
import markdown
import re

# Load environment variables
load_dotenv(override=True)
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")

if not all([COHERE_API_KEY, QDRANT_URL, QDRANT_API_KEY]):
    raise ValueError("Missing one or more environment variables: COHERE_API_KEY, QDRANT_URL, QDRANT_API_KEY")

# Initialize clients
co = cohere.Client(COHERE_API_KEY)
qdrant_client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

COLLECTION_NAME = "textbook_knowledge"
EMBEDDING_MODEL = "embed-english-v3.0"
EMBEDDING_DIMENSION = 1024 # Cohere v3 embeddings are 1024-dimensional

def create_qdrant_collection():
    """Creates a Qdrant collection if it doesn't already exist."""
    current_collections = qdrant_client.get_collections().collections
    if not any(c.name == COLLECTION_NAME for c in current_collections):
        qdrant_client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=models.VectorParams(size=EMBEDDING_DIMENSION, distance=models.Distance.COSINE),
        )
        print(f"Collection '{COLLECTION_NAME}' created.")
    else:
        print(f"Collection '{COLLECTION_NAME}' already exists.")

def chunk_markdown_by_headers(markdown_content: str, source_path: str):
    """
    Chunks markdown content based on H1 and H2 headers.
    Returns a list of dictionaries with 'content' and 'metadata'.
    """
    chunks = []
    # Split by H1 or H2 headers
    # Using re.split to keep the delimiters (headers) as part of the chunk
    split_content = re.split(r'(#\s.*)|(##\s.*)', markdown_content)
    
    current_chunk_content = ""
    current_section_title = "Introduction"
    
    # The split_content will contain empty strings or None values due to the regex group capture
    # We need to filter those out and process the actual content and headers
    filtered_content = [item for item in split_content if item is not None and item.strip() != '']

    for item in filtered_content:
        if item.startswith('# '): # H1 header
            if current_chunk_content.strip():
                chunks.append({
                    "content": current_chunk_content.strip(),
                    "metadata": {"source": source_path, "section": current_section_title}
                })
            current_section_title = item.lstrip('# ').strip()
            current_chunk_content = item + "\n" # Include header in the chunk
        elif item.startswith('## '): # H2 header
            if current_chunk_content.strip():
                chunks.append({
                    "content": current_chunk_content.strip(),
                    "metadata": {"source": source_path, "section": current_section_title}
                })
            current_section_title = item.lstrip('## ').strip()
            current_chunk_content = item + "\n" # Include header in the chunk
        else:
            current_chunk_content += item + "\n"
    
    if current_chunk_content.strip():
        chunks.append({
            "content": current_chunk_content.strip(),
            "metadata": {"source": source_path, "section": current_section_title}
        })
    
    return chunks

def process_and_ingest_document(file_path: str):
    """Reads a markdown file, chunks it, generates embeddings, and ingests into Qdrant."""
    print(f"Processing {file_path}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        markdown_content = f.read()

    chunks = chunk_markdown_by_headers(markdown_content, file_path)
    
    if not chunks:
        print(f"No chunks found in {file_path}. Skipping.")
        return

    # Prepare texts for embedding and collect metadata
    texts_to_embed = [chunk["content"] for chunk in chunks]
    metadatas = [chunk["metadata"] for chunk in chunks]

    # Generate embeddings in batches if necessary (Cohere has rate limits and max input tokens)
    # For simplicity, we'll do it all at once here, but for larger docs, batching is recommended.
    print(f"Generating {len(texts_to_embed)} embeddings for {file_path}...")
    
    response = co.embed(
        texts=texts_to_embed,
        model=EMBEDDING_MODEL,
        input_type="search_document"
    )
    embeddings = response.embeddings

    points = []
    for i, embedding in enumerate(embeddings):
        points.append(
            models.PointStruct(
                id=hash(f"{file_path}-{{metadatas[i]['section']}}-{{i}}") % (2**63 - 1), # Simple hash for ID
                vector=embedding,
                payload={"text": texts_to_embed[i], **metadatas[i]},
            )
        )
    
    print(f"Upserting {len(points)} points to Qdrant for {file_path}...")
    operation_info = qdrant_client.upsert(
        collection_name=COLLECTION_NAME,
        wait=True,
        points=points
    )
    print(operation_info)
    print(f"Finished processing {file_path}.")

def main():
    create_qdrant_collection()

    docs_path = "physical-ai-textbook/docs"
    for root, _, files in os.walk(docs_path):
        for file in files:
            if file.endswith(".md") or file.endswith(".mdx"):
                file_path = os.path.join(root, file)
                process_and_ingest_document(file_path)
    
    print("\nIngestion complete!")
    print(f"Total points in collection '{COLLECTION_NAME}': {qdrant_client.count(collection_name=COLLECTION_NAME, exact=True).count}")

if __name__ == "__main__":
    main()
