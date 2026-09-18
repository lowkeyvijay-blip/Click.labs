import Link from "next/link";
import { ALL_TESTS, TEST_CATEGORIES } from "@/lib/testRegistry";

export default function Home() {
  const categories = Object.keys(TEST_CATEGORIES) as Array<keyof typeof TEST_CATEGORIES>;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-accent">Click</span>Labs
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            Free browser-based gaming tests and device diagnostics.
            Measure your clicking speed, test hardware, and optimize your setup.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/cps-test"
              className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
            >
              Start CPS Test
            </Link>
            <Link
              href="/keyboard-tester"
              className="px-6 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-primary font-medium transition-colors"
            >
              Test Keyboard
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Tests */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-text-primary mb-6">Popular Tests</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ALL_TESTS.filter((t) => t.popular).map((test) => (
            <Link
              key={test.slug}
              href={`/${test.slug}`}
              className="group rounded-xl border border-border bg-surface p-5 hover:bg-surface-hover hover:border-accent/30 transition-colors"
            >
              <div className="text-3xl mb-3">{test.icon}</div>
              <div className="font-semibold text-text-primary group-hover:text-accent transition-colors mb-1">
                {test.shortTitle}
              </div>
              <div className="text-xs text-text-muted line-clamp-2">{test.description}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Tests by Category */}
      {categories.map((key) => {
        const cat = TEST_CATEGORIES[key];
        const tests = ALL_TESTS.filter((t) => t.category === key);
        if (tests.length === 0) return null;
        return (
          <section key={key} id={key} className="max-w-7xl mx-auto px-4 py-10 border-t border-border">
            <h2 className="text-xl font-semibold text-text-primary mb-6">{cat.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tests.map((test) => (
                <Link
                  key={test.slug}
                  href={`/${test.slug}`}
                  className="group flex items-start gap-3 rounded-lg border border-border bg-surface p-4 hover:bg-surface-hover hover:border-accent/30 transition-colors"
                >
                  <div className="text-2xl mt-0.5">{test.icon}</div>
                  <div>
                    <div className="font-medium text-sm text-text-primary group-hover:text-accent transition-colors">
                      {test.shortTitle}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5 line-clamp-2">
                      {test.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-text-primary mb-4">About ClickLabs</h2>
          <div className="prose prose-sm text-text-secondary space-y-3">
            <p>
              ClickLabs is a free, browser-based platform for testing gaming peripherals and device performance.
              All tests run entirely in your browser — no data is sent to any server.
            </p>
            <p>
              Our tests cover mouse performance (CPS, polling rate, latency), keyboard diagnostics,
              display testing (refresh rate, FPS, dead pixels), audio equipment verification,
              and gamepad/controller input testing.
            </p>
            <p>
              All measurements are browser-based estimates. For precise hardware measurements,
              dedicated testing equipment is recommended. ClickLabs provides a quick and convenient
              way to verify basic functionality and performance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
