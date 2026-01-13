// Global search section.
import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';
import GlobalSearchPanel from '@/components/client/global-search-panel';

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
      <div className="mb-4">
        <h2 id="search-title" className="text-xl font-semibold">
          {strings.search.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {strings.search.description}
        </p>
      </div>
      <GlobalSearchPanel strings={strings} />
    </section>
  );
}
