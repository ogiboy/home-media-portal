// Library preview section with content rows.
import type { PortalStrings } from '@/lib/i18n';
import { libraryRows } from '@/lib/library';
import { withDelay } from '@/components/portal/portal-motion';
import ContentRowCarousel from '@/components/portal/content-row-carousel';

export type LibrarySectionProps = Readonly<{
  strings: PortalStrings;
  delay?: number;
}>;

/**
 * Render the library rows section.
 */
export default function LibrarySection({
  strings,
  delay = 0,
}: LibrarySectionProps) {
  return (
    <section
      id="library"
      aria-labelledby="library-title"
      className="portal-entrance scroll-mt-32"
      style={withDelay(delay)}
    >
      <div className="mb-4">
        <h2 id="library-title" className="text-xl font-semibold">
          {strings.library.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {strings.library.description}
        </p>
      </div>
      <div className="space-y-6">
        {libraryRows.map((row) => (
          <ContentRowCarousel key={row.id} row={row} />
        ))}
      </div>
    </section>
  );
}
