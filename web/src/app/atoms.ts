import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type FaceRecognitionState = "no-face" | "face-detected";

export const faceRecognitionAtom = atom<FaceRecognitionState>("no-face");

export const apiKeyAtom = atomWithStorage("apiKey", "", undefined, {
  getOnInit: true,
});
