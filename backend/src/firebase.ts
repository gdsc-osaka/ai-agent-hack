import * as admin from "firebase-admin";
import { app } from "firebase-admin";

export default function (FIRE_SA: string): app.App {
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(FIRE_SA) as admin.ServiceAccount
    ),
  });

  return firebaseApp;
}

export function getFirestore(): admin.firestore.Firestore {
  if (admin.apps.length === 0) {
    throw new Error("Firebase app is not initialized");
  }
  return admin.firestore();
}
