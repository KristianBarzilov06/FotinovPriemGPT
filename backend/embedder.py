import logging
import hashlib
import os
import tiktoken
import chromadb

from dotenv import load_dotenv
load_dotenv()

CHROMA_DIR = "./db-pages-load_and_split_large/"
COLLECTION_NAME = "pravilnik_large"

def embed_stuff(data):
    # Setting up a database client hard drive
    chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)
    # The collection is a specific dataset within the database.
    # If it doesn’t already exist, it’s created using the COLLECTION_NAME
    collection = chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        # The embedding_function is a predefined method that transforms text data into a numerical format
        # that LLMs can understand, specifically using the text embedding model from OpenAI.
        embedding_function=chromadb.utils.embedding_functions.OpenAIEmbeddingFunction(
            api_key=os.environ.get('OPENAI_API_KEY'),
            # The text embedding model is designed to convert text into numerical vectors, known as embeddings.
            # These embeddings capture the semantic meaning of the text in a way that can be processed.
            model_name="text-embedding-3-large"
        )
    )

    # Before adding any new data, the code checks if the collection already has data.
    # If it’s not empty, it means the embedding process has already been done, so there’s no need to repeat it.
    if collection.count() == 0:
        #  If the collection is empty, a new hasher instance is created
        hasher = hashlib.md5()
        # Then the code iterates over the data (which is presumably a list of text items).
        for item in data:
            # It logs the embedding action.
            logging.info(f"Embedding {item}")
            # It creates a unique identifier for the item using hashlib.md5(),
            # which is a hashing function that generates a fixed-size string from the input text.
            # This is useful for creating a unique ID for each piece of data.
            hasher.update(item.encode())
            # It then adds the item to the collection with the generated ID
            # with a single None for metadatas to match the ids list
            collection.add(metadatas=[None], documents=[item], ids=[hasher.hexdigest()])
    else:
        logging.info("Collection is not empty. Skipping embedding.")


def search_embed(question):
    chroma_client = chromadb.PersistentClient(path=CHROMA_DIR)
    collection = chroma_client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=chromadb.utils.embedding_functions.OpenAIEmbeddingFunction(
            api_key=os.environ.get('OPENAI_API_KEY'),
            model_name="text-embedding-3-large"
        )
    )
    return collection.query(query_texts=[question], n_results=3)


def calculate_tokens(text):
    my_encoder = tiktoken.encoding_for_model("gpt-4-turbo")
    return len(my_encoder.encode(text))