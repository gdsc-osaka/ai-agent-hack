// web/src/components/FaceDetector.tsx
'use client';

import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { faceRecognitionAtom } from '@/app/atoms';

// 顔認証APIにリクエストを送る非同期関数（今後、中身を実装します）
async function authenticateFace(imageData: FormData): Promise<boolean> {
  // ↓ imageData を console.log で使用することで、未使用エラーを回避
  console.log('（API呼び出し）顔認証を実行中...', imageData);
  // これはダミーです。実際にはAPIを呼び出します。
  return new Promise(resolve => setTimeout(() => resolve(true), 1000));
}

// 顔検出ライブラリの処理（今後、中身を実装します）
async function detectFace(videoElement: HTMLVideoElement): Promise<boolean> {
  // ↓ videoElement を console.log で使用することで、未使用エラーを回避
  console.log('（顔検出）カメラ映像から顔を探しています...', videoElement);
  // ダミーの実装です。
  return Math.random() > 0.5;
}


export const FaceDetector = () => {
  const [faceState, setFaceState] = useAtom(faceRecognitionAtom);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null); // カメラ映像を表示するためのもの

  useEffect(() => {
    // ページが読み込まれたら、カメラへのアクセス許可を求める
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

    // 5秒ごとに顔があるかチェックするループ処理
    const intervalId = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || isProcessing) {
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

                const isAuthenticated = await authenticateFace(formData);
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
    }, 5000); // 5000ミリ秒 = 5秒ごと

    return () => clearInterval(intervalId); // ページを離れるときにループを停止する
  }, [faceState, setFaceState, isProcessing]);

  return (
    <div>
      <h3>顔認証ステータス</h3>
      <p>現在の状態: <strong>{faceState}</strong></p>
      {/* 動作確認のためにカメラ映像を表示します。不要ならこの行は削除できます */}
      <video ref={videoRef} autoPlay muted style={{ width: '320px', height: '240px', border: '1px solid black', transform: 'scaleX(-1)' }} />
    </div>
  );
};