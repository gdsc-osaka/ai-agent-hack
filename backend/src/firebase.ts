import * as admin from "firebase-admin";
import { app } from "firebase-admin";
import env from "./env";

export default function (FIRE_SA: string): app.App {
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(FIRE_SA) as admin.ServiceAccount
    ),
  });

  if (env.NODE_ENV === "development") {
    const firestore = admin.firestore(firebaseApp);
    firestore.settings({
      host: "localhost:8000",
      ssl: false,
    });
  } else {
    // for production
  }

  return firebaseApp;
}
