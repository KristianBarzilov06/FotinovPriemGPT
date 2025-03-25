from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_community.document_loaders.merge import MergedDataLoader
from pprint import pprint

from backend.chat import ask_question
import backend.embedder as embedder

loader_pravilnik = PyPDFLoader(
    file_path="PDU_23-24 актуал.pdf"
)

loader_priem = TextLoader(
    file_path="message.txt", encoding='UTF-8'
)

loader_all = MergedDataLoader(loaders=[loader_pravilnik, loader_priem])

docs_all = loader_all.load_and_split()

# Preparing the data by extracting the text content from each page and putting it into a list of strings.
# Each string represents a discrete piece of text to be embedded.
docs_contents = [i.page_content for i in docs_all]

# Call the embed_stuff function with the extracted page contents
embedder.embed_stuff(docs_contents)

user_question = input("User Input: ")

while user_question != "quit":
    answer = ask_question(user_question)
    print(answer)

    user_question = input("User Input: ")

print("Goodbye!")