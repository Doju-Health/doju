import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { setStoredTokens } from "@/lib/local-storage";
import { setUser } from "@/redux/slice/auth/auth-slice";
import { store } from "@/redux/store";
import { toast } from "sonner";
import { API } from "@/lib/axios";

/** Scan all URL search params for anything that looks like a JWT (starts with eyJ). */
function findToken(): string | null {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.slice(1));

  // Known param names first
  const names = [
    "accessToken", "token", "access_token", "jwt",
    "bearer", "authToken", "auth_token",
  ];
  for (const name of names) {
    const val = search.get(name) ?? hash.get(name);
    if (val) return val;
  }

  // Scan all params for a JWT value (starts with eyJ)
  for (const [, val] of [...search.entries(), ...hash.entries()]) {
    if (val.startsWith("eyJ") && val.includes(".")) return val;
  }

  return null;
}

export default function GoogleCallback() {
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    (async () => {
      const token = findToken();

      if (!token) {
        toast.error("Google sign-in failed. Please try again.");
        navigate("/auth", { replace: true });
        return;
      }

      // Persist the token so the API interceptor can attach it
      setStoredTokens(token, null);

      try {
        // Fetch real profile data using the token
        const res = await API.get("/auth/me");
        const u = res.data?.user ?? res.data;

        store.dispatch(
          setUser({
            id: u.id ?? "",
            email: u.email ?? "",
            fullName: u.fullName ?? "",
            phoneNumber: u.phoneNumber ?? "",
            role: u.role ?? "buyer",
            createdAt: u.createdAt ?? new Date().toISOString(),
          }),
        );

        toast.success("Google sign-in successful!");
        const redirect = sessionStorage.getItem("auth_redirect") || "";
        sessionStorage.removeItem("auth_redirect");
        navigate(
          redirect || (u.role === "seller" ? "/seller/overview" : "/"),
          { replace: true },
        );
      } catch {
        toast.error("Google sign-in failed. Please try again.");
        navigate("/auth", { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-doju-lime" />
        <p className="text-muted-foreground text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
