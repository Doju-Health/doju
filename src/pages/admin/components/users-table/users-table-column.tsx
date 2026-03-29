import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
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

import { IUsers } from "@/types";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { formatDate } from "date-fns";
import { useState } from "react";
import { useDeactivateUser } from "../../api/use-deactivate-user";

const ActionCell = ({
  id,
  fullName,
  isActive,
}: {
  id: string;
  fullName: string;
  isActive: boolean;
}) => {
  const navigate = useNavigate();
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const { mutate: deactivateUser, isPending } = useDeactivateUser();

  const handleViewDetails = () => {
    navigate(`/admin/users/${id}`);
  };

  const handleDeactivateUser = () => {
    deactivateUser(
      { id },
      {
        onSuccess: () => {
          setIsDeactivateModalOpen(false);
        },
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
            disabled={!isActive}
            onSelect={(event) => {
              event.preventDefault();
              setIsDeactivateModalOpen(true);
            }}
          >
            Deactivate
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-cente">Delete</DropdownMenuItem>
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
              You are about to deactivate {fullName}. The user will lose access
              until reactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeactivateUser}
              disabled={isPending}
            >
              {isPending ? "Deactivating..." : "Confirm"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const getUsersColumn = (): ColumnDef<IUsers>[] => [
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
      const isActive = row.original.isActive;
      return <ActionCell id={id} fullName={fullName} isActive={isActive} />;
    },
  },
];
