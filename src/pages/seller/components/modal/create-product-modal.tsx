import { CustomInput } from "@/components/ui/input/custom-input";
import { CustomModal } from "@/components/ui/modal";
import { useFormHandler } from "@/hooks/use-form-handler";
import { useState, useRef } from "react";
import * as yup from "yup";
import { useGetCategories } from "../../api/use-get-categories";
import { CustomSelect } from "@/components/ui/select/custom-select";
import { CustomTextarea } from "@/components/ui/textarea/custom-textarea";
import { Button } from "@/components/ui/button";
import { useAddProduct } from "../../api/use-add-products";
import { useUploadImage } from "../../api/use-upload-image";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export const CreateProductModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: categories, isPending: isCategoriesLoading } =
    useGetCategories();
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: addProduct, isPending: isAddingProduct } = useAddProduct();
  const { mutateAsync: uploadImages, isPending: isUploading } =
    useUploadImage();

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    setValues,
    resetForm,
  } = useFormHandler({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Product name is required"),
      description: yup.string().required("Product description is required"),
      price: yup
        .number()
        .required("Price is required")
        .positive("Price must be positive"),
      stock: yup
        .number()
        .required("Stock is required")
        .integer("Stock must be an integer")
        .min(0, "Stock cannot be negative"),
      categoryId: yup.string().required("Category is required"),
    }),
    onSubmit: async () => {
      if (selectedFiles.length === 0) {
        setFileError("Please upload at least one image");
        return;
      }

      try {
        // Upload images first
        const uploadedUrls = await uploadImages(selectedFiles);
        const imageUrlArray = Array.isArray(uploadedUrls)
          ? uploadedUrls
          : [uploadedUrls];

        // Submit product with image URLs
        addProduct(
          { ...values, imageUrl: imageUrlArray },
          {
            onSuccess: () => {
              setOpen(false);
              setSelectedFiles([]);
              setFileError("");
              resetForm();
            },
          },
        );
      } catch {
        // Error is handled by useUploadImage hook
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setFileError("");
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleModalClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedFiles([]);
      setFileError("");
      resetForm();
    }
  };
  return (
    <CustomModal
      open={open}
      openChange={handleModalClose}
      trigger={children}
      title="Create New Product"
      position="right"
    >
      <form action="" className="space-y-4" onSubmit={handleSubmit}>
        <CustomInput
          name="name"
          label="Product name"
          value={values.name}
          onChange={handleChange}
          error={touched.name && errors.name}
        />
        <CustomTextarea
          name="description"
          label="Product description"
          value={values.description}
          onChange={handleChange}
          error={touched.description && errors.description}
        />
        <div className="grid grid-cols-2 gap-5">
          <CustomInput
            name="price"
            label="Price(NGN)"
            type="number"
            value={values.price}
            onChange={handleChange}
            error={touched.price && errors.price}
          />
          <CustomInput
            name="stock"
            label="Stock"
            type="number"
            value={values.stock}
            onChange={handleChange}
            error={touched.stock && errors.stock}
          />
        </div>
        <CustomSelect
          name="categoryId"
          label="Category"
          triggerClassName="w-full"
          placeholder="Select Category"
          value={values.categoryId}
          onValueChange={(value) => setValues({ ...values, categoryId: value })}
          options={categories?.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          error={touched.categoryId && errors.categoryId}
          disabled={isCategoriesLoading}
        />

        {/* Multi-file Image Upload */}
        <div className="w-full font-reddit">
          <Label className="text-sm font-reddit font-medium leading-none mb-2 block">
            Product Images
          </Label>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center gap-2 w-full rounded-lg border border-dashed border-input bg-background px-4 py-6 text-sm transition-colors cursor-pointer",
              "hover:border-ring hover:bg-muted/50",
              fileError && "border-destructive",
            )}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-muted-foreground text-center">
              Click to upload images
              <br />
              <span className="text-xs">PNG, JPG, WEBP (multiple allowed)</span>
            </span>
          </div>

          {fileError && (
            <p className="text-sm text-destructive mt-1.5">{fileError}</p>
          )}

          {/* Selected files preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-muted-foreground">
                {selectedFiles.length} image
                {selectedFiles.length > 1 ? "s" : ""} selected
              </p>
              <div className="grid grid-cols-3 gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="relative group rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-20 object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                      <p className="text-[10px] text-white truncate">
                        {file.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          isLoading={isAddingProduct || isUploading}
          type="submit"
          variant="doju-primary"
          className="w-full"
        >
          {isUploading ? "Uploading images..." : "Submit"}
        </Button>
      </form>
    </CustomModal>
  );
};
