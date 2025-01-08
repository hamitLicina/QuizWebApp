from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Veri modelleri
class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: int

# Örnek sorular
questions = [
    Question(
        id=1,
        question="Python'un yaratıcısı kimdir?",
        options=["Guido van Rossum", "James Gosling", "Brendan Eich", "Rasmus Lerdorf"],
        correct_answer=0
    ),
    Question(
        id=2,
        question="Hangisi bir Python web framework'ü değildir?",
        options=["Django", "Flask", "FastAPI", "Express"],
        correct_answer=3
    ),
    Question(
        id=3,
        question="Python'da bir liste metodunu seçin:",
        options=["push()", "append()", "add()", "insert[]"],
        correct_answer=1
    ),
    Question(
        id=4,
        question="Python hangi yılda geliştirilmiştir?",
        options=["1989", "1991", "1995", "2000"],
        correct_answer=1
    ),
    Question(
        id=5,
        question="Hangisi Python'da bir veri tipi değildir?",
        options=["integer", "float", "varchar", "string"],
        correct_answer=2
    )
]

@app.get("/questions")
async def get_questions():
    return questions

@app.get("/questions/{question_id}")
async def get_question(question_id: int):
    for question in questions:
        if question.id == question_id:
            return question
    raise HTTPException(status_code=404, detail="Soru bulunamadı")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 