'use client';

import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { faceRecognitionAtom } from '@/app/atoms';
import * as faceapi from 'face-api.js';

// [本物] face-api.jsを使って、実際に顔が映っているか判定する関数
async function detectFace(videoElement: HTMLVideoElement): Promise<boolean> {
  if (!videoElement) return false;
  
  try {
    const detections = await faceapi.detectAllFaces(
      videoElement,
      new faceapi.TinyFaceDetectorOptions() // 高速な検出モデルを使用
    );
    return detections.length > 0; // 1つでも顔が検出されたらtrueを返す
  } catch (error) {
    console.error("顔検出でエラー:", error);
    return false;
  }
}

// [本物] バックエンドAPIを呼び出す関数 (storeIdを引数に追加)
async function authenticateFace(imageData: FormData, storeId: string): Promise<boolean> {
  // 正しいAPIエンドポイント
  const API_ENDPOINT = `/api/v1/vector/face-auth`; 

  try {
    console.log('（API呼び出し）顔認証を実行中...', API_ENDPOINT);
    
    const imageBlob = imageData.get('faceImage');
    if (!imageBlob) {
        console.error("キャプチャした画像データがありません。");
        return false;
    }
    
    const formDataForApi = new FormData();
    formDataForApi.append('image', imageBlob);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formDataForApi,
    });
    
    if (response.ok) {
      const customerData = await response.json();
      console.log('API Response: 認証成功！', customerData);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('API Response: 認証失敗', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.error("API呼び出しでエラーが発生しました:", error);
    return false;
  }
}


export const FaceDetector = () => {
  const [faceState, setFaceState] = useAtom(faceRecognitionAtom);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        console.log('顔検出モデルの読み込み完了');
      } catch (error) {
        console.error("モデルの読み込みに失敗しました:", error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("カメラのアクセスでエラーが発生しました:", err);
      }
    };
    setupCamera();

    const intervalId = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || !modelsLoaded || isProcessing) {
        return;
      }

      const isFaceDetected = await detectFace(videoRef.current);

      if (faceState === 'no-face' && isFaceDetected) {
        setIsProcessing(true);
        console.log('顔を検出しました。認証を開始します。');

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);

        canvas.toBlob(async (blob) => {
            if (blob) {
                const formData = new FormData();
                formData.append('faceImage', blob, 'face.jpg');

                // TODO: 本来はUIなどから動的に取得するstoreId。今はテスト用に固定値を入れます。
                const storeId = 's-12345'; 
                const isAuthenticated = await authenticateFace(formData, storeId);

                if (isAuthenticated) {
                  console.log('認証成功！状態を"face-detected"に変更します。');
                  setFaceState('face-detected');
                }
            }
           setIsProcessing(false);
        }, 'image/jpeg');

      } else if (faceState === 'face-detected' && !isFaceDetected) {
        console.log('顔が見えなくなりました。状態を"no-face"に変更します。');
        setFaceState('no-face');
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [faceState, setFaceState, isProcessing, modelsLoaded]);

  return (
    <div>
      <h3>顔認証ステータス</h3>
      <p>現在の状態: <strong>{faceState}</strong></p>
      <p>モデル読込: {modelsLoaded ? '完了' : '読み込み中...'}</p>
      <video ref={videoRef} autoPlay muted style={{ width: '320px', height: '240px', border: '1px solid black', transform: 'scaleX(-1)' }} />
    </div>
  );
};