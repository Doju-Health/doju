import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import {
  AlertTriangle,
  Upload,
  Building2,
  FileBadge2,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CustomInput } from "@/components/ui/input/custom-input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useFormHandler } from "@/hooks/use-form-handler";
import { useUploadImage } from "../../api/use-upload-image";
import { useUpdateProfile } from "../../api/use-update-profile";
import { Progress } from "@/components/ui/progress";

type FileErrors = {
  ninImage?: string;
  cacDocument?: string;
};

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

export default function KYCVerificationPage() {
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

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [ninImage]);

  useEffect(() => {
    if (!cacDocument || !cacDocument.type.startsWith("image/")) {
      setCacPreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(cacDocument);
    setCacPreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [cacDocument]);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    submitForm,
    resetForm,
  } = useFormHandler({
    initialValues: {
      businessName: "",
      businessRcNumber: "",
    },
    validationSchema: yup.object({
      businessName: yup.string().required("Business name is required"),
      businessRcNumber: yup.string().required("Business RC Number is required"),
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

        const [cacUrl] = await uploadImage({
          files: [cacDocument as File],
          onUploadProgress: (progress) => {
            setUploadProgress(50 + Math.round(progress * 0.5));
          },
        });

        setUploadProgress(100);

        await updateProfile({
          companyName: values.businessName.trim(),
          licenseNumber: values.businessRcNumber.trim(),
          ninUrl,
          cacUrl,
        });

        toast.success("KYC submitted for verification.");
        resetForm();
        setNinImage(null);
        setCacDocument(null);
        setFileErrors({});
      } catch {
        // Errors are handled by the upload and profile hooks.
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">
          Submit your business details and documents for verification.
        </p>
      </div>

      <div className="rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-amber-800">
        <p className="flex items-start gap-2 text-sm font-semibold">
          <AlertTriangle className="mt-0.5 size-4" />
          Action Required: Complete your KYC
        </p>
        <p className="mt-1 text-sm">
          To enable withdrawals and unlock all seller features, you must verify
          your identity and business details.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const nextFileErrors: FileErrors = {};
              if (!ninImage) {
                nextFileErrors.ninImage = "NIN image is required";
              }
              if (!cacDocument) {
                nextFileErrors.cacDocument = "Business CAC upload is required";
              }
              setFileErrors(nextFileErrors);
              submitForm();
            }}
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Personal Details</h2>
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
                    "flex h-56 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-doju-lime/40 bg-doju-lime-pale/40 px-4 text-center",
                    fileErrors.ninImage && "border-destructive",
                  )}
                >
                  {ninPreviewUrl ? (
                    <div className="relative h-56 w-full">
                      <img
                        src={ninPreviewUrl}
                        alt="NIN preview"
                        className="h-56 w-full object-cover"
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

            <div className="space-y-4 pt-2">
              <h2 className="text-2xl font-semibold">Business Registration</h2>
              <div className="h-px w-full bg-border" />

              <div className="space-y-2">
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
              </div>

              <div className="space-y-2">
                <CustomInput
                  name="businessRcNumber"
                  label="Business Registration Number (RC Number)"
                  placeholder="e.g. RC1234567"
                  value={values.businessRcNumber}
                  onChange={handleChange}
                  error={touched.businessRcNumber && errors.businessRcNumber}
                  leftIcon={
                    <FileBadge2 className="size-4 text-muted-foreground" />
                  }
                  leftIconCls="placeholder:pl-1"
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Business Registration Document (CAC)</Label>

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
                    "flex h-56 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-md border border-dashed border-doju-lime/40 bg-doju-lime-pale/40 px-4 text-center",
                    fileErrors.cacDocument && "border-destructive",
                  )}
                >
                  {cacPreviewUrl ? (
                    <div className="relative h-56 w-full">
                      <img
                        src={cacPreviewUrl}
                        alt="CAC preview"
                        className="h-56 w-full object-cover"
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

            <div className="flex justify-end gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
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

            {isSubmitting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Uploading documents and submitting...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
