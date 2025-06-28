'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TermsOfServiceDialog } from '@/components/terms-of-service-dialog';
import { useCamera, useFaceDetection } from '@/lib/face-detect';
import FaceCamera from '@/app/_components/FaceCamera';
import { CameraToggleButton } from '@/components/CameraToggleButton';
import FaceCameraSkeleton from '@/app/_components/FaceCameraSkeleton';
import { useAtomValue } from 'jotai/react';
import { apiKeyAtom } from '@/app/atoms';
import { useQuery } from '@/api-client';
import api, { bodySerializers } from '@/api';
import Spinner from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

export default function Home() {
  // const [faceRecognition, setFaceRecognition] = useAtom(faceRecognitionAtom);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const apiKey = useAtomValue(apiKeyAtom);

  const { data: store, isLoading, error } = useQuery(api(apiKey))('/api/v1/stores/me');
  const router = useRouter();
  const videoRef = useCamera();
  const faceDetection = useFaceDetection({
    videoRef,
    onFaceDetected: handleAuthenticateCustomer,
  });

  async function handleAuthenticateCustomer(image: Blob): Promise<boolean> {
    if (!store?.id) {
      console.error('Store ID is not available.');
      return false;
    }

    const { data: customer, error } = await api().POST('/api/v1/stores/{storeId}/customers/authenticate', {
      params: {
        path: {
          storeId: store.id,
        }
      },
      body: {
        image
      },
      bodySerializer: bodySerializers.form
    });

    if (error && error.code === 'customer/face_auth_error') {
      console.warn('Registering new customer...');
      const { data: customer, error } = await api().POST('/api/v1/stores/{storeId}/customers', {
        params: {
          path: {
            storeId: store.id,
          }
        },
        body: {
          image
        },
        bodySerializer: bodySerializers.form
      });

      if (error) {
        console.error('Customer registration failed:', error);
        return false;
      }

      console.log('Customer registered successfully:', customer);
      return true;
    }

    if (error) {
      console.error('Authentication failed:', error);
      return false;
    }

    console.log('Authentication successful:', customer);
    return true;
  }

  function handleToggleCamera() {
    setShowCamera(prev => !prev);
  }

  function handleAcceptTerms() {
    setShowTermsDialog(false);
  }

  function handleDeclineTerms() {
    setShowTermsDialog(false);
  }

  useEffect(() => {
    if (!apiKey) {
      router.push('/setup');
    }
  }, []);

  if (isLoading) {
    return (
      <main className={'flex flex-col items-center justify-center h-screen w-full'}>
        <Spinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className={'flex flex-col items-center justify-center h-screen w-full'}>
        <div className={'text-red-500'}>
          <h1>Error: {error.message}</h1>
          <p>{JSON.stringify(error.details)}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={'flex flex-col gap-8 items-center justify-center h-screen'}>
      <div className={'bg-card px-4 py-2 rounded-md'}>
        <p className={'text-card-foreground'}>
          店舗: {store?.id}
        </p>
      </div>
      <div className={`px-48 w-full flex flex-col items-center gap-8`}>
        <FaceCamera ref={videoRef} className={!showCamera ? 'hidden' : ''} />
        {!showCamera && <FaceCameraSkeleton />}
        <p className={'text-xs'}>
          {faceDetection.error ? `顔認証に失敗しました\nエラー: ${faceDetection.error}`
            : faceDetection.isFaceAuthenticated ? '顔認証に成功しました！'
              : faceDetection.isFaceDetected ? '顔を検出しました。認証を開始します...'
                : '顔を検出していません。カメラを確認してください'
          }
        </p>
      </div>
      <div className={'flex flex-col gap-4 items-center'}>
        <CameraToggleButton isCameraOn={showCamera} onToggle={handleToggleCamera} />
        <Button variant="secondary" size={'sm'} onClick={() => setShowTermsDialog(true)}>
          利用規約を表示
        </Button>
      </div>
      <TermsOfServiceDialog
        isOpen={showTermsDialog}
        onClose={() => setShowTermsDialog(false)}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />
    </main>
    // TODO: 録音と顔認証機能を元に戻す
    // <>
    //   <div className={'m-auto'}>
    //     <div>
    //       Current Face Detection State: {faceRecognition}
    //       <Button
    //         onClick={() =>
    //           setFaceRecognition(
    //             faceRecognition === 'no-face' ? 'face-detected' : 'no-face'
    //           )
    //         }
    //       >
    //         {faceRecognition === 'no-face' ? 'Detect Face' : 'Reset Detection'}
    //       </Button>
    //       <FaceDetector />
    //       <div className="mt-4">
    //       </div>
    //     </div>
    //
    //     <AudioRecorder faceRecognition={faceRecognition} />
    //   </div>
    // </>
  );
}