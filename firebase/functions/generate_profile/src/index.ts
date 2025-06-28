import { GoogleGenAI, Type } from "@google/genai";
import Busboy from "busboy";
import {
  Request as HttpsRequest,
  onRequest,
} from "firebase-functions/v2/https";
import {
  onTaskDispatched,
  Request as TasksRequest,
} from "firebase-functions/v2/tasks";
import { getFunctions } from 'firebase-admin/functions';
import admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { v4 as uuidv4 } from "uuid";
import db from "backend/dist/db/db";
import { profiles } from "backend/dist/db/schema/app/profiles";

const region = process.env.GCP_REGION || "asia-northeast1";

admin.initializeApp(process.env.NODE_ENV === "development" ? {
  credential: admin.credential.cert(
    JSON.parse(process.env.FIRE_SA!) as admin.ServiceAccount
  ),
} : undefined);

interface ApiError {
  message: string;
  code: string;
  details: unknown[];
}

interface UploadAudioResponse {
  message: string;
  taskId: string;
}

// 音声をCloud Tasksに登録
export const uploadAudio = onRequest(
  { region },
  async (req, res): Promise<void> => {
    if (req.method !== "POST") {
      res.status(405).json({
        message: "Method Not Allowed. Only POST requests are allowed.",
        code: "method_not_allowed",
        details: [],
      } satisfies ApiError);
      return;
    }

    try {
      const { buffer: audioBuffer, audioMime } = await parseAudio(req);
      const id = uuidv4();

      console.log(`Queuing audio file for processing with ID: ${id}`);
      if (process.env.NODE_ENV === "development") {
        // 開発環境では直接関数を呼び出す
        generateProfile.run({
          data: {
            id,
            audioMime,
            audioBase64: audioBuffer.toString("base64"),
          },
          id: id,
          queueName: 'generateProfile',
          retryCount: 5,
          executionCount: 0,
          scheduledTime: new Date().toISOString(),
        })
      } else {
        // 本番環境ではCloud Tasksを使用して非同期処理
        const queue = getFunctions().taskQueue('generateProfile');
        await queue.enqueue({
          id,
          audioMime,
          audioBase64: audioBuffer.toString("base64"),
        })
      }
      console.log(`✅ Audio file queued successfully with ID: ${id}`);

      res.status(200).json({
        message: "Audio file successfully uploaded and processing started.",
        taskId: id,
      } satisfies UploadAudioResponse);
    } catch (error) {
      console.error("uploadAudio error:", error);
      res.status(500).json({
        message:
          "An error occurred while processing the audio file on the server: " +
          (error instanceof Error ? error.message : String(error)),
        code: "server/error",
        details: [],
      });
    }
  }
);

// multipart/form-dataで音声ファイルを抽出
function parseAudio(
  req: HttpsRequest
): Promise<{ buffer: Buffer; audioMime: string }> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line new-cap
    const busboy = Busboy({
      headers: req.headers,
      limits: {
        fileSize: 100 * 1024 * 1024,
        files: 1,
        fields: 0,
      },
    });
    let audioBuffer: Buffer | null = null;
    let audioMimeType: string | null = null;

    busboy.on("file", (field, file, info) => {
      if (field === 'recording' && info.mimeType === 'audio/webm') {
        const fileBufferChunks: Buffer[] = [];
        file.on('data', (data: Buffer) => {
          fileBufferChunks.push(data);
        });

        file.on('end', () => {
          audioBuffer = Buffer.concat(fileBufferChunks);
          audioMimeType = info.mimeType;
          console.log(`Audio file [${file}] processed. Size: ${audioBuffer.length} bytes`);
        });

        file.on('error', (err: Error) => {
          console.error(`Error processing file [${file}]:`, err);
          reject(err);
        });
      } else {
        // 他のフィールドは無視
        console.warn(`Ignoring field: ${field}, MIME type: ${info.mimeType}`);
        file.resume();
        return;
      }
    });

    busboy.on('error', (err: Error) => {
      console.error('Busboy parsing error:', err);
      reject(err);
    });

    busboy.on("finish", () => {
      if (!audioBuffer || !audioMimeType) return reject(new Error("No audio/webm file found with key \"recording\" in the request."));
      if (audioBuffer.length === 0) return reject(new Error("Empty file uploaded"));

      resolve({ buffer: audioBuffer, audioMime: audioMimeType });
    });

    // Firebase Functionsではreq.rawBodyを使用する
    // rawBodyはBufferまたはundefinedの可能性があるため、Bufferであることを保証する必要があります。
    // req.rawBodyがundefinedの場合、Busboy.end()に空のBufferを渡すか、エラーをスローするなど考慮が必要です。
    if (req.rawBody) {
      busboy.end(req.rawBody);
    } else {
      reject(new Error('Request body is empty or not available.'));
    }
  });
}

