import { atom } from "jotai";

type FaceRecognitionState = "no-face" | "face-detected";
const _faceRecognitionAtom = atom<FaceRecognitionState>("no-face");
export const faceRecognitionAtom = atom(
  (get) => get(_faceRecognitionAtom),
  (_, set, newState: FaceRecognitionState) => {
    set(_faceRecognitionAtom, newState);
  }
);
