import { ReactNode } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { cn } from "@/utils/helpers";
import { AlertIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { RingSpinner } from "@/components/ui/spinner";

interface QueryWrapperProps<TData = unknown, TError = unknown> {
  currentQuery: UseQueryResult<TData, TError>;
  children: ReactNode;
  customLoader?: ReactNode;
  showError?: boolean;
  spinnerGroupClassName?: string;
  errorGroupClassName?: string;
}

export const QueryWrapper: React.FC<QueryWrapperProps> = ({
  currentQuery,
  children,
  customLoader,
  showError = true,
  spinnerGroupClassName,
  errorGroupClassName,
}) => {
  const { error, refetch, isError, isLoading, isSuccess, isRefetching } =
    currentQuery || {};

  const handleRefetch = () => {
    refetch({ throwOnError: false });
  };

  if ((isError && isRefetching) || isLoading) {
    return (
      customLoader || (
        <div
          className={cn(
            "flex size-full min-h-56 items-center justify-center",
            spinnerGroupClassName
          )}
        >
          <RingSpinner />
        </div>
      )
    );
  }

  if (isError && showError) {
    return (
      <div
        className={cn("mx-auto max-w-[350px] py-[70px]", errorGroupClassName)}
      >
        <div className="flex flex-col items-center justify-center gap-5">
          <AlertIcon />
          <p className="text-base font-medium">
            {error && typeof error === "object" && "message" in error
              ? (error as any).message
              : "An error occurred"}
          </p>
          <Button className="w-full" onClick={handleRefetch}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return isSuccess ? <>{children}</> : null;
};
