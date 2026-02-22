import * as React from "react";
import * as ModalPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const ModalVariants = cva(
  "fixed z-50 flex flex-col gap-0 bg-white shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      position: {
        left: "inset-y-0 left-0 size-full data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 size-full data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        center:
          "left-1/2 top-1/2 z-50 flex max-h-[80vh] min-h-[25vh] w-full max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-sm data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      },
      size: {
        sm: "sm:max-w-[500px]",
        md: "max-h-[90vh] xl:max-w-2xl",
        lg: "max-h-[90vh] xl:max-w-6xl",
      },
    },
    compoundVariants: [
      {
        position: ["right"],
        size: ["sm"],
        className: "sm:max-w-[500px]",
      },
      {
        position: ["right"],
        size: ["md", "lg"],
        className: "sm:max-w-[820px]",
      },
      {
        position: ["center"],
        size: ["sm"],
        className: "sm:max-w-[500px]",
      },
      {
        position: ["center"],
        size: ["md"],
        className: "sm:max-w-[700px]",
      },
      {
        position: ["center"],
        size: ["lg"],
        className: "max-h-[90vh] xl:max-w-6xl",
      },
    ],
    defaultVariants: {
      position: "center",
      size: "sm",
    },
  }
);

function Modal({ ...props }: React.ComponentProps<typeof ModalPrimitive.Root>) {
  return <ModalPrimitive.Root data-slot="modal" {...props} />;
}

function ModalTrigger({
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Trigger>) {
  return <ModalPrimitive.Trigger data-slot="modal-trigger" {...props} />;
}

function ModalPortal({
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Portal>) {
  return <ModalPrimitive.Portal data-slot="modal-portal" {...props} />;
}

function ModalClose({
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Close>) {
  return <ModalPrimitive.Close data-slot="modal-close" {...props} />;
}

function ModalOverlay({
  className = "",
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Overlay>) {
  return (
    <ModalPrimitive.Overlay
      data-slot="modal-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/60",
        className
      )}
      {...props}
    />
  );
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof ModalPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ModalPrimitive.Content> & {
    position?: "left" | "right" | "center";
    size?: "sm" | "md" | "lg";
  }
>(({ position = "center", size = "sm", className, children, ...props }) => {
  return (
    <ModalPortal data-slot="modal-portal">
      <ModalOverlay />
      <ModalPrimitive.Content
        data-slot="modal-content"
        className={cn(ModalVariants({ position, size }), className)}
        {...props}
      >
        {children}
        <ModalPrimitive.Close className="cursor-pointer ring-offset-background focus:ring-primary focus:ring-2 focus:ring-offset-2 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </ModalPrimitive.Close>
      </ModalPrimitive.Content>
    </ModalPortal>
  );
});

function ModalHeader({
  className = "",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-header"
      className={cn(
        "flex flex-col gap-1 text-cente text-left px-5 py-4",
        className
      )}
      {...props}
    />
  );
}

function ModalFooter({
  className = "",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function ModalTitle({
  className = "",
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Title>) {
  return (
    <ModalPrimitive.Title
      data-slot="modal-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function ModalDescription({
  className = "",
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Description>) {
  return (
    <ModalPrimitive.Description
      data-slot="modal-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
};