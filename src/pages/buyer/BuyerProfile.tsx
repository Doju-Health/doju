import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, MapPin, User, Edit3, Save, X } from "lucide-react";
import { useGetUserProfile } from "@/pages/Auth/api/use-get-profile";
import { useUpdateProfile } from "@/pages/seller/api/use-update-profile";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

export default function BuyerProfile() {
  const { data, isLoading } = useGetUserProfile();
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
  const user = data?.user;

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleUpdateAddress = async () => {
    if (!newAddress.trim()) return;

    try {
      await updateProfile({ address: newAddress.trim() });
      setIsEditingAddress(false);
      setNewAddress("");
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    setNewAddress("");
  };

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <>
              {/* Avatar + name row */}
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14 border-2 border-background shadow">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.fullName}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold text-base leading-tight">
                    {user?.fullName ?? "—"}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {user?.role ?? "buyer"}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="divide-y">
                <InfoRow
                  icon={User}
                  label="Full Name"
                  value={user?.fullName ?? "—"}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone Number"
                  value={user?.phoneNumber ?? "—"}
                />

                {/* Address section with edit functionality */}
                <div className="py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        Delivery Address
                      </p>

                      {isEditingAddress ? (
                        <div className="mt-2 space-y-3">
                          <Input
                            placeholder="Enter your delivery address"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="w-full"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleUpdateAddress}
                              disabled={isPending || !newAddress.trim()}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              {isPending ? "Updating..." : "Update"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={isPending}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-0.5 text-sm font-medium truncate flex items-center gap-2">
                          <span>{user?.address ?? "—"}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setIsEditingAddress(true);
                              setNewAddress(user?.address || "");
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
