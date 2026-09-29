import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqSection {
  id: string;
  title: string;
  items: { question: string; answer: string }[];
}

const FAQ_SECTIONS: FaqSection[] = [
  {
    id: "general",
    title: "General Questions",
    items: [
      {
        question: "What is DOJU?",
        answer:
          "DOJU is a healthcare marketplace that connects buyers with trusted vendors of medical equipment, healthcare supplies, physiotherapy and rehabilitation products, orthopaedic aids, medical consumables, healthcare apparel, wellness and fitness products, medical textbooks and other healthcare-related products.",
      },
      {
        question: "Who can use DOJU?",
        answer:
          "DOJU can be used by individuals, healthcare professionals, hospitals, clinics, healthcare organisations, businesses and other buyers looking for healthcare and wellness products.",
      },
      {
        question: "How do I register?",
        answer:
          "Click on Login / Register on the DOJU website and follow the registration instructions. You will be required to provide the necessary information to create your account.",
      },
      {
        question: "Is DOJU available across Africa?",
        answer:
          "DOJU currently operates in Nigeria, connecting buyers with healthcare product vendors. As the marketplace grows, DOJU aims to expand its reach to more locations across Africa.",
      },
      {
        question: "How secure is my data on DOJU?",
        answer:
          "DOJU takes reasonable measures to protect the information provided by users. Your personal and account information is handled in accordance with DOJU's applicable privacy and security practices.",
      },
      {
        question: "Can I browse DOJU without creating an account?",
        answer:
          "Yes. You can browse products and explore available listings without creating an account. You may need to register or log in to complete certain activities, such as placing an order.",
      },
      {
        question: "What products can I find on DOJU?",
        answer:
          "You can find medical equipment, healthcare supplies, physiotherapy and rehabilitation products, orthopaedic aids, consumables, scrubs and healthcare apparel, wellness and gym products, medical textbooks and other related products.",
      },
    ],
  },
  {
    id: "buyers",
    title: "For Healthcare Providers & Buyers",
    items: [
      {
        question: "How do healthcare providers benefit from DOJU?",
        answer:
          "DOJU gives healthcare providers access to a marketplace where they can discover and purchase healthcare products from different vendors in one place. This can make product discovery and procurement more convenient.",
      },
      {
        question: "Can I place large orders for hospitals or clinics?",
        answer:
          "Yes. Healthcare organisations and other buyers can enquire about large or bulk orders. Availability, pricing, minimum quantities and fulfilment arrangements may depend on the vendor.",
      },
      {
        question: "How do I find a product on DOJU?",
        answer:
          "You can use the search function to look for a specific product or browse through the available product categories.",
      },
      {
        question: "How do I place an order?",
        answer:
          "Select the product you want, add it to your cart, review your order details and proceed to checkout. Follow the instructions provided to complete your purchase.",
      },
      {
        question: "How does DOJU verify the quality of suppliers?",
        answer:
          "DOJU has a vendor onboarding and verification process designed to collect relevant information about suppliers before they are approved to operate on the marketplace. Buyers should also review product information and applicable vendor details before purchasing.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Where tracking is available, you can monitor your order status through your DOJU account or using the tracking information provided after your order has been processed.",
      },
      {
        question: "What if there's an issue with my order?",
        answer:
          "Contact DOJU support as soon as possible and provide your order number and details of the issue. Our team will guide you through the appropriate resolution process.",
      },
      {
        question: "What if I receive the wrong or damaged product?",
        answer:
          "Contact DOJU support with your order details and, where applicable, photographs or videos showing the issue. Your case will be reviewed in accordance with the applicable return and dispute policies.",
      },
      {
        question: "Can I cancel my order?",
        answer:
          "Order cancellation depends on the status of your order and the applicable cancellation terms. Contact DOJU support as soon as possible if you need to cancel an order.",
      },
    ],
  },
  {
    id: "vendors",
    title: "For Suppliers / Vendors",
    items: [
      {
        question: "Why should suppliers join DOJU?",
        answer:
          "DOJU gives healthcare product suppliers an opportunity to showcase their products to buyers through a dedicated healthcare marketplace. Vendors can reach healthcare professionals, organisations, businesses and individual buyers looking for healthcare-related products.",
      },
      {
        question: "How do I become a vendor on DOJU?",
        answer:
          "Select the vendor registration option on the DOJU website or visit dojuhealth.com/auth and complete the required registration and verification process. Once your application has been reviewed and approved, you can begin listing eligible products.",
      },
      {
        question: "How do I list my products on DOJU?",
        answer:
          "After completing the vendor onboarding process, approved vendors can add their products through their vendor account by providing the required product information, pricing, images and other relevant details.",
      },
      {
        question: "How does DOJU verify suppliers?",
        answer:
          "DOJU requires vendors to provide relevant personal or business information and verification documents during onboarding. This process helps establish vendor identity and promotes accountability and trust within the marketplace.",
      },
      {
        question: "What information do I need to become a vendor?",
        answer:
          "You may be required to provide personal or business information and identity documentation, including information required for KYC verification. The exact requirements may depend on your vendor account and applicable DOJU policies.",
      },
      {
        question: "Can I sell multiple products on DOJU?",
        answer:
          "Yes. Approved vendors can list multiple eligible products across the relevant DOJU categories, subject to the marketplace's product requirements.",
      },
      {
        question: "How do vendors receive payments?",
        answer:
          "Vendor payments are handled according to DOJU's payment and settlement process. Vendors should follow the payment instructions provided through their DOJU account. Payments are held in our payment system (Flutterwave) and vendors are paid as soon as the buyer receives the products.",
      },
      {
        question: "Can vendors ask customers to pay directly?",
        answer:
          "For the protection of both buyers and vendors, transactions should follow DOJU's approved payment process. Vendors should not request customers to make payments outside the DOJU platform.",
      },
    ],
  },
  {
    id: "payments-disputes",
    title: "Payments & Disputes",
    items: [
      {
        question: "How are payments handled?",
        answer:
          "Payments for orders are made through the DOJU platform using the available payment options at checkout. Keeping payments within the platform helps maintain a clear transaction record and supports the marketplace's dispute-resolution process.",
      },
      {
        question: "What happens if there is a payment dispute?",
        answer:
          "Contact DOJU support and provide your order details and information about the issue. DOJU may review relevant transaction and order information and guide both parties through the applicable dispute-resolution process.",
      },
      {
        question: "What should I do if a vendor asks me to pay outside DOJU?",
        answer:
          "Do not proceed with the external payment. Report the request to DOJU support. Keeping your transaction within the approved DOJU payment process helps protect both buyers and vendors.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Refunds are subject to the applicable DOJU and vendor policies and the circumstances surrounding the order. If you believe you are entitled to a refund, contact DOJU support with your order details.",
      },
    ],
  },
  {
    id: "payments-delivery",
    title: "Payments & Delivery",
    items: [
      {
        question: "What currency does DOJU accept?",
        answer:
          "DOJU currently operates primarily in Nigeria and product prices are generally displayed in Nigerian Naira (₦) unless otherwise stated.",
      },
      {
        question: "What payment methods are available?",
        answer:
          "Available payment methods will be displayed during checkout. Payment options may vary depending on the order and applicable payment processing arrangements.",
      },
      {
        question: "Are there additional shipping or delivery fees?",
        answer:
          "Delivery fees may apply depending on the product, vendor, delivery location, order size and logistics arrangements. Any applicable delivery charges will be communicated during the ordering process.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Delivery times vary depending on the vendor, product availability, delivery location and logistics provider. The applicable delivery information will be provided during the ordering process where available.",
      },
      {
        question: "Does DOJU offer nationwide delivery?",
        answer:
          "Yes, DOJU offers nationwide delivery. Available delivery options will be communicated when you place your order.",
      },
      {
        question: "Who handles delivery?",
        answer:
          "Orders may be fulfilled through logistics partners or other delivery arrangements depending on the vendor, product and delivery location.",
      },
    ],
  },
  {
    id: "returns-disputes",
    title: "Returns & Disputes",
    items: [
      {
        question: "Can I return a product?",
        answer:
          "Returns are subject to the applicable DOJU and vendor return policies. Some products may have specific return conditions, so buyers should review the applicable terms before placing an order.",
      },
      {
        question: "What if my order is incomplete?",
        answer:
          "Contact DOJU support with your order number and details of the missing item. Our team will assist with the next steps.",
      },
      {
        question: "How do I report a vendor?",
        answer:
          "If you experience a serious issue with a vendor, product or transaction, contact DOJU support and provide the relevant details and supporting evidence. DOJU will review the report in accordance with its marketplace policies.",
      },
    ],
  },
  {
    id: "technical-support",
    title: "Technical Support",
    items: [
      {
        question: "How do I contact DOJU support?",
        answer:
          "You can contact DOJU through the support channels provided on the website. When contacting support about an order, include your order number to help us assist you more quickly.",
      },
      {
        question: "What should I do if I forget my password?",
        answer:
          "Click Forgot Password on the login page and follow the instructions to reset your password.",
      },
      {
        question: "Can I change my account information?",
        answer:
          "Yes. You can update applicable account information through your account settings. Some verified information may require additional verification before it can be changed.",
      },
      {
        question: "What should I do if I cannot access my account?",
        answer:
          "Try resetting your password first. If you are still unable to access your account, contact DOJU support with the relevant account information so our team can assist you.",
      },
      {
        question: "What if I cannot find the answer to my question?",
        answer:
          "Contact the DOJU support team through the available support channels and provide as much information as possible about your enquiry.",
      },
    ],
  },
];

