'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TermsOfServiceDialog } from '@/components/terms-of-service-dialog';
import { useCamera, useFaceAuthentication, useFaceDetection } from '@/lib/face-detect-hooks';
import FaceCamera from '@/app/_components/FaceCamera';
import { CameraToggleButton } from '@/components/CameraToggleButton';
import FaceCameraSkeleton from '@/app/_components/FaceCameraSkeleton';
import { useAtomValue } from 'jotai/react';
import { apiKeyAtom } from '@/app/atoms';
import { useQuery } from '@/api-client';
import api, { bodySerializers } from '@/api';
import Spinner from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useConfirmDialog } from '@/lib/ui-hooks';
import { useRecording } from '@/lib/recording-hooks';
import { toast } from 'sonner';

export default function Home() {
  // const [faceRecognition, setFaceRecognition] = useAtom(faceRecognitionAtom);
  const [showCamera, setShowCamera] = useState(true);
  const apiKey = useAtomValue(apiKeyAtom);

  const { data: store, isLoading, error } = useQuery(api(apiKey))('/api/v1/stores/me');
  const router = useRouter();
  const videoRef = useCamera();
  const tosDialog = useConfirmDialog();
  const { authState, ...faceAuth } = useFaceAuthentication({
    storeId: store?.id,
    openTosDialog: tosDialog.openAsync,
  });
  const faceDetection = useFaceDetection({
    videoRef,
    onFaceDetected: handleAuthenticateFace,
  });
  const { startRecording, stopRecording, getAudio } = useRecording();

  async function handleAuthenticateFace(image: Blob) {
    await faceAuth.authenticateCustomer(image);
    await startRecording();
  }

  async function handleRevokeFaceAuth() {
    faceDetection.reset();
    faceAuth.reset();
    await stopRecording();

    const { data, error } = await api().POST('/api/v1/profiles/generate-profile', {
      body: {
        file: await getAudio(),
      },
      bodySerializer: bodySerializers.form,
    });

    if (error) {
      console.error('Error generating profile:', error);
      toast.error(`プロフィールの生成に失敗しました: ${error.message}`);
    }

    if (data) {
      toast.success(`プロフィールの生成を開始しました: ${data.profile}`);
    }
  }

  function handleToggleCamera() {
    setShowCamera(prev => !prev);
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
          {authState.error ? `顔認証に失敗しました\nエラー: ${authState.error}`
            : authState.customerId ? `顔認証に成功しました！ ${authState.customerId}`
              : faceDetection.isFaceDetected ? '顔を検出しました。認証を開始します...'
                : '顔を検出していません。カメラを確認してください'
          }
        </p>
      </div>
      <div className={'flex flex-col gap-4 items-center'}>
        <CameraToggleButton isCameraOn={showCamera} onToggle={handleToggleCamera} />
        <div className={'flex gap-4'}>
          <Button variant="outline" size={'sm'} onClick={tosDialog.open}>
            利用規約を表示
          </Button>
          <Button variant="ghost" size={'sm'} onClick={handleRevokeFaceAuth}>
            認証を破棄
          </Button>
        </div>
      </div>
      <TermsOfServiceDialog
        isOpen={tosDialog.isOpen}
        onClose={tosDialog.handleClose}
        onAccept={tosDialog.handleOk}
        onDecline={tosDialog.handleCancel}
      />
    </main>
  );
}