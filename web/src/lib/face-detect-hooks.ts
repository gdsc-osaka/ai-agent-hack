import React, { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import api, { ApiError, bodySerializers } from "@/api";
import { useAtomValue } from "jotai/react";
import { apiKeyAtom } from "@/app/atoms";

const MODEL_URL = "/models";

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

interface FaceDetectionState {
  isFaceDetected: boolean;
  isFaceAuthenticated?: boolean;
  error?: unknown;
  reset: () => void;
}

/**
 * 顔が検出されなくなってから faceTimeoutMillis ミリ秒後に顔が存在しないと判断する
 * @param videoRef
 * @param intervalMillis
 * @param faceDetectionIntervalMillis
 * @param faceTimeoutMillis
 * @param onFaceDetected
 */
export const useFaceDetection = ({
  videoRef,
  intervalMillis = 1000,
  faceDetectionIntervalMillis = 20000,
  faceTimeoutMillis = 5000,
  onFaceDetected,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  intervalMillis?: number;
  faceDetectionIntervalMillis?: number;
  faceTimeoutMillis?: number;
  onFaceDetected?: (image: Blob) => Promise<void>;
}): FaceDetectionState => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastFaceAuthenticatedTime, setLastFaceAuthenticatedTime] = useState<
    number | undefined
  >();
  const [lastFaceDetectionTime, setLastFaceDetectionTime] = useState<
    number | undefined
  >();
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [error, setError] = useState<unknown>();

  // const onFaceDetectedRef = useLatest(onFaceDetected);

  useEffect(() => {
    loadFaceModels();

    const id = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused) {
        console.log("Skipping face detection, video not ready.");
        return;
      }

      if (isProcessing) {
        console.log("Skipping face detection, already processing.");
        return;
      }

      const now = Date.now();

      // 初回検出時はすぐに顔検出を行うために intervalMillis の間隔で実行するが、
      // 顔検出後はデバイスの負荷軽減のために長めに待機する
      if (
        isFaceDetected &&
        lastFaceDetectionTime &&
        now - lastFaceDetectionTime < faceDetectionIntervalMillis
      ) {
        console.log("Skipping face detection, already detected recently.");
        return;
      }

      setIsProcessing(true);

      try {
        const detections = await detectAllFaces(videoRef.current);
        setLastFaceDetectionTime(now);

        if (detections.length === 1) {
          // 1 Face detected
          console.log(
            "Face detected.",
            isFaceDetected,
            lastFaceAuthenticatedTime
          );
          if (isFaceDetected) {
            console.log("Face already detected, no action needed.");
            setLastFaceAuthenticatedTime(Date.now());
          } else {
            const image = await drawImage(videoRef.current);
            await onFaceDetected?.(image);

            console.log("Face detected and authenticated successfully.");
            setIsFaceDetected(true);
            setLastFaceAuthenticatedTime(now);
          }
        } else if (detections.length > 1) {
          // More than 1 face detected
          console.warn("Too many faces detected, discarding detection.");
          setIsFaceDetected(false);
          setLastFaceAuthenticatedTime(undefined);
        } else {
          // No face detected
          console.log("No face detected");
          if (
            lastFaceAuthenticatedTime &&
            now - lastFaceAuthenticatedTime > faceTimeoutMillis
          ) {
            console.log("Face not detected for a while, resetting state.");
            setIsFaceDetected(false);
            setLastFaceAuthenticatedTime(undefined);
          }
        }

        setError(undefined);
      } catch (error) {
        console.error("Error during face detection:", error);
        setError(error);
      } finally {
        setIsProcessing(false);
      }
    }, intervalMillis);

    return () => {
      clearInterval(id);
      setIsProcessing(false);
      console.log("Face detection interval cleared.");
    };
  }, [isFaceDetected, lastFaceAuthenticatedTime, onFaceDetected, isProcessing]);

  return {
    isFaceAuthenticated: lastFaceAuthenticatedTime
      ? Date.now() - lastFaceAuthenticatedTime < faceTimeoutMillis
      : undefined,
    reset: () => {
      setIsFaceDetected(false);
      setLastFaceAuthenticatedTime(undefined);
      setError(undefined);
      console.log("Face detection state reset.");
    },
    isFaceDetected,
    error,
  };
};

