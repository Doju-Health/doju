import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
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
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: January 2026
            </p>

            <div className="prose prose-neutral max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  1. Introduction
                </h2>
                <p className="text-muted-foreground">
                  At DOJU Health Limited ("DOJU", "we", "us", or "our"), we are
                  committed to protecting the privacy and personal data of all
                  users of our platform. This Privacy Policy explains how we
                  collect, use, store, share, and protect your personal
                  information when you access or use our services.
                </p>
                <p className="text-muted-foreground">
                  DOJU operates a centralized digital health and wellness
                  e-commerce marketplace that connects buyers with trusted
                  sellers of health products, wellness items, gym equipment,
                  medical apparel, medical books, and related goods. DOJU does
                  not provide medical advice, clinical services, diagnoses,
                  prescriptions, or healthcare treatment of any kind. We are a
                  product marketplace only.
                </p>
                <p className="text-muted-foreground">
                  This Policy is issued in compliance with the Nigeria Data
                  Protection Act 2023 (NDPA) and any subsidiary legislation made
                  thereunder. By using our platform, you acknowledge that you
                  have read and understood this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  2. Who We Are
                </h2>
                <p className="text-muted-foreground">
                  DOJU Health Limited is a data controller registered and
                  operating in Nigeria. We run a digital health and wellness
                  marketplace that simplifies how individuals obtain trusted
                  health and wellness products through a reliable, convenient,
                  and transparent online platform.
                </p>
                <p className="text-muted-foreground">
                  <strong>Company Name:</strong> DOJU HEALTH LIMITED
                </p>
                <p className="text-muted-foreground">
                  <strong>Privacy Contact Email:</strong>{" "}
                  dojuhealthltd@gmail.com
                </p>
                <p className="text-muted-foreground">
                  <strong>Phone:</strong> 08139273018
                </p>
                <p className="text-muted-foreground">
                  For all data privacy enquiries, requests, or complaints,
                  please contact our Privacy Contact using the details above.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  3. Personal Data We Collect
                </h2>
                <p className="text-muted-foreground">
                  We collect the following categories of personal data in
                  connection with the operation of our marketplace:
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    <strong>Personal Information</strong>: Full name, Email
                    address, Phone number, Residential or delivery address
                  </li>
                  <li>
                    <strong>Payment Information</strong>: Debit/credit card
                    details (processed securely via third-party payment
                    processors), Bank account details for transactions where
                    applicable
                  </li>
                  <li>
                    <strong>Business Information (Sellers)</strong>: Business
                    name, Business registration number and relevant regulatory
                    details, Business address and contact information
                  </li>
                  <li>
                    <strong>Usage Data</strong>: Pages visited and features used
                    on our platform, Device type, browser type, and IP address,
                    Time and date of access, clickstream data, Transaction
                    history and order details
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  DOJU does not collect, process, or store medical records,
                  clinical diagnoses, prescriptions, health insurance data, or
                  any other special category health data. Our platform
                  facilitates the purchase of health and wellness products only.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  4. Legal Basis for Processing
                </h2>
                <p className="text-muted-foreground">
                  Under the NDPA, we process your personal data on the following
                  lawful bases:
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    Contractual necessity; to provide and fulfil our marketplace
                    services to you, including processing orders, facilitating
                    payments, and coordinating delivery
                  </li>
                  <li>
                    Legal obligation; to comply with applicable Nigerian laws
                    and regulations, including tax, financial reporting, and
                    consumer protection obligations
                  </li>
                  <li>
                    Legitimate interests; to improve our platform, prevent
                    fraud, ensure platform security, and maintain the integrity
                    of our seller and buyer community, where such interests are
                    not overridden by your rights
                  </li>
                  <li>
                    Consent; where you have given us explicit permission to
                    process your data for a specific purpose, such as receiving
                    marketing communications
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  Where we rely on consent, you have the right to withdraw it at
                  any time without affecting the lawfulness of prior processing.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  5. How We Use Your Personal Data
                </h2>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    To create and manage your buyer or seller account on our
                    platform
                  </li>
                  <li>
                    To process payments, fulfil orders, and coordinate product
                    delivery
                  </li>
                  <li>
                    To communicate with you regarding your account, orders,
                    updates, or support requests
                  </li>
                  <li>
                    To verify seller identity and business legitimacy before
                    onboarding
                  </li>
                  <li>
                    To detect, prevent, and investigate fraud or unauthorised
                    activity on our platform
                  </li>
                  <li>
                    To analyse usage patterns and improve the performance and
                    features of our platform
                  </li>
                  <li>
                    To comply with our legal and regulatory obligations under
                    Nigerian law
                  </li>
                  <li>
                    To send transactional or service-related notifications
                  </li>
                  <li>
                    To send promotional updates and marketing communications,
                    only where you have given explicit consent
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  6. How We Share Your Personal Data
                </h2>
                <p className="text-muted-foreground">
                  We do not sell, rent, or trade your personal data. We may
                  share your data only in the following limited circumstances:
                </p>
                <p className="text-muted-foreground">
                  <strong>a) Payment Processors and Logistics Partners</strong>{" "}
                  - To facilitate transactions and product delivery, we share
                  relevant personal data with trusted third-party payment
                  processors and logistics providers. These parties are
                  contractually bound to handle your data securely and only for
                  specified purposes.
                </p>
                <p className="text-muted-foreground">
                  <strong>b) Sellers on Our Platform</strong> - Where necessary
                  to fulfil your order, we share relevant delivery and contact
                  information with the seller from whom you have purchased a
                  product. Sellers are permitted to use this information solely
                  to process and fulfil your order and may not use it for any
                  other purpose.
                </p>
                <p className="text-muted-foreground">
                  <strong>c) Legal and Regulatory Authorities</strong> - We may
                  disclose your personal data to regulatory bodies, law
                  enforcement, or government authorities where required to do so
                  by law, court order, or in response to a lawful request.
                </p>
                <p className="text-muted-foreground">
                  <strong>d) Internal Team</strong> - Access to your personal
                  data within our organisation is strictly limited to team
                  members who require it to perform their duties. All staff are
                  bound by confidentiality obligations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  7. Data Retention
                </h2>
                <p className="text-muted-foreground">
                  We retain your personal data only for as long as is necessary
                  to fulfil the purposes outlined in this Policy, or as required
                  by law:
                </p>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    Personal and business data: retained for the duration of
                    your active account, plus 5 years after account closure for
                    legal, financial, and regulatory compliance purposes
                  </li>
                  <li>
                    Transaction and usage data: retained for 5 years for
                    auditing, compliance, and business analytics purposes
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  After the applicable retention period, your data will be
                  securely deleted or anonymised.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  8. Your Rights as a Data Subject
                </h2>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  <li>
                    Right to Access; you may request a copy of the personal data
                    we hold about you
                  </li>
                  <li>
                    Right to Rectification; you may request correction of
                    inaccurate or incomplete data
                  </li>
                  <li>
                    Right to Erasure; you may request deletion of your data
                    where there is no lawful basis for continued processing
                  </li>
                  <li>
                    Right to Restriction; you may request that we limit how we
                    process your data in certain circumstances
                  </li>
                  <li>
                    Right to Data Portability; you may request your data in a
                    structured, commonly used, and machine-readable format
                  </li>
                  <li>
                    Right to Object; you may object to processing carried out on
                    the basis of legitimate interests or for direct marketing
                  </li>
                  <li>
                    Right to Withdraw Consent; where processing is based on
                    consent, you may withdraw it at any time without affecting
                    prior lawful processing
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  To exercise any of these rights, please contact us at
                  dojuhealthltd@gmail.com. We will respond to your request
                  within 30 days in accordance with the NDPA.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  9. Data Security
                </h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organisational security
                  measures to protect your personal data against unauthorized
                  access, alteration, disclosure, or destruction. These measures
                  include encryption of data in transit and at rest, access
                  controls, and regular security reviews.
                </p>
                <p className="text-muted-foreground">
                  In the event of a personal data breach that is likely to
                  result in a risk to your rights and freedoms, we will notify
                  the Nigeria Data Protection Commission (NDPC) within 72 hours
                  and inform affected individuals without undue delay, in
                  accordance with the NDPA.
                </p>
                <p className="text-muted-foreground">
                  No method of transmission over the internet or electronic
                  storage is completely secure. We encourage you to take
                  reasonable precautions to protect your account credentials.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  10. Cross-Border Data Transfers
                </h2>
                <p className="text-muted-foreground">
                  Where it is necessary to transfer your personal data outside
                  Nigeria, we will only do so where adequate safeguards are in
                  place as required under the NDPA, including standard
                  contractual clauses or where the receiving country is deemed
                  to have adequate data protection standards. We will notify you
                  of any such transfers where required.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  11. Third-Party Links and Services
                </h2>
                <p className="text-muted-foreground">
                  Our platform may contain links to third-party websites or
                  integrate with third-party services such as payment gateways
                  and logistics providers. We are not responsible for the
                  privacy practices of such third parties and recommend that you
                  read their privacy policies independently.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  12. Children's Privacy
                </h2>
                <p className="text-muted-foreground">
                  Our services are not directed at or intended for individuals
                  under the age of 18. We do not knowingly collect personal data
                  from minors. If you believe a minor has provided us with their
                  personal data, please contact us immediately and we will take
                  steps to delete such information promptly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  13. Changes to This Privacy Policy
                </h2>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time to reflect
                  changes in our operations, legal obligations, or regulatory
                  requirements. Where material changes are made, we will notify
                  you via email or a prominent notice on our platform at least
                  14 days before the changes take effect. We encourage you to
                  review this Policy periodically to stay informed about how we
                  protect your data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  14. Contact Us
                </h2>
                <p className="text-muted-foreground">
                  If you have any questions, concerns, or complaints regarding
                  this Privacy Policy or how we handle your personal data,
                  please contact us:
                </p>
                <p className="text-muted-foreground">
                  <strong>DOJU HEALTH LIMITED</strong>
                </p>
                <p className="text-muted-foreground">
                  <strong>Attention:</strong> Privacy Contact
                </p>
                <p className="text-muted-foreground">
                  <strong>Email:</strong> dojuhealthltd@gmail.com
                </p>
                <p className="text-muted-foreground">
                  You also have the right to lodge a complaint with the Nigeria
                  Data Protection Commission (NDPC) at www.ndpc.gov.ng if you
                  believe your data protection rights have been violated.
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

export default Privacy;
