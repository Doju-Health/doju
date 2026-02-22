import { useState, useEffect } from "react";
import { Button } from "../button";
import { Eye, EyeOff, X } from "lucide-react";
import { blockInvalidChar, cn } from "@/lib/utils";
import { Label } from "../label";
import { Input } from "./input";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  groupClassName?: string;
  labelClassName?: string;
  label?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  leftIconCls?: string;
  className?: string;
  isRequired?: boolean;
  error?: string | boolean;
  tagMode?: boolean;
  tags?: string[];
  onTagsChange?: (tags: string[]) => void;
  [key: string]: any;
}

export const CustomInput = ({
  groupClassName,
  labelClassName,
  leftIconCls,
  label,
  type,
  name,
  rightIcon,
  leftIcon,
  className,
  isRequired = true,
  error,
  tagMode = false,
  tags = [],
  onTagsChange,
  ...props
}: CustomInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localValue, setLocalValue] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    // keep localValue in sync when parent controls value (optional)
    if (!tagMode && props.value !== undefined)
      setLocalValue(String(props.value));
  }, [props.value, tagMode]);

  return (
    <div className={cn("flex w-full flex-col gap-1.5 ", groupClassName)}>
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
      <div className="relative flex-1">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
            {leftIcon}
          </div>
        )}
        <Input
          type={type === "password" && showPassword ? "text" : type}
          className={cn(
            leftIcon &&
              `pl-10 placeholder:font-light!  placeholder:font-reddit! ${leftIconCls}`,
            rightIcon && "pr-10",
            error && "!border-destructive",
            type === "number" &&
              "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:appearance-none",
            className,
          )}
          id={name}
          name={name}
          value={tagMode ? localValue : props.value}
          onChange={(e) => {
            if (tagMode) setLocalValue(e.target.value);
            props.onChange && props.onChange(e as any);
          }}
          onKeyDown={(e) => {
            if (tagMode && e.key === "Enter") {
              e.preventDefault();
              const v = (localValue || "").trim();
              if (!v) return;
              const next = Array.isArray(tags) ? [...tags, v] : [v];
              onTagsChange && onTagsChange(next);
              setLocalValue("");
            }
            if (type === "number") {
              blockInvalidChar(e as any);
            }
            props.onKeyDown && props.onKeyDown(e as any);
          }}
          {...(type === "number" && {
            onWheel: (e: any) => e.currentTarget.blur(),
          })}
          {...props}
        />
        {(type === "password" || rightIcon) && (
          <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center">
            {type === "password" && !rightIcon ? (
              <Button
                type="button"
                variant="ghost"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
      {tagMode && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags?.map((t, i) => (
            <span
              key={i}
              className="inline-flex border capitalize items-center gap-2 rounded-lg bg-muted/20 px-3 py-1 text-sm"
            >
              <span>{t}</span>
              <button
                type="button"
                onClick={() => {
                  const next = tags.filter((_, idx) => idx !== i);
                  onTagsChange && onTagsChange(next);
                }}
                className="p-0 rounded-full border border-destructive"
                aria-label={`Remove ${t}`}
              >
                <X className="size-3 text-destructive" />
              </button>
            </span>
          ))}
        </div>
      )}
      {error && (
        <small className="mt-1 text-destructive font-reddit">{error}</small>
      )}
    </div>
  );
};
