import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — The Real Business",
  description:
    "Privacy Policy for The Real Business. Learn how we collect, use, and protect your personal information.",
};

const lastUpdated = "2025-03-15";

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-charcoal pt-20 pb-24 px-4 sm:px-6 lg:px-16 xl:px-24 overflow-hidden">
        <div className="max-w-[1680px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div>
              <p className="text-white/40 text-xs tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-white/20 inline-block" />
                Legal
              </p>
              <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-[80px] font-bold text-white leading-[0.95] tracking-tight max-w-3xl">
                Privacy
                <br />
                <span className="italic font-light">Policy</span>
              </h1>
            </div>
            <div className="lg:max-w-xs">
              <p className="text-white/50 text-base leading-relaxed">
                We are committed to protecting your privacy. This policy
                describes how we collect, use, and safeguard your personal
                information when you use our website and services.
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
        <div className="max-w-3xl mx-auto prose prose-neutral prose-headings:font-heading prose-headings:text-brand-charcoal prose-p:text-muted-foreground prose-p:text-sm prose-li:text-muted-foreground prose-li:text-sm">
          <h2 id="information-we-collect">1. Information We Collect</h2>
          <p>
            We may collect information you provide directly, such as your name,
            email address, phone number, and message content when you fill out
            our contact form, request a valuation, or express interest in a
            property. We may also collect usage data, such as IP address,
            browser type, and pages visited, to improve our website and
            services.
          </p>

          <h2 id="how-we-use">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to respond to your inquiries,
            provide real estate services, send relevant property updates (with
            your consent), improve our website, and comply with legal
            obligations. We do not sell your personal information to third
            parties.
          </p>

          <h2 id="cookies">3. Cookies and Similar Technologies</h2>
          <p>
            Our website may use cookies and similar technologies to enhance your
            experience, remember your preferences, and analyze traffic. You can
            control cookie settings through your browser. Disabling certain
            cookies may affect the functionality of our website.
          </p>

          <h2 id="data-retention">4. Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to
            fulfill the purposes described in this policy or as required by law.
            When data is no longer needed, we will securely delete or anonymize
            it.
          </p>

          <h2 id="security">5. Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the Internet is completely secure, and we cannot
            guarantee absolute security.
          </p>

          <h2 id="your-rights">6. Your Rights</h2>
          <p>
            Depending on your location, you may have the right to access,
            correct, or delete your personal information, object to or restrict
            processing, and data portability. To exercise these rights or ask
            questions about your data, please contact us using the details
            below.
          </p>

          <h2 id="third-party-links">7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of those sites. We encourage
            you to read their privacy policies before providing any personal
            information.
          </p>

          <h2 id="changes">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post
            the updated policy on this page and update the &quot;Last
            updated&quot; date. We encourage you to review this policy
            periodically.
          </p>

          <h2 id="contact">9. Contact Us</h2>
          <p>
            For questions about this Privacy Policy or your personal data,
            please contact us at{" "}
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
