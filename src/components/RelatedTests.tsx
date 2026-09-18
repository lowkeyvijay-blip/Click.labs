import Link from "next/link";
import { getRelatedTests } from "@/lib/testRegistry";

interface RelatedTestsProps {
  currentSlug: string;
}

export function RelatedTests({ currentSlug }: RelatedTestsProps) {
  const related = getRelatedTests(currentSlug, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Related Tests</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {related.map((test) => (
          <Link
            key={test.slug}
            href={`/${test.slug}`}
            className="group rounded-lg border border-border bg-surface p-4 hover:bg-surface-hover hover:border-accent/30 transition-colors"
          >
            <div className="text-2xl mb-2">{test.icon}</div>
            <div className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
              {test.shortTitle}
            </div>
            <div className="text-xs text-text-muted mt-1 line-clamp-2">
              {test.description}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
