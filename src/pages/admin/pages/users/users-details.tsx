import { format } from "date-fns";
import {
  ArrowLeft,
  Building2,
  BadgeCheck,
  BadgeX,
  CalendarClock,
  Mail,
  Phone,
  Trash2,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QueryWrapper } from "@/components/query-wrapper/query-wrapper";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomTextarea } from "@/components/ui/textarea/custom-textarea";
import { IUsers } from "@/types";
import { cn } from "@/lib/utils";
import { useGetAUser } from "../../api/use-get-a-user";
import { useDeleteUser } from "../../api/use-delete-user";
import { useVerifySeller } from "../../api/use-verify-seller";
import { useRejectSeller } from "../../api/use-reject-seller";
import { AdminSellerProductsTable } from "../../components/seller-products-table/seller-products-table";
import { AdminBuyerOrdersTable } from "../../components/buyer-orders-table/buyer-orders-table";

const getInitials = (name: string) => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "U";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const formatNullable = (value: string | null) => {
  if (!value || !value.trim()) return "Not provided";
  return value;
};

const getRoleBadgeClass = (role: string) => {
  if (role === "admin") return "bg-blue-100 text-blue-700 border-blue-200";
  if (role === "seller")
    return "bg-orange-100 text-orange-700 border-orange-200";
  if (role === "dispatch") {
    return "bg-violet-100 text-violet-700 border-violet-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
};

export default function UserDetails() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const getUser = useGetAUser(id);
  const { mutate: deleteUser, isPending } = useDeleteUser();
  const [deleteMode, setDeleteMode] = useState<"soft" | "hard" | null>(null);
  const { mutate: verifySeller, isPending: isVerifyPending } =
    useVerifySeller();
  const [isVerifySellerModalOpen, setIsVerifySellerModalOpen] = useState(false);
  const { mutate: rejectSeller, isPending: isRejectPending } =
    useRejectSeller();
  const [isRejectSellerModalOpen, setIsRejectSellerModalOpen] =
    useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");

  const queryPayload = getUser.data as { data?: IUsers } | IUsers | undefined;
  const user: IUsers | undefined =
    queryPayload && typeof queryPayload === "object" && "data" in queryPayload
      ? queryPayload.data
      : (queryPayload as IUsers | undefined);

  const createdAt = user?.createdAt
    ? format(new Date(user.createdAt), "PPP p")
    : "N/A";
  const updatedAt = user?.updatedAt
    ? format(new Date(user.updatedAt), "PPP p")
    : "N/A";

  const handleDeleteUser = (hard: boolean) => {
    if (!user?.id) return;

    setDeleteMode(hard ? "hard" : "soft");

    deleteUser(
      { id: user.id, hard },
      {
        onSuccess: () => {
          navigate("/admin/users");
        },
        onError: () => {
          setDeleteMode(null);
        },
      },
    );
  };

  const handleVerifySeller = () => {
    if (!user?.id) return;

    verifySeller(
      { id: user.id },
      {
        onSuccess: () => {
          setIsVerifySellerModalOpen(false);
        },
      },
    );
  };

  const handleRejectSeller = () => {
    if (!user?.id) return;

    if (!rejectReason.trim()) {
      setRejectReasonError("Please provide a reason for rejection");
      return;
    }

    rejectSeller(
      { id: user.id, reason: rejectReason.trim() },
      {
        onSuccess: () => {
          setIsRejectSellerModalOpen(false);
          setRejectReason("");
          setRejectReasonError("");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
          <div className="space-y-2">
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to users
            </Link>
            <h1 className="text-2xl font-bold">User details</h1>
            <p className="text-muted-foreground">
              Review account profile, verification state, and contact
              information.
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {user?.role === "seller" && user?.isVerified !== "verified" && (
              <AlertDialog
                open={isVerifySellerModalOpen}
                onOpenChange={setIsVerifySellerModalOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="default"
                    className="w-full sm:w-auto"
                    disabled={!user || isVerifyPending}
                  >
                    <BadgeCheck className="size-4" />
                    Verify seller
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Verify this seller?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to verify {user?.fullName ?? "this seller"}.
                      They will be able to start selling on the platform.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isVerifyPending}>
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      type="button"
                      onClick={handleVerifySeller}
                      disabled={isVerifyPending}
                    >
                      {isVerifyPending ? "Verifying..." : "Confirm"}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {user?.role === "seller" && user?.isVerified !== "verified" && (
              <AlertDialog
                open={isRejectSellerModalOpen}
                onOpenChange={(open) => {
                  setIsRejectSellerModalOpen(open);
                  if (!open) {
                    setRejectReason("");
                    setRejectReasonError("");
                  }
                }}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={!user || isRejectPending}
                  >
                    <BadgeX className="size-4" />
                    Reject seller
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject this seller?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to reject {user?.fullName ?? "this seller"}
                      . Please provide a reason for the rejection.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <CustomTextarea
                    name="rejectReason"
                    label="Reason for rejection"
                    placeholder="e.g. Submitted documents are unclear or invalid"
                    value={rejectReason}
                    onChange={(e) => {
                      setRejectReason(e.target.value);
                      if (rejectReasonError) setRejectReasonError("");
                    }}
                    error={rejectReasonError}
                    disabled={isRejectPending}
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isRejectPending}>
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRejectSeller}
                      disabled={isRejectPending}
                    >
                      {isRejectPending ? "Rejecting..." : "Confirm"}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full sm:w-auto"
                  disabled={!user || isPending}
                >
                  <Trash2 className="size-4" />
                  Delete user
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Choose how to delete this account. Soft delete keeps the
                    record for potential recovery, while hard delete permanently
                    removes it. The account for{" "}
                    <span className="font-medium text-foreground">
                      {user?.fullName ?? "this user"}
                    </span>{" "}
                    is about to be deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDeleteUser(false)}
                    disabled={isPending}
                  >
                    {isPending && deleteMode === "soft"
                      ? "Soft deleting..."
                      : "Soft delete"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleDeleteUser(true)}
                    disabled={isPending}
                  >
                    {isPending && deleteMode === "hard"
                      ? "Hard deleting..."
                      : "Hard delete"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <QueryWrapper
        currentQuery={getUser}
        customLoader={
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="grid gap-4 lg:grid-cols-2">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        }
      >
        {!user ? (
          <Card>
            <CardHeader>
              <CardTitle>User not found</CardTitle>
              <CardDescription>
                We could not load this user profile. Please go back and try
                another account.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="size-16 border">
                      <AvatarImage
                        src={user.profileImageUrl ?? undefined}
                        alt={user.fullName}
                      />
                      <AvatarFallback className="text-base font-semibold">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {user.fullName}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize",
                            getRoleBadgeClass(user.role),
                          )}
                        >
                          {user.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            user.isActive
                              ? "border-green-200 bg-green-100 text-green-700"
                              : "border-red-200 bg-red-100 text-red-700",
                          )}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            user.emailVerified
                              ? "border-green-200 bg-green-100 text-green-700"
                              : "border-amber-200 bg-amber-100 text-amber-700",
                          )}
                        >
                          {user.emailVerified
                            ? "Email verified"
                            : "Email unverified"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            user.isVerified === "verified"
                              ? "border-green-200 bg-green-100 text-green-700"
                              : user.isVerified === "pending"
                                ? "border-amber-200 bg-amber-100 text-amber-700"
                                : "border-red-200 bg-red-100 text-red-700",
                          )}
                        >
                          {user.isVerified === "verified"
                            ? "Identity verified"
                            : user.isVerified === "pending"
                              ? "Identity pending"
                              : "Identity unverified"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2 rounded-lg border bg-muted/30 p-4 text-sm lg:min-w-[280px]">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <CalendarClock className="size-4" />
                      Joined
                    </p>
                    <p className="font-medium">{createdAt}</p>
                    <Separator className="my-1" />
                    <p className="text-muted-foreground">Last updated</p>
                    <p className="font-medium">{updatedAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact information</CardTitle>
                  <CardDescription>Primary personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                      <Mail className="size-4" />
                      Email
                    </p>
                    <p className="font-medium break-all">{user.email}</p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                      <Phone className="size-4" />
                      Phone number
                    </p>
                    <p className="font-medium">
                      {formatNullable(user.phoneNumber)}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                      <UserRound className="size-4" />
                      Address
                    </p>
                    <p className="font-medium">
                      {formatNullable(user.address)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business details</CardTitle>
                  <CardDescription>
                    Information used for settlements and seller compliance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                      <Building2 className="size-4" />
                      Company name
                    </p>
                    <p className="font-medium">
                      {formatNullable(user.companyName)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {user.role === "seller"  && (
              /** verified and unverified users both display verification documents */
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Verification documents
                  </CardTitle>
                  <CardDescription>
                    Documents submitted by this seller for identity
                    verification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        NIN
                      </p>
                      {user.ninUrl ? (
                        <a
                          href={user.ninUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={user.ninUrl}
                            alt="NIN document"
                            className="rounded-lg border object-cover w-full max-h-64 hover:opacity-90 transition-opacity"
                          />
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Not provided
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        CAC
                      </p>
                      {user.cacUrl ? (
                        <a
                          href={user.cacUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={user.cacUrl}
                            alt="CAC document"
                            className="rounded-lg border object-cover w-full max-h-64 hover:opacity-90 transition-opacity"
                          />
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Not provided
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {user.role === "seller" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seller products</CardTitle>
                  <CardDescription>
                    Products currently listed by this seller.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminSellerProductsTable sellerId={user.id} />
                </CardContent>
              </Card>
            )}
            {user.role === "buyer" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Buyer Orders</CardTitle>
                  <CardDescription>
                    Orders currently placed by this buyer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminBuyerOrdersTable buyerId={user.id} />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </QueryWrapper>
    </div>
  );
}
