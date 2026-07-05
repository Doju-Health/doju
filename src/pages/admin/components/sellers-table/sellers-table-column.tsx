import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock, EllipsisVertical, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { IUsers } from "@/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { formatDate } from "date-fns";
import { useDeactivateUser } from "../../api/use-deactivate-user";
import { useDeleteUser } from "../../api/use-delete-user";

const getStatusBadge = (status: IUsers["isVerified"]) => {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-green-100 text-green-700 gap-1 hover:bg-green-200">
          <CheckCircle className="h-3 w-3" />
          Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 gap-1 hover:bg-yellow-200">
          <Clock className="h-3 w-3" /> 
          Pending
        </Badge>
      );
    case "unverified":
      return (
        <Badge className="bg-red-100 text-red-700 gap-1 hover:bg-red-200">
          <X className="h-3 w-3" />
          Unverified
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const ActionCell = ({ id, fullName }: { id: string; fullName: string }) => {
  const navigate = useNavigate();
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"soft" | "hard" | null>(null);
  const { mutate: deactivateUser, isPending: isDeactivatePending } =
    useDeactivateUser();
  const { mutate: deleteUser, isPending: isDeletePending } = useDeleteUser();

  const handleViewDetails = () => {
    navigate(`/admin/users/${id}`);
  };

  const handleDeactivate = () => {
    deactivateUser(
      { id },
      { onSuccess: () => setIsDeactivateModalOpen(false) },
    );
  };

  const handleDelete = (hard: boolean) => {
    setDeleteMode(hard ? "hard" : "soft");
    deleteUser(
      { id, hard },
      {
        onSuccess: () => setIsDeleteModalOpen(false),
        onError: () => setDeleteMode(null),
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <EllipsisVertical className="size-5 text-gray-600 dark:text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="hover:text-white! cursor-pointer"
            onClick={handleViewDetails}
          >
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="justify-cente"
            onClick={() => setIsDeactivateModalOpen(true)}
          >
            Deactivate
          </DropdownMenuItem>
          <DropdownMenuItem
            className="justify-cente"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeactivateModalOpen}
        onOpenChange={setIsDeactivateModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate this user?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to deactivate {fullName || "this user"}. They
              will lose access until reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeactivatePending}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeactivate}
              disabled={isDeactivatePending}
            >
              {isDeactivatePending ? "Deactivating..." : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how to delete this account. Soft delete keeps the record
              for potential recovery, while hard delete permanently removes
              it. The account for{" "}
              <span className="font-medium text-foreground">
                {fullName || "this user"}
              </span>{" "}
              is about to be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDelete(false)}
              disabled={isDeletePending}
            >
              {isDeletePending && deleteMode === "soft"
                ? "Soft deleting..."
                : "Soft delete"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleDelete(true)}
              disabled={isDeletePending}
            >
              {isDeletePending && deleteMode === "hard"
                ? "Hard deleting..."
                : "Hard delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const getSellersColumn = (): ColumnDef<IUsers>[] => [
  {
    header: "NAME",
    accessorKey: "name",
    cell: ({ row }) => {
      const user = row.original.fullName;
      const userEmail = row.original.email;
      return (
        <div>
          <h2 className="font-semibold">{user}</h2>
          <p>{userEmail}</p>
        </div>
      );
    },
  },
  {
    header: "PHONE NUMBER",
    accessorKey: "phoneNumber",
    cell: ({ row }) => {
      const phoneNumber = row.original.phoneNumber;
      return (
        <div>
          <h2 className="font-semibold">{phoneNumber}</h2>
        </div>
      );
    },
  },

  {
    header: "ROLE",
    accessorKey: "role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <div>
          <h3 className="font-medium capitalize">{role}</h3>
        </div>
      );
    },
  },

  {
    header: "ACTIVE",
    accessorKey: "isActive",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <p
          className={cn(
            isActive
              ? "text-green-500 bg-green-100"
              : "text-red-500 bg-red-100",
            "px-2 py-1 text-xs w-fit rounded-full",
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </p>
      );
    },
  },
  {
    header: "STATUS",
    accessorKey: "isVerified",
    cell: ({ row }) => {
      const isVerified = row.original.isVerified;
      return <div>{getStatusBadge(isVerified)}</div>;
    },
  },
  {
    header: "JOINED AT",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return <p className="">{formatDate(new Date(createdAt), "PPP")}</p>;
    },
  },
  {
    header: "ACTION",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const id = row.original.id;
      const fullName = row.original.fullName;
      return <ActionCell id={id} fullName={fullName} />;
    },
  },
];
