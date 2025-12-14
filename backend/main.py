from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router as SubscriptionRouter

app = FastAPI()
@app.get("/subscription")
def get_subscriptions():
    return {
        "data": []
    }

origins = [
    "http://localhost:5173", # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(SubscriptionRouter, tags=["Subscription"], prefix="/subscription")

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to SubTrack API"}


import os

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))