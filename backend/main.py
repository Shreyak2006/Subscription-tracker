from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router as SubscriptionRouter

app = FastAPI()

origins = [
    "http://localhost:5173", # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(SubscriptionRouter, tags=["Subscription"], prefix="/subscription")

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to SubTrack API"}
