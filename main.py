from langchain_community.document_loaders import PyPDFLoader, TextLoader
from pprint import pprint

from chat import ask_question
import embedder

pdfLoader = PyPDFLoader(
    file_path="PDU_23-24 актуал.pdf"
)

textLoader = TextLoader(
    file_path="message.txt",
)

pravilnikTextLoader = TextLoader(
    file_path="PDU_23-24 актуал.txt"
)

pdfPages = pdfLoader.load_and_split()
# pdfPages = pravilnikTextLoader.load_and_split()
textPages = textLoader.load_and_split()

# print(pages[1].page_content)

# Preparing the data by extracting the text content from each page and putting it into a list of strings.
# Each string represents a discrete piece of text to be embedded.
pdfContents = [page.page_content for page in pdfPages]
textContents = [text.page_content for text in textPages]

# Call the embed_stuff function with the extracted page contents
embedder.embed_stuff(textContents)

# results = embedder.search_embed("Какви специалности има?")
# pprint(results)

user_question = input("User Input: ")

while user_question != "quit":
    ask_question(user_question)
    user_question = input("User Input: ")

print("Goodbye!")