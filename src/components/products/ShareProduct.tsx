import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareProductProps {
  productId: string;
  productName: string;
  /** Optional line added to the shared message, e.g. the price. */
  summary?: string;
  className?: string;
  /** Icon-only trigger, for tight spots like a product card. */
  compact?: boolean;
}

type ShareChannel = {
  id: string;
  label: string;
  /** Builds the channel's share URL from the already-encoded parts. */
  href: (encodedUrl: string, encodedText: string) => string;
  icon: JSX.Element;
};

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const CHANNELS: ShareChannel[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: (url, text) => `https://wa.me/?text=${text}%20${url}`,
    icon: <WhatsAppIcon />,
  },
  {
    id: "x",
    label: "X (Twitter)",
    href: (url, text) => `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    icon: <XIcon />,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    icon: <FacebookIcon />,
  },
  {
    id: "telegram",
    label: "Telegram",
    href: (url, text) => `https://t.me/share/url?url=${url}&text=${text}`,
    icon: <TelegramIcon />,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    icon: <LinkedInIcon />,
  },
];

export const ShareProduct = ({
  productId,
  productName,
  summary,
  className,
  compact = false,
}: ShareProductProps) => {
  const [copied, setCopied] = useState(false);

  // Built from the origin rather than location.href so the shared link never
  // carries search params or a hash picked up while browsing.
  const shareUrl = `${window.location.origin}/product/${productId}`;
  const shareText = summary
    ? `${productName} — ${summary} on Doju Health`
    : `${productName} on Doju Health`;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  /**
   * On devices with the native share sheet (most phones), use it directly —
   * it offers every app the user actually has installed.
   */
  const shareNatively = async () => {
    if (!navigator.share) return false;
    try {
      await navigator.share({
        title: productName,
        text: shareText,
        url: shareUrl,
      });
      return true;
    } catch {
      // The user dismissing the sheet lands here too; nothing to report.
      return true;
    }
  };

  const handleTriggerClick = async (event: React.MouseEvent) => {
    if (navigator.share) {
      event.preventDefault();
      await shareNatively();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={className}
          aria-label={`Share ${productName}`}
          onClick={handleTriggerClick}
        >
          <Share2 className="h-4 w-4" />
          {!compact && <span className="ml-2">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {CHANNELS.map((channel) => (
          <DropdownMenuItem key={channel.id} asChild className="cursor-pointer">
            <a
              href={channel.href(encodedUrl, encodedText)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {channel.icon}
              <span className="ml-2">{channel.label}</span>
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={copyLink} className="cursor-pointer">
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="ml-2">{copied ? "Copied" : "Copy link"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareProduct;
