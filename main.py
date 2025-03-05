from langchain_community.document_loaders import PyPDFLoader, TextLoader
from pprint import pprint

from chat import ask_question
import embedder

textLoader = TextLoader(
    file_path="message.txt",
)

textPages = textLoader.load_and_split()

# print(pages[1].page_content)

# Preparing the data by extracting the text content from each page and putting it into a list of strings.
# Each string represents a discrete piece of text to be embedded.
text_contents = [text.page_content for text in textPages]

# Call the embed_stuff function with the extracted page contents
embedder.embed_stuff(text_contents)

# results = embedder.search_embed("Какви специалности има?")
# pprint(results)

ask_question("Какви паралелки има?")