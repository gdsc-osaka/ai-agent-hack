import { err, ok, ResultAsync } from "neverthrow";
import { FieldValue } from "firebase-admin/firestore";
import { createId } from "@paralleldrive/cuid2";
import { FaceAuthError } from "./face-auth-repo.error";
import type { FirebaseApp } from "../firebase";
import { FirestoreInternalError } from "./shared/firestore-error";
import { CustomerId } from "../domain/customer";

export type RegisterEmbedding = (
  firebase: FirebaseApp
) => (embedding: number[]) => ResultAsync<string, FirestoreInternalError>;

export type AuthenticateFace = (
  firebase: FirebaseApp
) => (
  embedding: number[]
) => ResultAsync<string, FaceAuthError | FirestoreInternalError>;

export const registerEmbedding: RegisterEmbedding = (firebase) => (embedding) =>
  ResultAsync.fromPromise(
    (async () => {
      const firestore = firebase.firestore();
      const customerId = createId();

      await firestore
        .collection("embeddings")
        .doc(customerId)
        .set({
          value: FieldValue.vector(embedding),
          created_at: new Date().toISOString(),
        });

      return customerId as CustomerId;
    })(),
    FirestoreInternalError.handle
  ).andThen((customerId) => ok(customerId));

export const authenticateFace: AuthenticateFace = (firebase) => (embedding) =>
  ResultAsync.fromPromise(
    (async () => {
      const firestore = firebase.firestore();

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

      return snapshot;
    })(),
    FirestoreInternalError.handle
  ).andThen((snapshot) => {
    if (snapshot.empty) {
      return err(FaceAuthError("No match found"));
    }
    return ok(snapshot.docs[0].id);
  });
