// Global search section.
import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';
import GlobalSearchPanel from '@/components/client/global-search-panel';
import { cn } from '@/lib/utils';

type SearchSectionProps = Readonly<{
  strings: PortalStrings;
  delay?: number;
}>;

/**
 * Render the global search section with title/description and results panel.
 */
export default function SearchSection({
  strings,
  delay = 0,
}: SearchSectionProps) {
  return (
    <section
      id="search"
      aria-labelledby="search-title"
      className="portal-entrance scroll-mt-32"
      style={withDelay(delay)}
    >
      <div className="portal-surface rounded-(--radius) p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className={cn('min-w-0')}>
            <h2 id="search-title" className="text-xl font-semibold">
              {strings.search.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {strings.search.description}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <GlobalSearchPanel strings={strings} />
        </div>
      </div>
    </section>
  );
}
