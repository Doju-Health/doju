import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ICategories } from "@/types";
import { formatDate } from "date-fns";
import { clipSentence, cn } from "@/lib/utils";

const ActionCell = ({
  categoryId,
  onViewDetails,
}: {
  categoryId: string;
  onViewDetails?: (categoryId: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <EllipsisVertical className="size-5 text-gray-600 dark:text-gray-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="hover:text-white! cursor-pointer"
          onClick={() => onViewDetails?.(categoryId)}
        >
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem className="justify-cente">Edit</DropdownMenuItem>
        {/* <DropdownMenuItem className="justify-cente">Delete</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getCategoriesColumns = (
  onViewDetails?: (categoryId: string) => void,
): // onViewDetails,
ColumnDef<ICategories>[] => [
  {
    header: "NAME",
    accessorKey: "name",
    cell: ({ row }) => {
      const name = row.original.name;
      const imageUrl = row.original.imageUrl;
      return (
        <div className="flex items-center gap-3">
          <img
            src={imageUrl}
            alt={name}
            className="w-10 h-10 rounded object-cover"
          />
          <h2>{name}</h2>
        </div>
      );
    },
  },

  {
    header: "DESCRIPTION",
    accessorKey: "description",
    cell: ({ row }) => {
      const description = row.original.description;
      return <h2>{clipSentence(description, 20)}</h2>;
    },
  },

  {
    header: "STATUS",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.isActive ? "Active" : "Inactive";
      return (
        <p
          className={cn(
            "px-2 w-fit rounded-full",
            status === "Active"
              ? "text-green-500 bg-green-100"
              : "text-red-500 bg-red-100",
          )}
        >
          {status}
        </p>
      );
    },
  },
  {
    header: "DATE CREATED",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return <p className="">{formatDate(new Date(createdAt), "PP")}</p>;
    },
  },
  {
    header: "ACTION",
    accessorKey: "action",
    cell: ({ row }) => {
      const categoryId = row.original.id;
      return (
        <ActionCell categoryId={categoryId} onViewDetails={onViewDetails} />
      );
    },
  },
];
