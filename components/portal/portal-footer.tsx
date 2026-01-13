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
    <footer className="relative mx-auto w-full max-w-6xl px-4 pb-10 lg:pl-[280px]">
      <PresenceFooter strings={strings} isHome={isHome} />
    </footer>
  );
}
