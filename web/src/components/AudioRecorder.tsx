"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

type AudioRecorderProps = {
  faceRecognition: string;
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({ faceRecognition }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Start recording
  const startRecording = async () => {
    if (recording) return;
    setAudioUrl(null); // Clear old audio URL
    try{
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
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check your permissions and try again.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (!recording) return;
    mediaRecorderRef.current?.stop();
    setRecording(false);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => {
    if (faceRecognition === "face-detected" && !recording) {
      startRecording();
    } else if (faceRecognition === "no-face" && recording) {
      stopRecording();
    }
  }, [faceRecognition, recording, startRecording, stopRecording]);

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "recording.webm";
    a.click();
  };

  return (
    <div>
      <div>
        Recording state: {recording ? "now recording" : "stopped"}
      </div>
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls />
          <Button onClick={downloadAudio}>Download</Button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
