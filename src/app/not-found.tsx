import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">Page Not Found</h1>
      <p className="text-text-secondary mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try one of our testing tools instead.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-medium transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/cps-test"
          className="px-6 py-3 rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-primary font-medium transition-colors"
        >
          Try CPS Test
        </Link>
      </div>
    </div>
  );
}
