"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { AdSlot } from "./AdSlot";
import { RelatedTests } from "./RelatedTests";

interface TestContainerProps {
  title: string;
  description: string;
  slug: string;
  children: ReactNode;
  instructions?: ReactNode;
  faq?: ReactNode;
}

export function TestContainer({
  title,
  description,
  slug,
  children,
  instructions,
  faq,
}: TestContainerProps) {
  return (
    <div className="min-h-screen">
      <AdSlot position="top" className="max-w-7xl mx-auto mt-4 px-4" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-2">
          <Link href="/" className="text-xs text-text-muted hover:text-accent transition-colors py-2 px-1 inline-block">
            ← Back to all tests
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{title}</h1>
        <p className="text-text-secondary text-sm md:text-base mb-8">{description}</p>

        {instructions && (
          <div className="mb-6 rounded-xl border border-border bg-surface p-4 md:p-6">
            <h2 className="text-sm font-semibold text-text-primary mb-2">How to use</h2>
            <div className="text-sm text-text-secondary leading-relaxed">{instructions}</div>
          </div>
        )}

        {children}

        {faq && (
          <div className="mt-10 border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4">FAQ</h2>
            <div className="space-y-4">{faq}</div>
          </div>
        )}

        <RelatedTests currentSlug={slug} />

        <AdSlot position="bottom" className="mt-10" />
      </div>
    </div>
  );
}

export function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-lg border border-border bg-surface overflow-hidden">
      <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-text-primary hover:bg-surface-hover transition-colors list-none flex items-center justify-between">
        {question}
        <span className="text-text-muted group-open:rotate-180 transition-transform">▾</span>
      </summary>
      <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed">
        {answer}
      </div>
    </details>
  );
}
