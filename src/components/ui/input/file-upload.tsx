import * as React from "react";
import { Upload, X, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormikContext } from "formik";
import { Label } from "../label";

export interface FileUploadProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "name"
> {
  name: string;
  label?: string;
  helperText?: string;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, name, label, helperText, accept, ...props }, ref) => {
    const formik = useFormikContext<any>();
    const [fileName, setFileName] = React.useState<string>("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const value = formik.values[name];
    const error =
      formik.touched[name] && formik.errors[name]
        ? String(formik.errors[name])
        : undefined;

    React.useEffect(() => {
      if (
        value &&
        typeof value === "object" &&
        "name" in value &&
        "size" in value
      ) {
        setFileName(value.name);
      } else if (value === null || value === undefined) {
        setFileName("");
      }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFileName(file?.name || "");
      formik.setFieldValue(name, file);
      formik.setFieldTouched(name, true, false);
    };

    const handleClear = () => {
      setFileName("");
      formik.setFieldValue(name, null);
      formik.setFieldTouched(name, true, false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    return (
      <div className={cn("w-full font-reddit", className)}>
        {label && (
          <Label
            htmlFor={name}
            className="text-sm font-reddit font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
          >
            {label}
          </Label>
        )}

        <input
          type="file"
          ref={inputRef}
          id={name}
          name={name}
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          {...props}
        />

        <div
          onClick={handleClick}
          className={cn(
            "flex items-center gap-3 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm transition-colors cursor-pointer",
            "hover:border-ring focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            error && "border-destructive focus-within:ring-destructive",
          )}
        >
          <div className="flex-1 flex items-center gap-3 min-w-0">
            {fileName ? (
              <>
                <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="truncate text-foreground">{fileName}</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Choose a file...</span>
              </>
            )}
          </div>

          {fileName && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear file</span>
            </Button>
          )}
        </div>

        {error && <p className="text-sm text-destructive mt-1.5">{error}</p>}

        {helperText && !error && (
          <p className="text-sm text-muted-foreground mt-1.5">{helperText}</p>
        )}
      </div>
    );
  },
);
FileUpload.displayName = "FileUpload";

export { FileUpload };
