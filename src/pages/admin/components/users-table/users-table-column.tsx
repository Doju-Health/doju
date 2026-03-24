import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Clock,
  EllipsisVertical,
  Truck,
  XCircle,
  PackageCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { ISellerOrder, IUsers } from "@/types";
import { cn, formatPriceAmount } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { formatDate } from "date-fns";

const ActionCell = ({ id }: { id: string }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <EllipsisVertical className="size-5 text-gray-600 dark:text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="hover:text-white! cursor-pointer">
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem className="justify-cente">
          Deactivate
        </DropdownMenuItem>
        <DropdownMenuItem className="justify-cente">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getUsersColumn = (): 
ColumnDef<IUsers>[] => [
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
      return <ActionCell id={id} />;
    },
  },
];
