import { Suspense, ComponentType } from "react";
import { Loader } from "lucide-react";
import { ErrorBoundary } from "../error-boundary/error-boundary";

export const withSuspense = <P extends object>(Component: ComponentType<P>) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <Loader className="size-8 text-primary animate-spin" />
          </div>
        }
      >
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withSuspense(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
};
