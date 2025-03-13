from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.chat import ask_question
from pydantic import BaseModel

class QuestionQueryModel(BaseModel):
    question: str

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for better security if needed
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define a POST endpoint to handle incoming questions
@app.post("/ask")
async def ask(question: QuestionQueryModel):
    item_dict = question.dict()
    response = ask_question(item_dict["question"])
    return JSONResponse(content={"response": response})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)