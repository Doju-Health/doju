import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  tbClassName?: string;
  trClassName?: string;
  thClassName?: string;
  tcClassName?: string;
  thTextClassName?: string;
  tableConfig?: Partial<TableOptions<TData>>;
  rowClick?: (row: Row<TData>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  tbClassName,
  trClassName,
  thClassName,
  tcClassName,
  thTextClassName,
  tableConfig = {},
  rowClick = () => {},
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...tableConfig,
  });

  return (
    <Table className={cn("bg-background-1", className)}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className={cn("hover:bg-unse", thClassName)}
          >
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} className={cn("", thTextClassName)}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className={cn(tbClassName)}>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className={cn(
                "cursor-pointer",
                // "odd:bg-gray_100 even:bg-white hover:bg-unset",
                trClassName,
              )}
              onClick={() => rowClick(row)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className={cn(tcClassName)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
