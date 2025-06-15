import { Hono } from "hono";
import { FieldValue } from "firebase-admin/firestore";
import { createId } from "@paralleldrive/cuid2";
import conn from "../db/db";
import { customers } from "../db/schema/customers";
import { eq } from "drizzle-orm";
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

  const customerId = await authenticateFace(embedding);

  if (!customerId) {
    return c.json(
      {
        error: "Unauthorized Face",
      },
      403
    );
  }

  const customer = await findCustomerById(customerId);

  return c.json({
    customerId: customer.id,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
  });
});

app.post("/face", vectorRoute.registerFace, async (c) => {
  const formData = await c.req.formData();
  const image = formData.get("image") as File | null;
  if (!image) {
    return c.json({ error: "No image provided" }, 400);
  }

  const embedding = await getFeceEmbedding(image);

  const customerId = await registerEmbedding(embedding);

  const customer = await createCustomer(customerId);

  return c.json(
    {
      customerId: customer.id,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    },
    201
  );
});

const registerEmbedding = async (embedding: number[]): Promise<string> => {
  const app = createFirebaseApp(env.FIRE_SA);
  const firestore = app.firestore();

  const customerId = createId();
  await firestore
    .collection("embeddings")
    .doc(customerId)
    .set({
      value: FieldValue.vector(embedding),
      created_at: new Date().toISOString(),
    });

  return customerId;
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
  const result: EmbeddingResponse =
    (await response.json()) as EmbeddingResponse;
  return result.embedding[0];
};

export const findCustomerById = async (id: string) => {
  const result = await conn
    .select()
    .from(customers)
    .where(eq(customers.id, id));
  return result[0] ?? null;
};

export const createCustomer = async (id: string) => {
  const [customer] = await conn.insert(customers).values({ id }).returning();
  return customer;
};

export default app;
