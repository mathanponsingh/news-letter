from fastapi import FastAPI
from routes.router import router as router

# Use app to access the FastAPI 
app = FastAPI()


app.include_router(router)