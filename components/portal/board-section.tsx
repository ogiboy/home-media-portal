// Message board section for family notes.
import MessageBoardPanel from '@/components/client/message-board-panel';
import { Badge } from '@/components/ui/badge';
import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';

type BoardSectionProps = {
  strings: PortalStrings;
  isHome: boolean;
  delay?: number;
};

// Section that wraps the family message board.
export default function BoardSection({
  strings,
  isHome,
  delay = 0,
}: BoardSectionProps) {
  return (
    <section
      id="board"
      aria-labelledby="board-title"
      className="portal-entrance scroll-mt-32"
      style={withDelay(delay)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 id="board-title" className="text-xl font-semibold">
            {strings.board.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {strings.board.description}
          </p>
        </div>
        <Badge variant="outline" className="portal-chip px-3 py-1 text-xs">
          {strings.board.tailnetOnly}
        </Badge>
      </div>
      <MessageBoardPanel isHome={isHome} strings={strings} />
    </section>
  );
}
