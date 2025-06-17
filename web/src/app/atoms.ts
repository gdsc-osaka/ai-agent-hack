import { atom } from 'jotai';

export type FaceRecognitionState = 'no-face' | 'face-detected';

export const faceRecognitionAtom = atom<FaceRecognitionState>('no-face');
