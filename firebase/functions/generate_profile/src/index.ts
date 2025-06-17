import { CloudTasksClient, protos } from "@google-cloud/tasks";
import { GoogleGenAI, Type } from "@google/genai";
import Busboy from "busboy";
import * as express from "express";
import { Blob } from "fetch-blob";
import {
  Request as HttpsRequest,
  onRequest,
} from "firebase-functions/v2/https";
import {
  onTaskDispatched,
  Request as TasksRequest,
} from "firebase-functions/v2/tasks";
import { v4 as uuidv4 } from "uuid";

const tasksClient = new CloudTasksClient();
const projectId = process.env.GCP_PROJECT_ID || "recall-you";
const region = process.env.GCP_REGION || "asia-northeast1";
const queue = process.env.TASK_QUEUE || "profile-queue";

// 音声をCloud Tasksに登録
export const uploadAudio = onRequest(
  { region },
  async (req: HttpsRequest, res: express.Response): Promise<void> => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const { buffer: audioBuffer, audioMime } = await parseAudio(req);
      const id = uuidv4();
      const payload = {
        id,
        audioMime,
        audioBase64: audioBuffer.toString("base64"),
      };

      const parent = tasksClient.queuePath(projectId, region, queue);
      const url = `https://${region}-${projectId}.cloudfunctions.net/generateProfile`;
      const task: protos.google.cloud.tasks.v2.ITask = {
        httpRequest: {
          httpMethod: protos.google.cloud.tasks.v2.HttpMethod.POST,
          url,
          headers: { "Content-Type": "application/json" },
          body: Buffer.from(JSON.stringify(payload)).toString("base64"),
        },
      };
      await tasksClient.createTask({ parent, task });

      res.status(200).send(`Task queued (id=${id})`);
    } catch (error) {
      console.error("uploadAudio error:", error);
      res.status(500).send((error as Error).message);
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
    const chunks: Buffer[] = [];
    let audioMime = "";
    let fileReceived = false;

    busboy.on("file", (_field, file, info) => {
      fileReceived = true;
      audioMime = info.mimeType;
      if (!audioMime.startsWith("audio/")) {
        reject(new Error(`Unsupported MIME type: ${audioMime}`));
        return;
      }
      file.on("data", (data: Buffer) => chunks.push(data));
    });
    busboy.on("error", reject);
    busboy.on("finish", () => {
      if (!fileReceived) return reject(new Error("No file uploaded"));
      if (chunks.length === 0) {
        return reject(new Error("Received file is empty"));
      }
      resolve({ buffer: Buffer.concat(chunks), audioMime });
    });

    const raw = req.rawBody;
    if (!raw) return reject(new Error("Request rawBody is empty"));
    busboy.end(raw);
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
      const { audioMime, audioBase64 } = req.data;
      const buffer = Buffer.from(audioBase64, "base64");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const blob = new Blob([buffer], { type: audioMime });
      const file = await ai.files.upload({ file: blob });

      const request = {
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                file_data: {
                  file_uri: file.uri,
                  mime_type: audioMime,
                },
              },
              {
                text: "Generate profile data from the attached audio file.",
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
      };

      const response = await ai.models.generateContent(request);
      const profile = await response.text;
      console.log(profile);
      return;
    } catch (error) {
      console.error("Error occurred during audio file processing:", error);
      const errMsg =
        "An error occurred while processing the audio file on the server: " +
        (error instanceof Error ? error.message : String(error));
      throw new Error(errMsg);
    }
  }
);
