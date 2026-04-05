import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Building2,
  MapPin,
  Hash,
  MailCheck,
} from "lucide-react";
import AddBankAccount from "./AddBankAccount";
import { useGetUserProfile } from "@/pages/Auth/api/use-get-profile";

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

export default function SellerSettings() {
  const { data, isLoading } = useGetUserProfile();
  const user = data?.user;

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and payment details.
        </p>
      </div>

      {/* Cards side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Profile card */}
        <Card>
          <CardContent className="pt-6 pb-2">
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
                {Array.from({ length: 5 }).map((_, i) => (
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
                    <Badge
                      variant="secondary"
                      className="mt-1 capitalize text-xs gap-1"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {user?.role ?? "seller"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="divide-y">
                  <InfoRow
                    icon={Mail}
                    label="Email"
                    value={user?.email ?? "—"}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Phone Number"
                    value={user?.phoneNumber ?? "—"}
                  />
                  {user?.companyName && (
                    <InfoRow
                      icon={Building2}
                      label="Company"
                      value={user.companyName}
                    />
                  )}
                  {user?.address && (
                    <InfoRow
                      icon={MapPin}
                      label="Address"
                      value={user.address}
                    />
                  )}
                  {user?.licenseNumber && (
                    <InfoRow
                      icon={Hash}
                      label="License Number"
                      value={user.licenseNumber}
                    />
                  )}
                  <InfoRow
                    icon={MailCheck}
                    label="Email Verified"
                    value={
                      user?.emailVerified ? (
                        <Badge
                          variant="secondary"
                          className="text-xs text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                        >
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-xs text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          Pending
                        </Badge>
                      )
                    }
                  />
                  <InfoRow
                    icon={ShieldCheck}
                    label="KYC Status"
                    value={
                      user?.kycApproved ? (
                        <Badge
                          variant="secondary"
                          className="text-xs text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                        >
                          Approved
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-xs text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          Pending
                        </Badge>
                      )
                    }
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Member Since"
                    value={
                      user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "—"
                    }
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Bank account card */}
        <AddBankAccount
          existingBankCode={user?.bankCode}
          existingAccountNumber={user?.accountNumber}
          existingAccountName={user?.accountName}
        />
      </div>
    </div>
  );
}
