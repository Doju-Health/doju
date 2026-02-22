import { cn } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";

interface DataTableWrapperProps extends HTMLAttributes<HTMLDivElement> {}

export const DataTableWrapper: FC<DataTableWrapperProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("border rounded-lg overflow-auto", className)}
      {...props}
    />
  );
};
