'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';
import AudioRecorder from '../components/AudioRecorder';
import { Button } from '../components/ui/button';
import { faceRecognitionAtom } from './atoms';
import { TermsOfServiceDialog } from '../components/terms-of-service-dialog';  

export default function Home() {
  const [faceRecognition, setFaceRecognition] = useAtom(faceRecognitionAtom);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  return (
    // Example of how to use jotai library
    <>
      <div className={'m-auto'}>
        <div>
          Current Face Detection State: {faceRecognition}
          <Button
            onClick={() =>
              setFaceRecognition(
                faceRecognition === 'no-face' ? 'face-detected' : 'no-face'
              )
            }
          >
            {faceRecognition === 'no-face' ? 'Detect Face' : 'Reset Detection'}
          </Button>
          <div className="mt-4"> 
          <Button variant="outline" onClick={() => setShowTermsDialog(true)}> 
            利用規約を表示  
          </Button> 
          </div>  
        </div>
        <AudioRecorder faceRecognition={faceRecognition} />
      </div>
      <TermsOfServiceDialog
        isOpen={showTermsDialog}
        onClose={() => setShowTermsDialog(false)}
        onAccept={() => {
          console.log("利用規約に同意しました");
          setShowTermsDialog(false);
        }}
        onDecline={() => {
          console.log("利用規約に同意しませんでした");
          setShowTermsDialog(false);
        }}
      />
    </>
  );
}
