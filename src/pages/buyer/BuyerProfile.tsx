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
import { jumiaZone, getJumiaZoneForCity } from "@/data/nigeria-geo";

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

  const [isEditingCity, setIsEditingCity] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleUpdateCity = async () => {
    if (!newCity) return;

    try {
      await updateProfile({ city: newCity });
      setIsEditingCity(false);
      setNewCity("");
    } catch (error) {
      console.error("Failed to update city:", error);
    }
  };

  const handleUpdatePhone = async () => {
    if (!newPhone.trim()) return;

    try {
      await updateProfile({ phoneNumber: newPhone.trim() });
      setIsEditingPhone(false);
      setNewPhone("");
    } catch (error) {
      console.error("Failed to update phone number:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingCity(false);
    setNewCity("");
    setIsEditingPhone(false);
    setNewPhone("");
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
                <div className="space-y-2 flex-1">
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <Avatar className="h-14 w-14 shrink-0 border-2 border-background shadow">
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
                <div className="min-w-0">
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
                <div className="py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        Phone Number
                      </p>

                      {isEditingPhone ? (
                        <div className="mt-2 space-y-3">
                          <Input
                            placeholder="Enter your phone number"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            className="w-full"
                          />
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              onClick={handleUpdatePhone}
                              disabled={isPending || !newPhone.trim()}
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
                        <div className="mt-0.5 text-sm font-medium flex items-center gap-2 flex-wrap">
                          <span className="break-words">
                            {user?.phoneNumber ?? "—"}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-muted-foreground hover:text-foreground shrink-0"
                            onClick={() => {
                              setIsEditingPhone(true);
                              setNewPhone(user?.phoneNumber || "");
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delivery city with Jumia zone dropdown */}
                <div className="py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        Delivery City
                      </p>

                      {isEditingCity ? (
                        <div className="mt-2 space-y-3">
                          <select
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="" disabled>Select your city</option>
                            {Object.entries(jumiaZone).map(([zoneName, cities]) => (
                              <optgroup key={zoneName} label={`Zone ${zoneName.replace("ZONE", "")}`}>
                                {cities.map((city) => (
                                  <option key={city} value={city}>{city}</option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              onClick={handleUpdateCity}
                              disabled={isPending || !newCity}
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
                        <div className="mt-0.5 text-sm font-medium flex items-center gap-2 flex-wrap">
                          <span>
                            {user?.city ?? "—"}
                            {user?.city && getJumiaZoneForCity(user.city) && (
                              <span className="ml-1.5 text-xs text-muted-foreground font-normal">
                                Zone {getJumiaZoneForCity(user.city)}
                              </span>
                            )}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-muted-foreground hover:text-foreground shrink-0"
                            onClick={() => {
                              setIsEditingCity(true);
                              setNewCity(user?.city || "");
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
