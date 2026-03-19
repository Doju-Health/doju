import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-8">
              Refund Policy
            </h1>
            <p className="text-muted-foreground mb-8">
              At Doju Health (“Doju”, “we”, “our”), we are committed to ensuring
              that our buyers have a smooth and reliable experience when
              purchasing health and wellness products on our platform. This
              Refund Policy governs how refunds are handled for products
              purchased on the Doju platform.
            </p>

            <div className="prose prose-neutral max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  1. Eligibility for Refunds
                </h2>
                <p className="text-muted-foreground">
                  1.1. You may request a refund if:
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    The product received is defective, damaged, or not as
                    described.
                  </li>
                  <li>You received the wrong product.</li>
                  <li>
                    The product was not delivered within the estimated delivery
                    time.
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  1.2. Refund requests must be made within [5 days] of delivery,
                  depending on the nature of the product.
                </p>
                <p className="text-muted-foreground">
                  1.3. Products that are opened and used (for personal use
                  products), or non-returnable by law or hygiene standards (e.g.
                  personal protective equipment, and items marked as final sale)
                  may not be eligible for a refund unless defective or damaged.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  2. Refund Process
                </h2>
                <p className="text-muted-foreground">
                  2.1. To request a refund, you must contact Doju through our
                  Customer Support channel or submit a request via the Platform.
                </p>
                <p className="text-muted-foreground">2.2. You must provide:</p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>Order details (order number, date, and product name).</li>
                  <li>
                    A description of the issue, including photos if applicable.
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  2.3. Doju will evaluate the request and may require the
                  product to be returned to a designated location, at which
                  point the refund process will be initiated.
                </p>
                <p className="text-muted-foreground">
                  2.4. Refunds will be processed using the original payment
                  method used for purchase, unless otherwise agreed.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  3. Refund Timeline
                </h2>
                <p className="text-muted-foreground">
                  3.1. Once the returned product is received and inspected, Doju
                  will initiate the refund within [5–7 business days].
                </p>
                <p className="text-muted-foreground">
                  3.2. The time for the refund to reflect in your account
                  depends on the payment method and financial institution.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  4. Non-Refundable Items
                </h2>
                <p className="text-muted-foreground">
                  4.1. Products that are not eligible for refunds include:
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    Products damaged after delivery due to improper handling or
                    usage.
                  </li>
                  <li>
                    Products explicitly marked as non-refundable on the
                    Platform.
                  </li>
                  <li>Products for which a refund period has expired.</li>
                </ul>
                <p className="text-muted-foreground">
                  4.2. Any product deemed ineligible for a refund will be
                  communicated to you with reasons provided.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  5. Partial Refunds
                </h2>
                <p className="text-muted-foreground">
                  5.1. In certain cases, Doju may issue a partial refund rather
                  than a full refund, depending on the condition of the returned
                  product, compliance with our refund requirements, and timing
                  of the request.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  6. Dispute Resolution
                </h2>
                <p className="text-muted-foreground">
                  6.1. If there is a disagreement regarding a refund, Doju
                  encourages users to contact Customer Support first to seek
                  resolution.
                </p>
                <p className="text-muted-foreground">
                  6.2. Unresolved disputes will be handled in accordance with
                  Doju’s Dispute Resolution Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  7. Contact Us
                </h2>
                <p className="text-muted-foreground">
                  If you have questions about this Refund Policy or wish to
                  submit a refund request, please contact us at
                  support@dojuhealth.com.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
