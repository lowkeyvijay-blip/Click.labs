"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ALL_TESTS, TEST_CATEGORIES } from "@/lib/testRegistry";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const categories = Object.keys(TEST_CATEGORIES) as Array<keyof typeof TEST_CATEGORIES>;

  const filteredTests = searchQuery
    ? ALL_TESTS.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="text-accent">Click</span>
          <span>Labs</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <div ref={searchRef} className="relative mr-2">
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 h-8 px-3 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
            {filteredTests.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                {filteredTests.map((test) => (
                  <Link
                    key={test.slug}
                    href={`/${test.slug}`}
                    onClick={() => setSearchQuery("")}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-surface-hover text-sm transition-colors"
                  >
                    <span>{test.icon}</span>
                    <span className="text-text-primary">{test.shortTitle}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {categories.map((key) => (
            <Link
              key={key}
              href={`/#${key}`}
              className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface transition-colors"
            >
              {TEST_CATEGORIES[key].label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2.5 min-h-[44px] min-w-[44px] rounded-lg hover:bg-surface transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface/95 backdrop-blur-xl">
          <div className="px-4 py-3">
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 px-3 rounded-lg bg-background border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
            />
          </div>
          {categories.map((key) => {
            const tests = ALL_TESTS.filter((t) => t.category === key);
            return (
              <div key={key} className="px-4 pb-3">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">{TEST_CATEGORIES[key].label}</div>
                {tests.map((test) => (
                  <Link
                    key={test.slug}
                    href={`/${test.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 py-3 text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <span>{test.icon}</span>
                    <span>{test.shortTitle}</span>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </nav>
  );
}
