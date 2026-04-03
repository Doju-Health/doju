import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setStoredTokens } from "@/lib/local-storage";
import { setUser } from "@/redux/slice/auth/auth-slice";
import { store } from "@/redux/store";
import { toast } from "sonner";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const accessToken =
      searchParams.get("accessToken") ?? searchParams.get("token");

    if (!accessToken) {
      toast.error("Google sign-in failed. Please try again.");
      navigate("/auth", { replace: true });
      return;
    }

    // Collect user fields from query params
    const id = searchParams.get("id") ?? "";
    const email = searchParams.get("email") ?? "";
    const fullName = searchParams.get("fullName") ?? "";
    const role = searchParams.get("role") ?? "buyer";
    const phoneNumber = searchParams.get("phoneNumber") ?? "";

    setStoredTokens(accessToken, null);

    store.dispatch(
      setUser({
        id,
        email,
        fullName,
        phoneNumber,
        role,
        createdAt: new Date().toISOString(),
      }),
    );

    toast.success("Google sign-in successful!");

    const defaultRoute = role === "seller" ? "/seller/overview" : "/";
    navigate(defaultRoute, { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-doju-lime" />
        <p className="text-muted-foreground text-sm">Signing you in…</p>
      </div>
    </div>
  );
}
