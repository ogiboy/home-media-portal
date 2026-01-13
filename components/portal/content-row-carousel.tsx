// Horizontal carousel row for library content.
import MediaCard from '@/components/portal/media-card';
import type { LibraryRow } from '@/lib/library';

export type ContentRowCarouselProps = Readonly<{
  row: LibraryRow;
}>;

/**
 * Render a horizontally scrollable library row.
 */
export default function ContentRowCarousel({ row }: ContentRowCarouselProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{row.title}</h3>
        <span className="text-xs text-muted-foreground">{row.items.length}</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {row.items.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
