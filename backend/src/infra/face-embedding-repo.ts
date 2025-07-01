import { ok, ResultAsync } from "neverthrow";
import { FaceEmbeddingError } from "./face-embedding-repo.error";
import env from "../env";
import { iife } from "../shared/func";
import { infraLogger } from "../logger";

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
      if (process.env.NODE_ENV === "development") {
        console.log("Using mock face embedding for development");
        // ダミーの128次元ベクトルを返す
        return Array.from({ length: 128 }, () => Math.random() - 0.5);
      }

      const forwardForm = new FormData();
      forwardForm.append("file", image, image.name);

      infraLogger("getFaceEmbedding").debug("Forwarding image to ML server", {
        url: `${env.ML_SERVER_URL}/face-embedding`,
      });

      const res = await iife(async () => {
        // if (env.NODE_ENV === "development") {
        // If ML server is running locally
        return fetch(`${env.ML_SERVER_URL}/face-embedding`, {
          method: "POST",
          body: forwardForm,
        });
        // }

      if (env.NODE_ENV === "development") {
        // If ML server is running locally
        res = await fetch(`${env.ML_SERVER_URL}/face-embedding`, {
          method: "POST",
          body: forwardForm,
        });
      } else {
        // If ML server is running on Google Cloud Run
        // FIXME: Use GoogleAuth to get an ID token for the request
        // const auth = new GoogleAuth();
        // const client = await auth.getIdTokenClient(env.ML_SERVER_URL);
        // return client.request({
        //   url: `${env.ML_SERVER_URL}/face-embedding`,
        //   method: "POST",
        //   data: forwardForm,
        // });
      });

      // Response型とGaxiosResponse型を適切に処理
      if ("ok" in res && !res.ok) {
        throw new Error(`ML server error: ${res.status} ${res.statusText}`);
      }

      if ("status" in res && res.status >= 400) {
        throw new Error(`ML server error: ${res.status}`);
      }

      const result = (
        "json" in res ? await res.json() : res.data
      ) as EmbeddingResponse;
      return result.embedding[0];
    })(),
    FaceEmbeddingError.handle
  )
    .andThen((embedding) => ok(embedding))
    .orTee(infraLogger("getFaceEmbedding").error);
