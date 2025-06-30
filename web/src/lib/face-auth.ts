import api, { ApiError, bodySerializers, CustomerSession } from "@/api";
import { useAtomValue } from "jotai/react";
import { apiKeyAtom } from "@/app/atoms";
import { useCallback, useState } from "react";
import { atomWithStorage } from "jotai/utils";

const sessionAtom = atomWithStorage<CustomerSession | undefined>(
  "customerSession",
  undefined,
  undefined,
  {
    getOnInit: true,
  }
);

type AuthState =
  | {
      isLoading: false;
      session: CustomerSession;
      error: undefined;
    }
  | {
      isLoading: false;
      session: undefined;
      error: ApiError;
    }
  | {
      isLoading: true;
      session: undefined;
      error: undefined;
    };

interface FaceAuthenticationState {
  signIn: (image: Blob) => Promise<void>;
  signOut: () => void;
  authState: AuthState;
}

export const useFaceAuthentication = ({
  storeId,
  openTosDialog,
}: {
  storeId: string | undefined;
  openTosDialog: () => Promise<boolean>;
}): FaceAuthenticationState => {
  const apiKey = useAtomValue(apiKeyAtom);
  const currentSession = useAtomValue(sessionAtom);
  const [authState, setAuthState] = useState<AuthState>(
    currentSession
      ? {
          session: currentSession,
          isLoading: false,
          error: undefined,
        }
      : {
          session: undefined,
          isLoading: true,
          error: undefined,
        }
  );

  const signIn = useCallback(
    async (image: Blob): Promise<void> => {
      if (!storeId) {
        console.error("Store ID is not available.");
        return Promise.reject(
          new Error("Store ID is not available for authentication.")
        );
      }

      const { data: session, error } = await api(apiKey).POST(
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

      if (error && (error.code === "customer/not_found" || error.code === "customer/face_auth_error")) {
        console.log("Opening TOS dialog for registering new customer...");

        const accepted = await openTosDialog();

        if (!accepted) {
          console.warn("User declined TOS, authentication aborted.");
          setAuthState({
            session: undefined,
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
        const { data: session, error } = await api(apiKey).POST(
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
            session: undefined,
            isLoading: false,
            error: error,
          });
          return Promise.reject(
            new Error("Customer registration failed: " + error.message)
          );
        }

        console.log("Customer registered successfully:", session);
        setAuthState({
          session,
          isLoading: false,
          error: undefined,
        });
        return;
      }

      if (error) {
        console.error("Authentication failed:", error);
        setAuthState({
          session: undefined,
          isLoading: false,
          error,
        });
        return Promise.reject(
          new Error("Authentication failed: " + error.message)
        );
      }

      console.log("Authentication successful:", session);
      setAuthState({
        isLoading: false,
        session,
        error: undefined,
      });
    },
    [storeId, apiKey, openTosDialog]
  );

  const signOut = () => {
    setAuthState({
      session: undefined,
      isLoading: true,
      error: undefined,
    });
    console.log("Sign out called, resetting authentication state.");
  };

  return {
    authState,
    signIn,
    signOut,
  };
};
