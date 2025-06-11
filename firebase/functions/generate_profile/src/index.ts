import Busboy from "busboy";
import { onTaskDispatched } from "firebase-functions/v2/tasks";

exports.recordingReceive = onTaskDispatched(
  {
    retryConfig: {
      maxAttempts: 5,  // 最大試行回数
      minBackoffSeconds: 60,  // 再試行の感覚
    },
    rateLimits: {
      maxConcurrentDispatches: 6,  // 同時実行数の制限
    },
  },
  async (req) => {
    try {
      const busboy = Busboy({ headers: req.headers });
      let audioBuffer: Buffer | undefined;
      let audioMime = "";

      busboy.on("file", (_field, file, info) => {
        audioMime = info.mimeType;
        const chunks: Buffer[] = [];
        file.on("data", chunk => chunks.push(chunk));
        file.on("end", () => {
          audioBuffer = Buffer.concat(chunks);
        });
      });

      busboy.on("finish", async () => {
        if (!audioBuffer) {
          throw new Error("No audio file found");
        }
      });
      // TODO: audioBuffer を Gemini API に送信し、生成されたProfile dataを取得
    } catch (error) {
      console.error("Error occurred during audio file processing:", error);
      return {
        status: 500,
        body: "An error occurred while processing the audio file on the server.",
      };
    }
  }
);
