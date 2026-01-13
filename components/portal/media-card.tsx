// Media card for library rows.
import { Play, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { LibraryItem } from '@/lib/library';

export type MediaCardProps = Readonly<{
  item: LibraryItem;
}>;

/**
 * Render a media card with cover art and hover actions.
 */
export default function MediaCard({ item }: MediaCardProps) {
  return (
    <article className="group relative min-w-40 overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: item.coverImage }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/30 to-background/90" />
      <div className="relative z-10 flex h-48 flex-col justify-end gap-2 p-3">
        <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
        {item.subtitle && (
          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
        )}
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button size="icon" variant="secondary" className="h-9 w-9">
          <Play className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className="h-9 w-9">
          <Star className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
