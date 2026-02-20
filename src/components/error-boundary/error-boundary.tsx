import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";
import {
  ErrorBoundary as ReactErrorBoundary,
  FallbackProps,
} from "react-error-boundary";

const Fallback = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="mx-auto max-w-[350px] py-[70px]">
      <div className="flex flex-col items-center justify-center gap-5">
        <AlertCircle />

        <p className="text-base font-medium">
          Something went wrong.
          <br /> Please check back again!
        </p>

        <Button className="w-full" onClick={resetErrorBoundary}>
          Try Again
        </Button>
      </div>
    </div>
  );
};

export const ErrorBoundary = ({
  fallback: FallbackComponent = Fallback,
  children,
}: {
  fallback?: React.ComponentType<FallbackProps>;
  children: ReactNode;
}) => {
  return (
    <ReactErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ReactErrorBoundary>
  );
};
