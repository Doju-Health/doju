import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setStoredTokens } from "@/lib/local-storage";
import { setUser } from "@/redux/slice/auth/auth-slice";
import { store } from "@/redux/store";
import { toast } from "sonner";
import { API } from "@/lib/axios";

type CallbackPayload = {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
  token?: string;
  user?: unknown;
};

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasProcessedRef = useRef(false);

  const redirectTarget = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    const completeAuth = async () => {
      // Only check standard OAuth2 error param
      const authError = searchParams.get("error");
      if (authError) {
        const errorDesc = searchParams.get("error_description") || authError;
        toast.error(errorDesc);
        navigate("/auth", { replace: true });
        return;
      }

      // Case 1: Backend redirected here with tokens already in the URL
      const directAccessToken =
        searchParams.get("accessToken") ||
        searchParams.get("access_token") ||
        searchParams.get("token");

      if (directAccessToken) {
        const directRefreshToken =
          searchParams.get("refreshToken") ||
          searchParams.get("refresh_token") ||
          directAccessToken;

        setStoredTokens(directAccessToken, directRefreshToken || null);

        const rawUser = searchParams.get("user");
        if (rawUser) {
          try {
            store.dispatch(setUser(JSON.parse(rawUser)));
          } catch {
            // Ignore malformed user payload
          }
        }

        toast.success("Google authentication successful.");
        window.location.replace(redirectTarget);
        return;
      }

      // Case 2: Google redirected here with a code — exchange it via backend
      const code = searchParams.get("code");
      if (!code) {
        toast.error("Google authentication failed. Please try again.");
        navigate("/auth", { replace: true });
        return;
      }

      try {
        const callbackParams = Object.fromEntries(searchParams.entries());
        const response = await API.get("/auth/google/callback", {
          params: callbackParams,
        });
        const payload = response.data as CallbackPayload;

        const accessToken =
          payload.accessToken || payload.access_token || payload.token;
        const refreshToken =
          payload.refreshToken || payload.refresh_token || accessToken;

        if (!accessToken) {
          toast.error("Google sign-in did not return an access token");
          navigate("/auth", { replace: true });
          return;
        }

        setStoredTokens(accessToken, refreshToken || null);

        if (payload.user) {
          store.dispatch(setUser(payload.user as never));
        }

        toast.success("Google authentication successful.");
        window.location.replace(redirectTarget);
      } catch {
        toast.error("Google authentication failed. Please try again.");
        navigate("/auth", { replace: true });
      }
    };

    void completeAuth();
  }, [navigate, redirectTarget, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <p className="text-lg font-semibold text-foreground">
          Completing Google sign-in...
        </p>
        <p className="text-sm text-muted-foreground">
          Please wait while we secure your session.
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
