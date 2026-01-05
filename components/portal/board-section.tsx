// Message board section for family notes.
import MessageBoardPanel from '@/components/client/message-board-panel';
import { Badge } from '@/components/ui/badge';
import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';
import { cn } from '@/lib/utils';

type BoardSectionProps = Readonly<{
  strings: PortalStrings;
  isHome: boolean;
  delay?: number;
  variant?: 'full' | 'compact';
}>;

/**
 * Render the portal's message board section.
 *
 * @param strings - Localized strings for the board title, description, and badge text
 * @param isHome - Whether the current page is the home view; passed to the MessageBoardPanel
 * @param delay - Milliseconds to offset the entrance animation for the section
 * @param variant - Layout variant: `'compact'` applies condensed styling and uses the stacked panel layout; `'full'` uses the regular layout
 * @returns The section element containing the board header, tailnet badge, and MessageBoardPanel
 */
export default function BoardSection({
  strings,
  isHome,
  delay = 0,
  variant = 'full',
}: BoardSectionProps) {
  const isCompact = variant === 'compact';

  return (
    <section
      id="board"
      aria-labelledby="board-title"
      className={cn(
        'portal-entrance scroll-mt-32',
        isCompact && 'portal-surface rounded-(--radius) p-5'
      )}
      style={withDelay(delay)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            id="board-title"
            className={cn('text-xl font-semibold', isCompact && 'text-lg')}
          >
            {strings.board.title}
          </h2>
          <p className={cn('text-sm text-muted-foreground', isCompact && 'text-xs')}>
            {strings.board.description}
          </p>
        </div>
        <Badge variant="outline" className="portal-chip px-3 py-1 text-xs">
          {strings.board.tailnetOnly}
        </Badge>
      </div>
      <MessageBoardPanel
        isHome={isHome}
        strings={strings}
        variant={isCompact ? 'stacked' : 'split'}
      />
    </section>
  );
}