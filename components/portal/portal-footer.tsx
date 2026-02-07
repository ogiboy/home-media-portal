// Portal footer with presence stats.
import PresenceFooter from '@/components/client/presence-footer';
import type { PortalStrings } from '@/lib/i18n';

export type PortalFooterProps = Readonly<{
  strings: PortalStrings;
  isHome: boolean;
}>;

/**
 * Render the footer area including presence stats.
 */
export default function PortalFooter({ strings, isHome }: PortalFooterProps) {
  return (
    <footer className="relative w-full pb-24 md:pb-14 lg:pb-12">
      <div className="portal-frame">
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <div className="hidden lg:block" aria-hidden="true" />
          <div>
            <PresenceFooter strings={strings} isHome={isHome} />
          </div>
        </div>
      </div>
    </footer>
  );
}
