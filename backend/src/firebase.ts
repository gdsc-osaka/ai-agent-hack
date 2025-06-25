import * as admin from "firebase-admin";
import { app } from "firebase-admin";

export default function (FIRE_SA: string): app.App {
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  // 開発環境でFirebase Emulatorを使用
  if (process.env.NODE_ENV === 'development') {
    console.log('Using Firebase Emulator for development');
    const firebaseApp = admin.initializeApp({
      projectId: 'recall-you-dev',
    });
    return firebaseApp;
  }

  // FIRE_SAが設定されていない場合のエラーハンドリング
  if (!FIRE_SA) {
    throw new Error("FIRE_SA environment variable is not set");
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(FIRE_SA) as admin.ServiceAccount;
  } catch (error) {
    console.error("Failed to parse FIRE_SA JSON:", error);
    throw new Error("Invalid FIRE_SA JSON format");
  }

  const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return firebaseApp;
}

export type FirebaseApp = app.App;
