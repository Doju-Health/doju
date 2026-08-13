import { useState } from "react";
import { FileText } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";

/**
 * Uploaded documents can be either an image or a PDF, so the extension decides
 * how we render them. Cloudinary URLs can carry `?query`/`#hash` suffixes, so
 * only the path is inspected.
 */
const isPdfUrl = (url: string) => {
  const [path] = url.split(/[?#]/);
  return path.toLowerCase().endsWith(".pdf");
};

interface DocumentPreviewProps {
  url: string;
  /** Used for the alt text and the lightbox's accessible name, e.g. "NIN". */
  label: string;
  className?: string;
}

export const DocumentPreview = ({
  url,
  label,
  className,
}: DocumentPreviewProps) => {
  const [isImageBroken, setIsImageBroken] = useState(false);

  // Some uploads land without a file extension: if it fails to load as an
  // image, fall back to the document viewer rather than a broken thumbnail.
  const isPdf = isPdfUrl(url) || isImageBroken;

  return (
    <Modal>
      <div
        className={cn(
          "group relative h-64 overflow-hidden rounded-lg border",
          className,
        )}
      >
        {isPdf ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
            <FileText className="size-8" />
            <p className="text-sm font-medium">PDF document</p>
            <p className="text-xs">Click to preview</p>
          </div>
        ) : (
          <img
            src={url}
            alt={`${label} document`}
            onError={() => setIsImageBroken(true)}
            className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
          />
        )}

        {/*
          The trigger sits on top of the media rather than wrapping it: browsers
          do not reliably lay out embedded content (`object`/`iframe`) nested
          inside a `button`, which left PDF previews blank.
        */}
        <ModalTrigger asChild>
          <button
            type="button"
            aria-label={`Preview ${label} document`}
            className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          />
        </ModalTrigger>
      </div>

      <ModalContent
        // `aria-describedby` is cleared because a lightbox has no body copy for
        // Radix to point at.
        aria-describedby={undefined}
        size="lg"
        // `size` presets cap the width at `xl:max-w-6xl`, so both the base and
        // the `xl` variant have to be widened for a full-bleed lightbox.
        className="h-[92vh] max-h-[92vh] w-[95vw] max-w-[95vw] items-center justify-center border-0 bg-transparent p-0 text-white shadow-none xl:max-w-[95vw]"
      >
        <ModalTitle className="sr-only">{`${label} document`}</ModalTitle>
        {isPdf ? (
          /*
            `object` is used instead of `iframe` so that its child content acts
            as an automatic fallback when the browser cannot display the file.
          */
          <object
            data={url}
            type="application/pdf"
            aria-label={`${label} document`}
            className="h-full w-full rounded-lg bg-white"
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted px-6 text-center text-muted-foreground">
              <FileText className="size-10" />
              <p className="text-sm font-medium">
                This PDF cannot be displayed in the browser.
              </p>
              <p className="text-xs">
                The file host may be blocking inline PDF delivery.
              </p>
            </div>
          </object>
        ) : (
          <img
            src={url}
            alt={`${label} document`}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        )}
      </ModalContent>
    </Modal>
  );
};
