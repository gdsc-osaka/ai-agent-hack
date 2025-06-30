"use client";

import api from '@/api';
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

type AudioRecorderProps = {
  faceRecognition: string;
};

type Profile = {
  id: string;
  gender?: string | null;
  birthday?: string | null;
  birthplace?: string | null;
  business?: string | null;
  partner?: string | null;
  hobby?: string | null;
  news?: string | null;
  worry?: string | null;
  store?: string | null;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
};

const AudioRecorder: React.FC<AudioRecorderProps> = ({ faceRecognition }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Start recording
  const startRecording = async () => {
    if (recording) return;
    setAudioUrl(null);
    setProfiles([]);
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

  // Upload audio to generate profile
  const uploadAudio = async () => {
    if (!audioUrl || uploading) return;

    setUploading(true);
    try {
      // Convert blob URL back to blob
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      // Send to generate-profile endpoint
      const { error } = await api().POST('/api/v1/stores/{storeId}/customers/me/profiles', {
        body: {
          file: audioBlob,
        },
      });

      if (error) {
        throw new Error(error.message || 'Upload failed');
      }

      alert('Profile generation completed!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (faceRecognition === "face-detected" && !recording) {
      startRecording();
    } else if (faceRecognition === "no-face" && recording) {
      stopRecording();
    }
  }, [faceRecognition, recording]);

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "recording.webm";
    a.click();
  };

  return (
    <div className="space-y-4">
      <div>
        Recording state: {recording ? "now recording" : "stopped"}
      </div>

      {audioUrl && (
        <div className="space-y-2">
          <audio src={audioUrl} controls />
          <div className="flex gap-2">
            <Button onClick={downloadAudio}>Download</Button>
            <Button
              onClick={uploadAudio}
              disabled={uploading}
              variant="outline"
            >
              {uploading ? "Generating Profile..." : "Generate Profile"}
            </Button>
          </div>
        </div>
      )}

      {profiles.length > 0 && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="font-bold mb-2">Generated Profiles:</h3>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(profiles, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