const SUPPORT_EMAIL = "support@dojuhealth.com";

// Lets search engines show questions and answers directly in results.
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  ),
};

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <SEO
        title="Frequently Asked Questions"
        description="Answers to common questions about buying and selling healthcare products on DOJU — orders, vendors, payments, delivery, returns and account support."
        keywords="DOJU FAQ, Doju Health help, medical marketplace Nigeria questions, how to sell on Doju, Doju delivery, Doju refunds"
        canonical="/faq"
        structuredData={faqStructuredData}
      />
      <Header />
      <main className="flex-1 py-10 sm:py-16">
        <div className="container max-w-3xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground mb-8">
              Find answers to common questions about using DOJU as a buyer or
              vendor.
            </p>

            {/* Jump links */}
            <nav className="flex flex-wrap gap-2 mb-10">
              {FAQ_SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-full border border-border px-3 py-1.5 text-xs sm:text-sm text-muted-foreground hover:border-doju-lime hover:text-foreground transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </nav>

            <div className="space-y-10">
              {FAQ_SECTIONS.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {section.title}
                  </h2>
                  <Accordion type="multiple">
                    {section.items.map((item, index) => (
                      <AccordionItem
                        key={item.question}
                        value={`${section.id}-${index}`}
                      >
                        <AccordionTrigger className="text-left text-foreground hover:no-underline hover:text-doju-lime">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Still have questions?
              </h2>
              <p className="text-muted-foreground mb-4">
                Our support team is happy to help.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 font-medium text-doju-lime hover:underline"
              >
                <Mail className="h-4 w-4" />
                {SUPPORT_EMAIL}
              </a>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
