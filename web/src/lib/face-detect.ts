import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';

export const useCamera = (onError?: (error: unknown) => void) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (ref.current) {
          ref.current.srcObject = stream;
          ref.current.play();
        }
      })
      .catch(onError);
  }, [ref]);

  return ref;
};

interface FaceDetectionState {
  isFaceDetected: boolean;
  isFaceAuthenticated?: boolean;
  error?: unknown;
}

/**
 * 顔が検出されなくなってから faceTimeoutMillis ミリ秒後に顔が存在しないと判断する
 * @param videoRef
 * @param intervalMillis
 * @param faceTimeoutMillis
 * @param onFaceDetected
 */
export const useFaceDetection = ({ videoRef, intervalMillis = 2000, faceTimeoutMillis = 60000, onFaceDetected }: {
  videoRef: React.RefObject<HTMLVideoElement | null>,
  intervalMillis?: number,
  faceTimeoutMillis?: number,
  onFaceDetected?: (image: Blob) => Promise<boolean>,
}): FaceDetectionState => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastFaceDetectedTime, setLastFaceDetectedTime] = useState<number | undefined>();
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const id = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused) {
        return;
      }

      if (isProcessing) {
        return;
      }

      setIsProcessing(true);

      try {
        const detections = await detectAllFaces(videoRef.current);
        const hasFace = detections.length > 0;

        if (hasFace) {
          console.log('Face detected.');
          if (isFaceDetected) {
            setLastFaceDetectedTime(Date.now());
          } else {
            const image = await drawImage(videoRef.current);
            const succeeded = await onFaceDetected?.(image);

            if (succeeded) {
              setIsFaceDetected(true);
              setLastFaceDetectedTime(Date.now());
            }
          }
        } else {
          console.log('No face detected');
          if (lastFaceDetectedTime && Date.now() - lastFaceDetectedTime > faceTimeoutMillis) {
            setIsFaceDetected(false);
          }
        }

        setError(undefined);
      } catch (error) {
        console.error('Error during face detection:', error);
        setError(error);
      } finally {
        setIsProcessing(false);
      }
    }, intervalMillis);

    return () => clearInterval(id);
  }, []);

  return {
    isFaceDetected,
    error
  };
};

const detectAllFaces = async (video: HTMLVideoElement) => {
  if (!faceapi.nets.tinyFaceDetector.isLoaded) {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    console.log('Face detection model loaded');
  }

  return faceapi.detectAllFaces(
    video,
    new faceapi.TinyFaceDetectorOptions(), // 高速な検出モデルを使用
  );
};

const drawImage = (video: HTMLVideoElement): Promise<Blob> => {
  return new Promise<Blob>((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error('Failed to convert canvas to Blob'));
    }, 'image/jpeg');
  });
};