// Gemini APIで音声からプロファイル生成
export const generateProfile = onTaskDispatched(
  {
    retryConfig: { maxAttempts: 5, minBackoffSeconds: 60 },
    rateLimits: { maxConcurrentDispatches: 6 },
  },
  async (req: TasksRequest<{
    id: string;
    audioMime: string;
    audioBase64: string;
  }>) => {
    try {
      logger.log(`🚀 Processing audio file for task ID: ${req.data.id}`, req);

      const { audioMime, audioBase64 } = req.data;
      const buffer = Buffer.from(audioBase64, "base64");
      const blob = new Blob([buffer], { type: audioMime });

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      logger.log("Uploading audio file to Gemini API...");
      const file = await ai.files.upload({ file: blob });

      logger.log("Sending request to Gemini API with file:", file.uri);
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                fileData: {
                  fileUri: file.uri,
                  mimeType: audioMime,
                },
              },
              {
                text:
                  "Generate profile data from the attached audio file. " +
                  "Please return the birthday in ISO 8601 format (YYYY-MM-DD).",
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                gender: { type: Type.STRING },
                birthday: { type: Type.STRING },
                birthplace: { type: Type.STRING },
                business: { type: Type.STRING },
                partner: { type: Type.STRING },
                hobby: { type: Type.STRING },
                news: { type: Type.STRING },
                worry: { type: Type.STRING },
                store: { type: Type.STRING },
              },
            },
          },
        },
      });
      const profileData = response.text;
      if (!profileData) {
        throw new Error("No profile data returned from Gemini API");
      }
      const profileList: Array<{
        gender: string;
        birthday: string;
        birthplace: string;
        business: string;
        partner: string;
        hobby: string;
        news: string;
        worry: string;
        store: string;
      }> = JSON.parse(profileData);

      logger.log("Profile data received from Gemini API:", profileList);

      if (profileList.length === 0) {
        throw new Error("No profile data found in the response");
      }

      const profile: typeof profiles.$inferInsert = {
        ...profileList[0],
        birthday: iife(() => {
          const date = new Date(profileList[0].birthday);
          if (isNaN(date.getTime())) { // 日付が無効な場合
            return undefined;
          }
          return date;
        })
      }

      logger.log("Trying to insert profile data:", profile);

      await db.insert(profiles).values(profile);

      logger.log("✅ Profile data successfully inserted into the database.");
      return;
    } catch (error) {
      logger.error("Error occurred during audio file processing:", error);
      const errMsg =
        "An error occurred while processing the audio file on the server: " +
        (error instanceof Error ? error.message : String(error));
      throw new Error(errMsg);
    }
  }
);

/**
 * Immediately Invoked Function Expression: 即時実行関数式
 * if, try, switch 文などを即時実行し, 擬似的に式として扱うことができるようにする.
 * @param f
 * @example
 * ```typescript
 * const result = iife(() => {
 *   if (condition) {
 *     return "foo";
 *   } else {
 *     return "bar";
 *   }
 * }
 * ```
 */
export const iife = <T>(f: () => T): T => f();
