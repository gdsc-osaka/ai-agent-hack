import { Hono } from "hono";
import { FieldValue } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";
import vectorRoute from "./vector.route";
import createFirebaseApp from "../firebase"
import env from "../env";
import { register } from "module";

const app = new Hono();

type ResponseType = {
    embedding: number[][];
};

app.post("/face-auth", vectorRoute.authenticateFace, async (c) => {
  const formData = await c.req.formData();
  const image = formData.get("image") as File | null;
  if (!image) {
    return c.json({ error: "No image provided" }, 400);
  }

  const forwardForm = new FormData();
  forwardForm.append("file", image, image.name);

  const response = await fetch("http://localhost:8000/face-embedding", {
    method: "POST",
    body: forwardForm,
  });

  const result: ResponseType = await response.json();

  const userId = await authenticateFace(result.embedding[0])

  if (!userId) {
    return c.json({
        error: "Unauthorized Face",
    }, 403);
  }

  // TODO: RDBにクエリして客の情報を取得する
  return c.json({
    userId: userId,
  });
});

const registerEmbedding = async (embedding: number[]): Promise<void> => {
    const app = createFirebaseApp(env.FIRE_SA);
    const firestore = app.firestore();
    
    await firestore.collection("embeddings").doc(uuidv4()).set({
        value: FieldValue.vector(embedding),
        timestamp: new Date().toISOString(),
    });
}

const authenticateFace = async (embedding: number[]): Promise<string | null> => {
    const app = createFirebaseApp(env.FIRE_SA);
    const firestore = app.firestore();
    
    const snapshot = await firestore.collection("embeddings").findNearest({
        vectorField: "value",
        queryVector: FieldValue.vector(embedding),
        limit: 1,
        distanceMeasure: "COSINE",
        distanceThreshold: 0.7,
        distanceResultField: "vectorDistance"
    }).get()

    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0].id;
}

export default app;
