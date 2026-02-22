import React from "react";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "./modal";
import { cn } from "@/lib/utils";

export interface CustomModalProps {
  open?: boolean;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  side?: "left" | "right" | "center";
  children?: React.ReactNode;
  openChange?: (open: boolean) => void;
  footer?: React.ReactNode;
  childrenClassName?: string;
  headerClassName?: string;
  trigger?: React.ReactNode;
  contentClassName?: string;
  [key: string]: any;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  open,
  title,
  description,
  footer,
  childrenClassName,
  headerClassName,
  contentClassName,
  children,
  openChange,
  trigger,
  ...rest
}) => {
  return (
    <Modal open={open} onOpenChange={openChange}>
      <ModalTrigger asChild>{trigger}</ModalTrigger>
      <ModalContent
        // onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        // className="flex flex-col gap-0 p-0 sm:max-w-[450px]"
        className={cn(
          "flex flex-col gap-0 p-0 sm:max-w-[450px] bg-white",
          contentClassName,
        )}
        {...rest}
      >
        {title && (
          <ModalHeader
            className={cn(
              "space-y-0 border-b border-border py-3 px-6",
              headerClassName,
            )}
          >
            <ModalTitle
              className={cn(
                "",
                typeof title === "string"
                  ? "w-max gap-3 font-neue font-medium text-base"
                  : "",
              )}
            >
              {title}
            </ModalTitle>
            {description && <ModalDescription>{description}</ModalDescription>}
          </ModalHeader>
        )}

        {children && (
          <div
            className={cn(
              "flex flex-1 flex-col overflow-y-auto py-4 px-6",
              childrenClassName,
            )}
          >
            {children}
          </div>
        )}
        {footer && (
          <ModalFooter
            className={cn(
              "flex-row justify-center bg-background px-6 py-4 border-t border-border",
            )}
          >
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
