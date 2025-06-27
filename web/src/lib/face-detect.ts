import { useEffect, useRef } from "react";

export const useCamera = (onError?: (error: unknown) => void) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (ref.current) {
          ref.current.srcObject = stream;
          ref.current.play();
        }
      })
      .catch(onError);
  }, [ref]);

  return ref;
};
