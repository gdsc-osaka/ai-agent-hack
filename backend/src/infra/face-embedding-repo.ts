import { ok, ResultAsync } from "neverthrow";
import { FaceEmbeddingError } from "./face-embedding-repo.error";
import env from "../env";

export type GetFaceEmbedding = (
  image: File
) => ResultAsync<number[], FaceEmbeddingError>;

type EmbeddingResponse = {
  embedding: number[][];
};

export const getFaceEmbedding: GetFaceEmbedding = (image: File) =>
  ResultAsync.fromPromise(
    (async () => {
      const forwardForm = new FormData();
      forwardForm.append("file", image, image.name);

      const res = await fetch(`${env.ML_SERVER_URL}/face-embedding`, {
        method: "POST",
        body: forwardForm,
      });

      const result = (await res.json()) as EmbeddingResponse;
      return result.embedding[0];
    })(),
    FaceEmbeddingError.handle
  ).andThen((embedding) => ok(embedding));
