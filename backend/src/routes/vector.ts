import { Hono } from "hono";
import { FieldValue } from "firebase-admin/firestore";
import { createId } from "@paralleldrive/cuid2";
import vectorRoute from "./vector.route";
import createFirebaseApp from "../firebase";
import env from "../env";

const app = new Hono();

type EmbeddingResponse = {
  embedding: number[][];
};

app.post("/face-auth", vectorRoute.authenticateFace, async (c) => {
  const formData = await c.req.formData();
  const image = formData.get("image") as File | null;
  if (!image) {
    return c.json({ error: "No image provided" }, 400);
  }

  const embedding = await getFeceEmbedding(image);

  const userId = await authenticateFace(embedding);

  if (!userId) {
    return c.json(
      {
        error: "Unauthorized Face",
      },
      403
    );
  }

  // TODO: RDBにクエリして客の情報を取得する
  return c.json({
    userId: userId,
  });
});

app.post("/face", vectorRoute.registerFace, async (c) => {
  const formData = await c.req.formData();
  const image = formData.get("image") as File | null;
  if (!image) {
    return c.json({ error: "No image provided" }, 400);
  }

  const embedding = await getFeceEmbedding(image);

  const userId = await registerEmbedding(embedding);

  //TODO: RDBにもuserIdを登録する
  return c.json({ userId: userId }, 201);
});

const registerEmbedding = async (embedding: number[]): Promise<string> => {
  const app = createFirebaseApp(env.FIRE_SA);
  const firestore = app.firestore();

  const userId = createId();
  await firestore
    .collection("embeddings")
    .doc(userId)
    .set({
      value: FieldValue.vector(embedding),
      created_at: new Date().toISOString(),
    });

  return userId;
};

const authenticateFace = async (
  embedding: number[]
): Promise<string | null> => {
  const app = createFirebaseApp(env.FIRE_SA);
  const firestore = app.firestore();

  const snapshot = await firestore
    .collection("embeddings")
    .findNearest({
      vectorField: "value",
      queryVector: FieldValue.vector(embedding),
      limit: 1,
      distanceMeasure: "COSINE",
      distanceThreshold: 0.7,
      distanceResultField: "vectorDistance",
    })
    .get();

  if (snapshot.empty) {
    return null;
  }
  return snapshot.docs[0].id;
};

const getFeceEmbedding = async (image: File): Promise<number[]> => {
  const forwardForm = new FormData();
  forwardForm.append("file", image, image.name);
  const response = await fetch(`${env.ML_SERVER_URL}/face-embedding`, {
    method: "POST",
    body: forwardForm,
  });
  if (!response.ok) {
    throw new Error("Failed to get face embedding");
  }
  const result: EmbeddingResponse = await response.json();
  return result.embedding[0];
};

export default app;