const loadFaceModels = async () => {
  if (!faceapi.nets.tinyFaceDetector.isLoaded) {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    console.log("Face detection model loaded");
  }
};

const detectAllFaces = async (video: HTMLVideoElement) => {
  if (!faceapi.nets.tinyFaceDetector.isLoaded) {
    console.warn("Face detection model not loaded, loading now...");
    await loadFaceModels();
  }
  return faceapi.detectAllFaces(
    video,
    new faceapi.TinyFaceDetectorOptions() // 高速な検出モデルを使用
  );
};

const drawImage = (video: HTMLVideoElement): Promise<Blob> => {
  return new Promise<Blob>((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Failed to convert canvas to Blob"));
    }, "image/jpeg");
  });
};

interface FaceAuthenticationState {
  authenticateCustomer: (image: Blob) => Promise<void>;
  authState: AuthState;
  reset: () => void;
}

type AuthState =
  | {
      isLoading: false;
      customerId: string;
      error: undefined;
    }
  | {
      isLoading: false;
      customerId: undefined;
      error: ApiError;
    }
  | {
      isLoading: true;
      customerId: undefined;
      error: undefined;
    };

export const useFaceAuthentication = ({
  storeId,
  openTosDialog,
}: {
  storeId: string | undefined;
  openTosDialog: () => Promise<boolean>;
}): FaceAuthenticationState => {
  const apiKey = useAtomValue(apiKeyAtom);
  const [authState, setAuthState] = useState<AuthState>({
    customerId: undefined,
    isLoading: true,
    error: undefined,
  });

  const handleAuthenticateCustomer = useCallback(
    async (image: Blob): Promise<void> => {
      if (!storeId) {
        console.error("Store ID is not available.");
        return Promise.reject(
          new Error("Store ID is not available for authentication.")
        );
      }

      const { data: customer, error } = await api(apiKey).POST(
        "/api/v1/stores/{storeId}/face-auth/login",
        {
          params: {
            path: {
              storeId,
            },
          },
          body: {
            image,
          },
          bodySerializer: bodySerializers.form,
        }
      );

      if (error && error.code === "customer/face_auth_error") {
        console.log("Opening TOS dialog for registering new customer...");

        const accepted = await openTosDialog();

        if (!accepted) {
          console.warn("User declined TOS, authentication aborted.");
          setAuthState({
            customerId: undefined,
            isLoading: false,
            error: {
              message: "Terms of Service not accepted",
              code: "customer/invalid",
              details: [],
            },
          });
          return Promise.reject(new Error("Terms of Service not accepted"));
        }

        console.warn("Registering new customer...");
        const { data: customer, error } = await api(apiKey).POST(
          "/api/v1/stores/{storeId}/face-auth/signup",
          {
            params: {
              path: {
                storeId,
              },
            },
            body: {
              image,
            },
            bodySerializer: bodySerializers.form,
          }
        );

        if (error) {
          console.error("Customer registration failed:", error);
          setAuthState({
            customerId: undefined,
            isLoading: false,
            error: error,
          });
          return Promise.reject(
            new Error("Customer registration failed: " + error.message)
          );
        }

        console.log("Customer registered successfully:", customer);
        setAuthState({
          customerId: customer.id,
          isLoading: false,
          error: undefined,
        });
        return;
      }

      if (error) {
        console.error("Authentication failed:", error);
        setAuthState({
          customerId: undefined,
          isLoading: false,
          error,
        });
        return Promise.reject(
          new Error("Authentication failed: " + error.message)
        );
      }

      console.log("Authentication successful:", customer);
      setAuthState({
        isLoading: false,
        customerId: customer.id,
        error: undefined,
      });
    },
    [storeId, apiKey, openTosDialog]
  );

  return {
    authState,
    authenticateCustomer: handleAuthenticateCustomer,
    reset: () => {
      setAuthState({
        customerId: undefined,
        isLoading: true,
        error: undefined,
      });
      console.log("Authentication state reset.");
    },
  };
};
