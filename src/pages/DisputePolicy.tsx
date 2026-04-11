import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const DisputePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-1 py-16">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-8">
              Dispute Resolution Policy
            </h1>
            <p className="text-muted-foreground mb-6">
              At Doju Health Limited (“Doju”, “we”, “our”), we strive to provide
              a smooth and reliable marketplace experience for both buyers and
              sellers. This Dispute Resolution Policy outlines how disputes
              arising from transactions on our platform are handled.
            </p>

            <div className="prose prose-neutral max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  1. Purpose
                </h2>
                <p className="text-muted-foreground">
                  1.1. This Policy exists to provide a clear, fair, and
                  transparent process for resolving disputes between buyers and
                  sellers regarding products purchased on the Doju platform.
                </p>
                <p className="text-muted-foreground">
                  1.2. Doju acts as a facilitator in resolving disputes,
                  ensuring that buyers and sellers can communicate effectively
                  and find a resolution.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  2. Types of Disputes
                </h2>
                <p className="text-muted-foreground">
                  Disputes may arise in the following circumstances:
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    Product Quality Issues: The product received is defective,
                    damaged, or not as described.
                  </li>
                  <li>
                    Wrong Product Delivered: The product delivered does not
                    match the order placed.
                  </li>
                  <li>
                    Non-Delivery: The product was not delivered within the
                    estimated delivery timeframe.
                  </li>
                  <li>
                    Payment Issues: Discrepancies in payment processing,
                    overcharges, or refunds.
                  </li>
                  <li>
                    Other Issues: Any other issue directly related to a
                    transaction between a buyer and a seller.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  3. Initiating a Dispute
                </h2>
                <p className="text-muted-foreground">
                  3.1. Buyers must submit a dispute request via the Platform or
                  through Doju Customer Support.
                </p>
                <p className="text-muted-foreground">
                  3.2. When submitting a dispute, the following information is
                  required:
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    Order details (order number, product name, and date of
                    purchase)
                  </li>
                  <li>Description of the issue</li>
                  <li>
                    Supporting evidence (e.g., photographs, screenshots, or
                    relevant documents)
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  3.3. Disputes must generally be submitted within [3 days] of
                  receiving the product or encountering the issue.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  4. Dispute Resolution Process
                </h2>
                <p className="text-muted-foreground">
                  4.1. Upon receipt of a dispute, Doju will notify the seller
                  and request their response within a reasonable timeframe.
                </p>
                <p className="text-muted-foreground">
                  4.2. Both parties are expected to provide accurate and
                  complete information to facilitate resolution.
                </p>
                <p className="text-muted-foreground">
                  4.3. Doju may suggest or mediate a solution, which could
                  include:
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>Product replacement</li>
                  <li>Refund (full or partial)</li>
                  <li>Other mutually agreed resolutions</li>
                </ul>
                <p className="text-muted-foreground">
                  4.4. Doju reserves the right to make a final determination in
                  cases where parties cannot reach an agreement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  5. Limitations
                </h2>
                <p className="text-muted-foreground">
                  5.1. Doju does not assume liability for products sold by
                  third-party sellers.
                </p>
                <p className="text-muted-foreground">
                  5.2. Doju’s role is limited to facilitating communication and
                  ensuring that disputes are resolved in accordance with this
                  Policy and applicable laws.
                </p>
                <p className="text-muted-foreground">
                  5.3. Doju is not responsible for indirect, incidental, or
                  consequential damages resulting from unresolved disputes
                  between buyers and sellers.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  6. Escalation
                </h2>
                <p className="text-muted-foreground">
                  6.1. If a dispute cannot be resolved through Doju’s internal
                  process, parties may escalate the matter to the applicable
                  legal authorities in accordance with the Governing Law clause
                  in our Terms of Service.
                </p>
                <p className="text-muted-foreground">
                  6.2. Parties agree to make reasonable efforts to resolve
                  disputes amicably before seeking legal recourse.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  7. Contact Information
                </h2>
                <p className="text-muted-foreground">
                  For all dispute-related inquiries or submissions, please
                  contact Doju Customer Support: support@dojuhealth.com
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

export default DisputePolicy;
