import type { Metadata } from "next";
import Link from "next/link";
import { TestContainer } from "@/components/TestContainer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ClickLabs terms of service. Read the rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <TestContainer
      title="Terms of Service"
      description="Please read these terms carefully before using ClickLabs."
      slug="terms"
    >
      <div className="prose prose-sm text-text-secondary space-y-6 max-w-none">
        <p className="text-xs text-text-muted">Last updated: September 2026</p>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Acceptance of Terms</h2>
          <p>
            By accessing and using ClickLabs, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Description of Service</h2>
          <p>
            ClickLabs is a free, browser-based platform providing gaming tests and device diagnostics.
            Our tools include click speed tests, keyboard testing, mouse polling rate measurement,
            reaction time testing, FPS measurement, audio device testing, and gamepad/controller testing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Limitations</h2>
          <p>
            All measurements and results provided by ClickLabs are <strong>browser-based estimates</strong>.
            They are not laboratory-grade measurements and should not be treated as such.
            For precise hardware measurements, dedicated testing equipment is recommended.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">User Responsibilities</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use ClickLabs only for its intended purpose</li>
            <li>Not attempt to exploit or abuse the platform</li>
            <li>Not use automated tools to interact with the service</li>
            <li>Not interfere with the proper functioning of the platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Intellectual Property</h2>
          <p>
            The ClickLabs platform, including its design, code, and content, is protected by
            applicable intellectual property laws. You may not reproduce, distribute, or create
            derivative works without our written permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Disclaimer of Warranties</h2>
          <p>
            ClickLabs is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
            that the service will be uninterrupted, error-free, or that measurement results will
            be accurate to any specific degree.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, ClickLabs shall not be liable for any indirect,
            incidental, special, or consequential damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective
            immediately upon posting. Continued use of the platform after changes constitutes
            acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Contact</h2>
          <p>
            For questions about these Terms of Service, please contact us through our website.
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
