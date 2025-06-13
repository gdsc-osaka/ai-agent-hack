import { GoogleGenAI, Type } from "@google/genai";
import { Blob } from "fetch-blob";
import Busboy from "busboy";
import { onTaskDispatched } from "firebase-functions/v2/tasks";

async function parseAudio(req: any): Promise<{ buffer: Buffer; audioMime: string }> {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });
    const chunks: Buffer[] = [];
    let audioMime = "";

    let fileReceived = false;
    busboy.on("file", (field, file, info) => {
      fileReceived = true;
      audioMime = info.mimeType;
      file.on("data", (data: Buffer) => chunks.push(data));
    });

    // 想定外のフィールドを受信したらエラー
    busboy.on("field", (fieldname, val) => {
      return reject(new Error(`Unexpected form field: ${fieldname}`));
    });

    busboy.on("error", (err) => {
      return reject(err);
    });

    busboy.on("finish", () => {
      // ファイル自体がまったく来なかった場合
      if (!fileReceived) {
        return reject(new Error("No file uploaded"));
      }
      // バッファが空の場合（何かおかしい）
      if (chunks.length === 0) {
        return reject(new Error("Received file is empty"));
      }
      // MIME タイプが不明／サポート外の場合
      if (!audioMime.startsWith("audio/")) {
        return reject(new Error(`Unsupported MIME type: ${audioMime}`));
      }

      const buffer = Buffer.concat(chunks);
      resolve({ buffer, audioMime });
    });

    busboy.end(req.rawBody);
  });
}

exports.generateProfile = onTaskDispatched(
  {
    retryConfig: { maxAttempts: 5, minBackoffSeconds: 60 },
    rateLimits: { maxConcurrentDispatches: 6 },
  },
  async (req) => {
    try {
      const { buffer: audioBuffer, audioMime } = await parseAudio(req);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const blob = new Blob([audioBuffer], { type: audioMime });
      const file = await ai.files.upload({ file: blob });

      const request = {
        model: "gemini-2.0-flash",
        contents: [
          {
            role: 'user',
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
                store: { type: Type.STRING }
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
      throw new Error("An error occurred while processing the audio file on the server.");
    }
  }
);
