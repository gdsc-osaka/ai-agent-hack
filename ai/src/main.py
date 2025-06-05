import os

import uvicorn

from model.inference import Dlib_api


def embedding_test():
    dlib_api = Dlib_api()

    image_path1 = "./src/model/images/1.webp"
    image_path2 = "./src/model/images/2.webp"
    image_path3 = "./src/model/images/3.webp"
    image_path4 = "./src/model/images/4.webp"

    image_list = [image_path1, image_path2, image_path3, image_path4]

    embeddings = []

    for image_path in image_list:
        embedding = dlib_api.embedding(image_path)
        embeddings.append(embedding)

    for i in range(len(embeddings)-1):
        similarity = dlib_api.cosine_similarity(embeddings[0], embeddings[i+1])
        print(f"Similarity between {image_list[0]} and {image_list[i+1]}: {similarity}")


if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        port=8080,
        host="0.0.0.0",
        workers=1,
        reload=os.getenv("ENV", "prod") == "dev"
    )
    