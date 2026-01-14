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

  const skeletonRows = Array.from({ length: 3 }, (_, index) => index);
  const skeletonCards = Array.from({ length: 5 }, (_, index) => index);
  const hasData = libraryRows.length > 0;
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
        {hasData ? (
          libraryRows.map((row) => <ContentRowCarousel key={row.id} row={row} />)
        ) : (
          <div className="space-y-6">
            {skeletonRows.map((rowIndex) => (
              <div key={`library-skeleton-${rowIndex}`} className="space-y-3">
                <div className="portal-skeleton h-4 w-40 rounded-full" />
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {skeletonCards.map((cardIndex) => (
                    <div
                      key={`library-skeleton-card-${rowIndex}-${cardIndex}`}
                      className="portal-skeleton h-48 min-w-40 rounded-2xl"
                    />
                  ))}
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              {strings.library.loading}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
