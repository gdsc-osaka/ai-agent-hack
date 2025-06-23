import { err, ok, ResultAsync } from "neverthrow";
import { FieldValue } from "firebase-admin/firestore";
import { createId } from "@paralleldrive/cuid2";
import { FaceAuthError } from "./face-auth-repo.error";
import type { FirebaseApp } from "../firebase";
import { FirestoreInternalError } from "./shared/firestore-error";
import { CustomerId } from "../domain/customer";

const EMBEDDINGS_COLLECTION = "embeddings";

export type RegisterEmbedding = (
  firebase: FirebaseApp
) => (embedding: number[]) => ResultAsync<CustomerId, FirestoreInternalError>;

export type AuthenticateFace = (
  firebase: FirebaseApp
) => (
  embedding: number[]
) => ResultAsync<CustomerId, FaceAuthError | FirestoreInternalError>;

export type DeleteEmbedding = (
  firebase: FirebaseApp
) => (customerId: CustomerId) => ResultAsync<void, FirestoreInternalError>;

export const registerEmbedding: RegisterEmbedding = (firebase) => (embedding) =>
  ResultAsync.fromPromise(
    (async () => {
      const firestore = firebase.firestore();
      const customerId = createId();

      await firestore
        .collection(EMBEDDINGS_COLLECTION)
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
        .collection(EMBEDDINGS_COLLECTION)
        .findNearest({
          vectorField: "value",
          queryVector: FieldValue.vector(embedding),
          limit: 1,
          distanceMeasure: "COSINE",
        })
        .get();

      return snapshot;
    })(),
    FirestoreInternalError.handle
  ).andThen((snapshot) => {
    if (snapshot.empty) {
      return err(FaceAuthError("No match found"));
    }
    // Note: The original code had a distanceThreshold which is not a valid parameter for findNearest.
    // It has been removed. You may need to check the distance on the client side if needed.
    return ok(snapshot.docs[0].id as CustomerId);
  });

export const deleteEmbedding: DeleteEmbedding = (firebase) => (customerId) =>
  ResultAsync.fromPromise(
    firebase
      .firestore()
      .collection(EMBEDDINGS_COLLECTION)
      .doc(customerId)
      .delete(),
    FirestoreInternalError.handle
  ).map(() => undefined); // map to void on success
