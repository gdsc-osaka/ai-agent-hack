import io

from fastapi import FastAPI, File, UploadFile, HTTPException

from model.inference import Dlib_api

app = FastAPI()

embedding_client = Dlib_api()

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

@app.post("/face-embedding")
async def upload_file(
    file: UploadFile = File(...),
):
    try:
        file_content = await file.read()
        file_like = io.BytesIO(file_content)
        
        embedding = embedding_client.embedding(file_like)
        
        return {
            "embedding": embedding.tolist()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
