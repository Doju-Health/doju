import { API } from "@/lib/axios";
import { setStoredTokens } from "@/lib/local-storage";
import { setUser } from "@/redux/slice/auth/auth-slice";
import { store } from "@/redux/store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type GoogleCallbackParams = {
  code?: string;
  state?: string;
  scope?: string;
  authuser?: string;
  prompt?: string;
};

type CallbackPayload = {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  token?: string;
  user?: unknown;
};

const normalizePayload = (payload: unknown): CallbackPayload => {
  if (!payload || typeof payload !== "object") return {};

  const dataPayload = (payload as { data?: unknown }).data;
  if (dataPayload && typeof dataPayload === "object") {
    return {
      ...(payload as CallbackPayload),
      ...(dataPayload as CallbackPayload),
    };
  }

  return payload as CallbackPayload;
};

export const useGoogleAuthCallback = () => {
  return useMutation({
    mutationFn: async (params: GoogleCallbackParams) => {
      const response = await API.get("/auth/google/callback", { params });
      return response.data;
    },
    onSuccess: (responseData) => {
      const payload = normalizePayload(responseData);
      const accessToken =
        payload.accessToken || payload.access_token || payload.token;
      const refreshToken =
        payload.refreshToken || payload.refresh_token || accessToken;

      if (!accessToken) {
        toast.error("Google sign-in did not return an access token");
        return;
      }

      setStoredTokens(accessToken, refreshToken || null);

      if (payload.user) {
        store.dispatch(setUser(payload.user as never));
      }

      toast.success("Google authentication successful.");
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message?: string;
      error?: string;
    }) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || error?.error;
      toast.error(`Google authentication failed: ${errorMessage}`);
    },
  });
};
