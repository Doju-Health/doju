import { useRef, useState } from "react";
import * as yup from "yup";
import { Upload, X } from "lucide-react";
import { CustomModal } from "@/components/ui/modal";
import { CustomInput } from "@/components/ui/input/custom-input";
import { CustomTextarea } from "@/components/ui/textarea/custom-textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFormHandler } from "@/hooks/use-form-handler";
import { useUploadImage } from "../../api/use-upload-image";
import { useCreateCategory } from "../../api/use-create-category";

const MAX_IMAGE_SIZE_BYTES = 10485760;

export const CreateCategoryModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCreateCategory();
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadImage();

  const { values, errors, touched, handleChange, handleSubmit, resetForm } =
    useFormHandler({
      initialValues: {
        name: "",
        description: "",
      },
      validationSchema: yup.object({
        name: yup.string().required("Category name is required"),
        description: yup.string().required("Category description is required"),
      }),
      onSubmit: async () => {
        if (!selectedFile) {
          setFileError("Please upload one category image");
          return;
        }

        try {
          const uploadedUrls = await uploadImage([selectedFile]);
          const imageUrl = Array.isArray(uploadedUrls)
            ? uploadedUrls[0]
            : uploadedUrls;

          createCategory(
            {
              ...values,
              imageUrl,
            },
            {
              onSuccess: () => {
                setOpen(false);
                setSelectedFile(null);
                setFileError("");
                resetForm();
              },
            },
          );
        } catch {
          // Upload errors are handled in hook
        }
      },
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setFileError("Image must not exceed 10MB");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleModalClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedFile(null);
      setFileError("");
      resetForm();
    }
  };

  return (
    <CustomModal
      open={open}
      openChange={handleModalClose}
      trigger={children}
      title="Create Category"
      position="right"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <CustomInput
          name="name"
          label="Category name"
          value={values.name}
          onChange={handleChange}
          error={touched.name && errors.name}
        />

        <CustomTextarea
          name="description"
          label="Description"
          value={values.description}
          onChange={handleChange}
          error={touched.description && errors.description}
        />

        <div className="w-full">
          <Label className="text-sm font-medium mb-2 block">Image</Label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center gap-2 w-full rounded-lg border border-dashed border-input bg-background px-4 py-6 text-sm transition-colors cursor-pointer hover:border-ring hover:bg-muted/50",
              fileError && "border-destructive",
            )}
          >
            <Upload className="h-7 w-7 text-muted-foreground" />
            <span className="text-muted-foreground text-center">
              Click to upload one image
            </span>
          </div>

          {fileError && (
            <p className="text-sm text-destructive mt-1.5">{fileError}</p>
          )}

          {selectedFile && (
            <div className="mt-3">
              <div className="relative rounded-lg overflow-hidden border border-border w-32">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt={selectedFile.name}
                  className="w-32 h-24 object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {selectedFile.name}
              </p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="doju-primary"
          className="w-full"
          isLoading={isCreatingCategory || isUploading}
        >
          {isUploading ? "Uploading image..." : "Create Category"}
        </Button>
      </form>
    </CustomModal>
  );
};
