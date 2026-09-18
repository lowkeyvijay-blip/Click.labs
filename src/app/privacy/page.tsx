import type { Metadata } from "next";
import Link from "next/link";
import { TestContainer } from "@/components/TestContainer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ClickLabs privacy policy. Learn how we handle your data and protect your privacy.",
};

export default function PrivacyPage() {
  return (
    <TestContainer
      title="Privacy Policy"
      description="Your privacy is important to us."
      slug="privacy"
    >
      <div className="prose prose-sm text-text-secondary space-y-6 max-w-none">
        <p className="text-xs text-text-muted">Last updated: September 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Introduction</h2>
          <p>
            ClickLabs (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the click-labs.vercel.app website.
            This Privacy Policy explains how we collect, use, and protect information when you use our
            browser-based gaming tests and device diagnostics platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Information We Collect</h2>
          <p>
            <strong>Local-only processing:</strong> All tests on ClickLabs run entirely in your browser.
            Click data, timing measurements, keyboard inputs, audio recordings, and device information
            are processed locally and are <strong>never sent to our servers</strong>.
          </p>
          <p>
            <strong>Automatic data:</strong> Like most websites, we may automatically collect standard
            web server logs (IP address, browser type, pages visited) for operational purposes.
          </p>
          <p>
            <strong>Advertising:</strong> If广告 is displayed on ClickLabs, our advertising partners may
            use cookies and similar technologies to serve ads and measure their effectiveness.
            See the &quot;Third-Party Services&quot; section below.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">How We Use Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Operate and maintain the ClickLabs platform</li>
            <li>Monitor and analyze usage to improve our services</li>
            <li>Serve relevant advertisements (when applicable)</li>
            <li>Respond to user inquiries and support requests</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Cookies and Tracking</h2>
          <p>
            ClickLabs itself does not use cookies for its core functionality. All test data stays in your
            browser&apos;s memory and is not persisted unless your browser is configured to do so.
          </p>
          <p>
            Third-party advertising services may set cookies when ads are displayed. You can manage
            cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Third-Party Services</h2>
          <p>We may use third-party services including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Advertising networks:</strong> To display ads and generate revenue</li>
            <li><strong>Analytics providers:</strong> To understand how our site is used</li>
            <li><strong>Vercel:</strong> Our hosting provider, which may collect standard server logs</li>
          </ul>
          <p>
            Each third-party service has its own privacy policy governing how they handle data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Data Security</h2>
          <p>
            We implement appropriate security measures to protect the limited data we collect.
            Since most test processing happens locally in your browser, the risk of data exposure
            is significantly reduced.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Children&apos;s Privacy</h2>
          <p>
            ClickLabs does not knowingly collect personal information from children under 13.
            Our tests are general-purpose tools suitable for users of all ages.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us through our website.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-border">
          <Link href="/" className="text-accent hover:text-accent-hover text-sm transition-colors">
            ← Back to ClickLabs
          </Link>
        </div>
      </div>
    </TestContainer>
  );
}
