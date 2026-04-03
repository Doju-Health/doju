import { useAppSelector } from "@/redux/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SellerSettings() {
  const user = useAppSelector((state) => state.authData.user);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Full Name
              </p>
              <p className="text-sm font-medium">{user?.fullName ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Email
              </p>
              <p className="text-sm font-medium">{user?.email ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Phone Number
              </p>
              <p className="text-sm font-medium">{user?.phoneNumber ?? "—"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Role
              </p>
              <Badge variant="secondary" className="capitalize text-xs">
                {user?.role ?? "—"}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Member Since
            </p>
            <p className="text-sm font-medium">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
