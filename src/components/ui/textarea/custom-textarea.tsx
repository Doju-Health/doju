import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";
import React from "react";
import { Label } from "../label";

interface CustomTextareaProps {
  label?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string | boolean;
  className?: string;
  name?: string;
  isRequired?: boolean;
  labelClassName?: string;
  [key: string]: any;
}

export const CustomTextarea: React.FC<CustomTextareaProps> = ({
  label,
  value,
  onChange,
  error,
  name,
  className,
  labelClassName,
  isRequired = true,
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <Label htmlFor={name} className={cn("font-light", labelClassName)}>
          {label}
          {isRequired && (
            <span className="ml-1 mb-3 h-0 text-sm leading-none text-red-600">
              *
            </span>
          )}
        </Label>
      )}
      <div className="relative">
        <Textarea
          {...props}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full outline-none ${
            error ? "border-destructive" : ""
          } ${className}`}
        />
      </div>
      {error && <small className="mt-1 text-destructive">{error}</small>}
    </div>
  );
};
