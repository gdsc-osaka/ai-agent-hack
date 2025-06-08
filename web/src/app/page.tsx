'use client';

import { useAtom } from 'jotai';
import { faceRecognitionAtom } from './atoms';
import { Button } from '../components/ui/button';

export default function Home() {
  const [faceRecognition, setFaceRecognition] = useAtom(faceRecognitionAtom);

  return (
    // Example of how to use jotai library
    <div className={'m-auto'}>
      Current Face Detection State: {faceRecognition}
      <Button onClick={() => setFaceRecognition(
        faceRecognition === 'no-face' ? 'face-detected' : 'no-face'
      )}>
        {faceRecognition === 'no-face' ? 'Detect Face' : 'Reset Detection'}
      </Button>
    </div>
  );
}
