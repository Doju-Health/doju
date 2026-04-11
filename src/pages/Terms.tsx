import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <SEO title="Terms & Conditions" canonical="/terms" noIndex={false} />
      <Header />

      <main className="flex-1 py-16">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-8">
              TERMS OF SERVICE
            </h1>
            <p className="text-muted-foreground mb-8">
              Welcome to Doju Health Limited (“Doju”, “we”, “our”, or “us”). By
              accessing or using our Platform, you agree to comply with and be
              bound by these Terms of Service (“Terms”). If you do not agree to
              these Terms, please do not use our Platform.
            </p>

            <div className="prose prose-neutral max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  1. Introduction
                </h2>
                <p className="text-muted-foreground">
                  1.1. “Doju” refers to Doju Health Limited and any affiliated
                  entities operating the Platform. Each Doju entity provides an
                  e-commerce marketplace consisting of a website and mobile
                  application, supported by IT, logistics, and payment
                  infrastructure for the sale and purchase of health and
                  wellness products in its territory.
                </p>
                <p className="text-muted-foreground">
                  1.2. These Terms apply to all users of the Platform, including
                  buyers and sellers, and govern your use of the marketplace and
                  related services.
                </p>
                <p className="text-muted-foreground">
                  1.3. By using our Platform, you accept these Terms in full. If
                  you disagree with any part of these Terms, you must not use
                  the Platform.
                </p>
                <p className="text-muted-foreground">
                  1.4. If you use the Platform for a business or organizational
                  purpose, you confirm authority to agree to these Terms, bind
                  yourself and your organization, and accept that references
                  include both you and your organization unless context requires
                  otherwise.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  2. Doju’s Role as a Marketplace
                </h2>
                <p className="text-muted-foreground">
                  2.1. Marketplace Facilitation
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    2.1.1. Doju provides a platform connecting buyers with
                    verified sellers of health and wellness products. Doju may
                    also act as a seller for certain products.
                  </li>
                  <li>
                    2.1.2. The relevant seller whether Doju or a third-party
                    remains exclusively responsible for the products they sell.
                  </li>
                  <li>
                    2.1.3. If an issue arises from a purchase, buyers should
                    contact the seller through Doju’s Dispute Resolution Policy.
                    Doju may assist with communication but is not liable for
                    third-party products.
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  2.2. Product Information Accuracy
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    2.2.1. Sellers warrant that the product information they
                    provide is complete, accurate, and up to date.
                  </li>
                  <li>
                    2.2.2. Doju commits to assisting buyers in resolving
                    concerns regarding product information.
                  </li>
                  <li>
                    2.2.3. Buyers can report inaccuracies through the Dispute
                    Resolution Policy, and Doju will ensure sellers respond
                    appropriately.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  3. Account Registration and Security
                </h2>
                <p className="text-muted-foreground">
                  3.1. Some features of our Platform require an account. You
                  agree to provide accurate, complete, and current information.
                </p>
                <p className="text-muted-foreground">
                  3.2. You are responsible for maintaining the confidentiality
                  of your account and password and for all activities under your
                  account.
                </p>
                <p className="text-muted-foreground">
                  3.3. You must notify Doju immediately of any unauthorized use
                  of your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  4. Orders and Payments
                </h2>
                <p className="text-muted-foreground">4.1. Placing Orders</p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>Orders are confirmed when accepted by the seller.</li>
                  <li>
                    Prices, availability, and product details may change; Doju
                    will notify you of significant updates.
                  </li>
                </ul>
                <p className="text-muted-foreground">4.2. Payment Methods</p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    Payments must be made through authorized payment channels on
                    the Platform.
                  </li>
                  <li>
                    You are responsible for all applicable fees and taxes.
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  4.3. Refunds and Cancellations
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    Refunds and cancellations are governed by Doju’s Refund
                    Policy.
                  </li>
                  <li>
                    Doju reserves the right to cancel or modify orders in cases
                    of error, fraud, or other operational reasons.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  5. User Responsibilities
                </h2>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    Use the Platform in accordance with all applicable laws.
                  </li>
                  <li>
                    Only post content you have the right to share. Doju may
                    remove content that violates these Terms.
                  </li>
                  <li>
                    Do not misuse the Platform, interfere with its
                    functionality, or attempt unauthorized access.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  6. Intellectual Property
                </h2>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    All content on the Platform, including text, images, logos,
                    and software, is owned by Doju or our licensors.
                  </li>
                  <li>
                    You are granted a limited, non-exclusive license to access
                    and use the Platform for personal or business purposes.
                  </li>
                  <li>
                    You may not copy, reproduce, distribute, or create
                    derivative works from any content without Doju’s prior
                    written consent.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  7. Privacy
                </h2>
                <p className="text-muted-foreground">
                  Your use of our Platform is governed by our Privacy Policy. By
                  using the Platform, you consent to the collection, use, and
                  sharing of your information as described in our Privacy
                  Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  8. Disclaimers and Limitation of Liability
                </h2>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    The Platform and all products are provided “as is” and “as
                    available.”
                  </li>
                  <li>
                    Doju is not responsible for indirect, incidental, or
                    consequential damages arising from your use of the Platform.
                  </li>
                  <li>
                    While Doju strives to ensure the safety, quality, and
                    reliability of products, we do not guarantee specific
                    outcomes.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  9. Termination
                </h2>
                <p className="text-muted-foreground">
                  We may suspend or terminate your access to the Platform at any
                  time for violations of these Terms or for conduct deemed
                  harmful to Doju, our community, or other users.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  10. Governing Law
                </h2>
                <p className="text-muted-foreground">
                  These Terms are governed by the laws of the Federal Republic
                  of Nigeria. Any disputes arising from these Terms shall be
                  submitted to and resolved exclusively in the courts of
                  competent jurisdiction in Nigeria.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  11. Changes to Terms
                </h2>
                <p className="text-muted-foreground">
                  Doju may update these Terms from time to time. Updated Terms
                  will be posted on the Platform with the effective date. Your
                  continued use of the Platform constitutes acceptance of the
                  updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  12. Contact Us
                </h2>
                <p className="text-muted-foreground">
                  For questions regarding these Terms, contact us at
                  support@dojuhealth.com
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

export default Terms;
