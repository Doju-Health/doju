import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import {
  AlertTriangle,
  Building2,
  FileBadge2,
  ImagePlus,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/ui/input/custom-input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFormHandler } from "@/hooks/use-form-handler";
import { useUploadImage } from "../../api/use-upload-image";
import { useUpdateProfile } from "../../api/use-update-profile";
import { Progress } from "@/components/ui/progress";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal/modal";

type FileErrors = {
  ninImage?: string;
  cacDocument?: string;
};

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

export const KYCVerificationModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [ninImage, setNinImage] = useState<File | null>(null);
  const [cacDocument, setCacDocument] = useState<File | null>(null);
  const [fileErrors, setFileErrors] = useState<FileErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ninPreviewUrl, setNinPreviewUrl] = useState("");
  const [cacPreviewUrl, setCacPreviewUrl] = useState("");

  const ninInputRef = useRef<HTMLInputElement>(null);
  const cacInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadImage } = useUploadImage();
  const { mutateAsync: updateProfile } = useUpdateProfile();

  useEffect(() => {
    if (!ninImage || !ninImage.type.startsWith("image/")) {
      setNinPreviewUrl("");
      return;
    }
    const previewUrl = URL.createObjectURL(ninImage);
    setNinPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [ninImage]);

  useEffect(() => {
    if (!cacDocument || !cacDocument.type.startsWith("image/")) {
      setCacPreviewUrl("");
      return;
    }
    const previewUrl = URL.createObjectURL(cacDocument);
    setCacPreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [cacDocument]);

  const { values, errors, touched, handleChange, submitForm, resetForm } =
    useFormHandler({
      initialValues: {
        businessName: "",
        businessRcNumber: "",
        businessCity: "",
        businessAddress: "",
      },
      validationSchema: yup.object({
        businessName: yup.string().required("Business name is required"),
        businessRcNumber: yup.string().notRequired(),
        businessCity: yup.string().required("Business city is required"),
        businessAddress: yup.string().required("Business address is required"),
      }),
      onSubmit: async () => {
        setIsSubmitting(true);
        setUploadProgress(0);
        try {
          const [ninUrl] = await uploadImage({
            files: [ninImage as File],
            onUploadProgress: (progress) => {
              setUploadProgress(Math.round(progress * 0.5));
            },
          });

          let cacUrl: string | undefined;
          if (cacDocument) {
            const [uploadedCacUrl] = await uploadImage({
              files: [cacDocument],
              onUploadProgress: (progress) => {
                setUploadProgress(50 + Math.round(progress * 0.5));
              },
            });
            cacUrl = uploadedCacUrl;
          }

          setUploadProgress(100);

          await updateProfile({
            companyName: values.businessName.trim(),
            licenseNumber: values.businessRcNumber.trim() || undefined,
            ninUrl,
            businessAddress: values.businessAddress.trim(),
            businessCity: values.businessCity.trim(),
            ...(cacUrl ? { cacUrl } : {}),
          });

          toast.success("KYC submitted for verification.");
          resetForm();
          setNinImage(null);
          setCacDocument(null);
          setFileErrors({});
          onOpenChange(false);
        } catch {
          // Errors are handled by upload and profile hooks.
        } finally {
          setIsSubmitting(false);
        }
      },
    });

  const handleFileChange = (
    type: "ninImage" | "cacDocument",
    file: File | null,
  ) => {
    if (!file) return;

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setFileErrors((prev) => ({
        ...prev,
        [type]: "File size must not exceed 5MB",
      }));
      return;
    }

    if (type === "ninImage") {
      setNinImage(file);
    } else {
      setCacDocument(file);
    }

    setFileErrors((prev) => ({ ...prev, [type]: undefined }));
  };

  const handleSaveDraft = () => {
    const draft = {
      businessName: values.businessName,
      businessRcNumber: values.businessRcNumber,
      ninImageName: ninImage?.name ?? null,
      cacDocumentName: cacDocument?.name ?? null,
    };
    localStorage.setItem("seller_kyc_draft", JSON.stringify(draft));
    toast.success("Draft saved.");
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        position="center"
        size="lg"
        className="flex flex-col overflow-hidden bg-white"
      >
        <ModalHeader className="border-b border-border py-3 px-6 space-y-0">
          <ModalTitle className="font-neue font-medium text-base">
            Complete KYC Verification
          </ModalTitle>
        </ModalHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-amber-800">
            <p className="flex items-start gap-2 text-sm font-semibold">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              Action Required: Complete your KYC
            </p>
            <p className="mt-1 text-sm">
              To add products and unlock all seller features, you must verify
              your identity and business details.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const nextFileErrors: FileErrors = {};
              if (!ninImage) {
                nextFileErrors.ninImage = "NIN image is required";
              }
              setFileErrors(nextFileErrors);
              submitForm();
            }}
          >
            {/* Personal Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Details</h2>
              <div className="h-px w-full bg-border" />

              <div className="space-y-2">
                <Label>National Identification Number (NIN) Image</Label>

                <input
                  ref={ninInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    handleFileChange("ninImage", file);
                    if (ninInputRef.current) ninInputRef.current.value = "";
                  }}
                />

                <div
                  onClick={() => ninInputRef.current?.click()}
                  className={cn(
                    "flex h-44 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-doju-lime/40 bg-doju-lime-pale/40 px-4 text-center",
                    fileErrors.ninImage && "border-destructive",
                  )}
                >
                  {ninPreviewUrl ? (
                    <div className="relative h-44 w-full">
                      <img
                        src={ninPreviewUrl}
                        alt="NIN preview"
                        className="h-44 w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-left text-white">
                        <p className="truncate text-sm font-medium">
                          {ninImage?.name}
                        </p>
                        <p className="text-xs text-white/80">
                          Click to replace image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImagePlus className="size-8 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Click to upload NIN image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or WEBP (max. 5MB)
                      </p>
                    </>
                  )}
                </div>

                {ninImage && (
                  <p className="text-xs text-muted-foreground">
                    Selected file: {ninImage.name}
                  </p>
                )}
                {fileErrors.ninImage && (
                  <p className="text-xs text-destructive">
                    {fileErrors.ninImage}
                  </p>
                )}
              </div>
            </div>

            {/* Business Registration */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xl font-semibold">Business Registration</h2>
              <div className="h-px w-full bg-border" />

              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  name="businessName"
                  label="Registered Business Name"
                  placeholder="e.g. Acme Stores Ltd"
                  value={values.businessName}
                  onChange={handleChange}
                  error={touched.businessName && errors.businessName}
                  leftIcon={
                    <Building2 className="size-4 text-muted-foreground" />
                  }
                  leftIconCls="placeholder:pl-1"
                />
                <CustomInput
                  name="businessRcNumber"
                  label="Business Registration Number (RC Number)"
                  placeholder="e.g. RC1234567 (optional)"
                  value={values.businessRcNumber}
                  onChange={handleChange}
                  error={touched.businessRcNumber && errors.businessRcNumber}
                  leftIcon={
                    <FileBadge2 className="size-4 text-muted-foreground" />
                  }
                  leftIconCls="placeholder:pl-1"
                  isRequired={false}
                />
                <CustomInput
                  name="businessAddress"
                  label="Business Address"
                  placeholder="e.g. 123 Main Street"
                  value={values.businessAddress}
                  onChange={handleChange}
                  error={touched.businessAddress && errors.businessAddress}
                  leftIcon={
                    <FileBadge2 className="size-4 text-muted-foreground" />
                  }
                  leftIconCls="placeholder:pl-1"
                />
                <CustomInput
                  name="businessCity"
                  label="Business City"
                  placeholder="e.g. Lagos"
                  value={values.businessCity}
                  onChange={handleChange}
                  error={touched.businessCity && errors.businessCity}
                  leftIcon={
                    <FileBadge2 className="size-4 text-muted-foreground" />
                  }
                  leftIconCls="placeholder:pl-1"
                />
              </div>

              {/* CAC Document Upload */}
              <div className="space-y-2">
                <Label>
                  Upload Business Registration Document (CAC) (Optional)
                </Label>

                <input
                  ref={cacInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    handleFileChange("cacDocument", file);
                    if (cacInputRef.current) cacInputRef.current.value = "";
                  }}
                />

                <div
                  onClick={() => cacInputRef.current?.click()}
                  className={cn(
                    "flex h-44 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-doju-lime/40 bg-doju-lime-pale/40 px-4 text-center",
                    fileErrors.cacDocument && "border-destructive",
                  )}
                >
                  {cacPreviewUrl ? (
                    <div className="relative h-44 w-full">
                      <img
                        src={cacPreviewUrl}
                        alt="CAC preview"
                        className="h-44 w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-left text-white">
                        <p className="truncate text-sm font-medium">
                          {cacDocument?.name}
                        </p>
                        <p className="text-xs text-white/80">
                          Click to replace document
                        </p>
                      </div>
                    </div>
                  ) : cacDocument ? (
                    <>
                      <Upload className="size-8 text-muted-foreground" />
                      <p className="text-sm font-medium truncate max-w-full">
                        {cacDocument.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Document selected. Click to replace.
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="size-8 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG, or PNG (max. 5MB)
                      </p>
                    </>
                  )}
                </div>

                {cacDocument && (
                  <p className="text-xs text-muted-foreground">
                    Selected file: {cacDocument.name}
                  </p>
                )}
                {fileErrors.cacDocument && (
                  <p className="text-xs text-destructive">
                    {fileErrors.cacDocument}
                  </p>
                )}
              </div>
            </div>

            {isSubmitting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Uploading documents and submitting...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
              >
                Save Draft
              </Button>
              <Button
                type="submit"
                variant="doju-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit for Verification"}
              </Button>
            </div>
          </form>
        </div>
      </ModalContent>
    </Modal>
  );
};
