import { motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

/** Support line, digits only — wa.me rejects "+", spaces and dashes. */
const WHATSAPP_NUMBER = "2348139273018";

interface WhatsAppFloatProps {
  /** Pre-filled first message. Omit to open an empty chat. */
  message?: string;
}

/**
 * Floating WhatsApp button pinned to the bottom-right.
 *
 * Sits at z-40 so modals, drawers and toasts (all z-50) render above it rather
 * than having this hover over them.
 */
export const WhatsAppFloat = ({
  message = "Hi Doju Health, I'd like to make an enquiry.",
}: WhatsAppFloatProps) => {
  const href = message
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Doju Health on WhatsApp"
      title="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-colors hover:bg-[#1ebe5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </motion.a>
  );
};

export default WhatsAppFloat;
