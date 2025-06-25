import { ok, err, ResultAsync } from "neverthrow";
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
      // 開発環境でMLサーバーが利用できない場合のモック実装
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock face embedding for development');
        // ダミーの128次元ベクトルを返す
        return Array.from({ length: 128 }, () => Math.random() - 0.5);
      }

      const forwardForm = new FormData();
      forwardForm.append("file", image, image.name);

      const res = await fetch(`${env.ML_SERVER_URL}/face-embedding`, {
        method: "POST",
        body: forwardForm,
      });

      if (!res.ok) {
        throw new Error(`ML server error: ${res.status} ${res.statusText}`);
      }

      const result = (await res.json()) as EmbeddingResponse;
      return result.embedding[0];
    })(),
    FaceEmbeddingError.handle
  ).andThen((embedding) => ok(embedding));
