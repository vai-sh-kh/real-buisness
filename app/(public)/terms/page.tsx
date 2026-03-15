import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — The Real Business",
  description:
    "Terms of Service for The Real Business. Read our terms governing the use of our website and real estate services.",
};

const lastUpdated = "2025-03-15";

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-black pt-20 pb-24 px-4 sm:px-6 lg:px-16 xl:px-24 overflow-hidden">
        <div className="max-w-[1680px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-white/20 inline-block" />
                Legal
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold text-white leading-[0.95] tracking-tight max-w-3xl">
                Terms of
                <br />
                <span className="italic font-light">Service</span>
              </h1>
            </div>
            <div className="lg:max-w-xs">
              <p className="text-white/50 text-base leading-relaxed">
                Please read these terms carefully before using our website or
                services. By accessing The Real Business, you agree to be bound
                by these terms.
              </p>
              <p className="text-white/40 text-xs mt-4">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="max-w-3xl mx-auto prose prose-neutral prose-headings:font-heading prose-headings:text-brand-charcoal prose-p:text-muted-foreground prose-p:text-base prose-li:text-muted-foreground prose-li:text-base">
          <h2 id="acceptance">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the website and services of The Real Business
            (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to
            comply with and be bound by these Terms of Service. If you do not
            agree to these terms, please do not use our website or services.
          </p>

          <h2 id="use-of-service">2. Use of Service</h2>
          <p>
            Our website and services are provided for lawful purposes related to
            real estate search, inquiry, and engagement. You agree not to use
            our services to violate any applicable laws, infringe on the rights
            of others, or transmit harmful or offensive content. We reserve the
            right to suspend or terminate access at our discretion.
          </p>

          <h2 id="intellectual-property">3. Intellectual Property</h2>
          <p>
            All content on this website, including but not limited to text,
            images, logos, and design, is the property of The Real Business or
            its licensors and is protected by copyright and other intellectual
            property laws. You may not reproduce, distribute, or create
            derivative works without our prior written consent.
          </p>

          <h2 id="disclaimer">4. Disclaimer</h2>
          <p>
            Property listings and information on our website are provided for
            general informational purposes. We do not guarantee the accuracy,
            completeness, or availability of any listing. All real estate
            transactions are subject to separate agreements and due diligence.
            We recommend that you verify all details and seek independent legal
            or financial advice as needed.
          </p>

          <h2 id="limitation-of-liability">5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, The Real Business shall not
            be liable for any indirect, incidental, special, or consequential
            damages arising from your use of our website or services. Our total
            liability shall not exceed the amount you paid to us, if any, in the
            twelve months preceding the claim.
          </p>

          <h2 id="governing-law">6. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in
            accordance with the laws of India. Any disputes arising from these
            terms or your use of our services shall be subject to the exclusive
            jurisdiction of the courts in India.
          </p>

          <h2 id="changes">7. Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. We will post
            the updated terms on this page and update the &quot;Last
            updated&quot; date. Your continued use of our website after changes
            constitutes acceptance of the revised terms.
          </p>

          <h2 id="contact">8. Contact</h2>
          <p>
            For questions about these Terms of Service, please contact us at{" "}
            <a
              href="mailto:contact@therealbusiness.com"
              className="text-brand-gold hover:underline"
            >
              contact@therealbusiness.com
            </a>{" "}
            or through our{" "}
            <a href="/contact" className="text-brand-gold hover:underline">
              Contact page
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
