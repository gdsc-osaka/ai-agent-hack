'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TermsOfServiceDialog } from '@/components/terms-of-service-dialog';
import { useCamera } from '@/lib/face-detect';
import FaceCamera from '@/app/_components/FaceCamera';
import { CameraToggleButton } from '@/components/CameraToggleButton';
import FaceCameraSkeleton from '@/app/_components/FaceCameraSkeleton';
import { useAtomValue } from 'jotai/react';
import { apiKeyAtom } from '@/app/atoms';
import { useQuery } from '@/api-client';
import api from '@/api';
import Spinner from '@/components/ui/spinner';

export default function Home() {
  // const [faceRecognition, setFaceRecognition] = useAtom(faceRecognitionAtom);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const apiKey = useAtomValue(apiKeyAtom);
  const { data, isLoading, error } = useQuery(api(apiKey))("/api/v1/stores/me");

  const videoRef = useCamera();

  function handleToggleCamera() {
    setShowCamera(prev => !prev);
  }

  function handleOpenTermsDialog() {
    setShowTermsDialog(true);
  }

  function handleCloseTermsDialog() {
    setShowTermsDialog(false);
  }

  function handleAcceptTerms() {
    setShowTermsDialog(false);
  }

  function handleDeclineTerms() {
    setShowTermsDialog(false);
  }

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
    <main className={'flex flex-col gap-16 items-center justify-center h-screen'}>
      <div className={'bg-card px-4 py-2 rounded-md'}>
        <p className={'text-card-foreground'}>
          店舗: {data?.id}
        </p>
      </div>
      <div className={`px-48 w-full`}>
        <FaceCamera ref={videoRef} className={!showCamera ? 'hidden' : ''} />
        {!showCamera && <FaceCameraSkeleton />}
      </div>
      <div className={'flex flex-col gap-4 items-center'}>
        <CameraToggleButton isCameraOn={showCamera} onToggle={handleToggleCamera} />
        <Button variant="secondary" size={'sm'} onClick={handleOpenTermsDialog}>
          利用規約を表示
        </Button>
      </div>
      <TermsOfServiceDialog
        isOpen={showTermsDialog}
        onClose={handleCloseTermsDialog}
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