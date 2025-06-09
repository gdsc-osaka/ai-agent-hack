'use client';

import { useAtom } from 'jotai';
import AudioRecorder from '../components/modules/AudioRecorder';
import { Button } from '../components/ui/button';
import { faceRecognitionAtom } from './atoms';

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
      </div>
      <AudioRecorder faceRecognition={faceRecognition} />
    </div>
  );
}
