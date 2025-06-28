import { useRef, useState } from "react";

interface RecordingState {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  getAudio: () => Promise<Blob>;
}

export const useRecording = (): RecordingState => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | undefined>(undefined);

  const startRecording = async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        audioUrlRef.current = url;
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert(
        "Unable to access microphone. Please check your permissions and try again."
      );
    }
  };

  const stopRecording = async (): Promise<void> => {
    if (!isRecording) return;
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsRecording(false);

    // wait for audioUrl to be set
    await new Promise((resolve) => {
      const maxRetries = 100;
      let retryCount = 0;

      const checkAudioUrl = () => {
        if (audioUrlRef.current || retryCount >= maxRetries) {
          resolve(null);
        } else {
          retryCount++;
          setTimeout(checkAudioUrl, 100); // check every 100ms
        }
      };
      checkAudioUrl();
    });

    console.log(`Recording stopped, audio URL: ${audioUrlRef.current}`);
  };

  const getAudio = async (): Promise<Blob> => {
    const audioUrl = audioUrlRef.current;
    if (!audioUrl) {
      throw new Error("Audio url is empty.");
    }

    const response = await fetch(audioUrl);
    return await response.blob();
  };

  return {
    startRecording,
    stopRecording,
    getAudio,
  };
};
