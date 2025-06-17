'use client';

import { useAtom } from 'jotai';
import AudioRecorder from '../components/AudioRecorder';
import { Button } from '../components/ui/button';
import { faceRecognitionAtom } from './atoms';
import { FaceDetector } from '@/components/FaceDetector';

export default function Home() {
  const [faceRecognition, setFaceRecognition] = useAtom(faceRecognitionAtom);

  return (
    // Example of how to use jotai library
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
        <FaceDetector />
      </div>
      <AudioRecorder faceRecognition={faceRecognition} />
    </div>
  );
}
