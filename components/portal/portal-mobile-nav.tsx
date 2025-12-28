// Mobile bottom navigation for quick section jumps.
import { Gauge, LayoutGrid, MessageSquare } from 'lucide-react';

import type { PortalStrings } from '@/lib/i18n';

type PortalMobileNavProps = {
  strings: PortalStrings;
};

// Bottom navigation for mobile layouts.
export default function PortalMobileNav({ strings }: PortalMobileNavProps) {
  return (
    <nav
      className="portal-surface portal-mobile-nav fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-full px-4 py-3 md:hidden"
      aria-label={strings.accessibility.mobileNav}
    >
      <a href="#services" className="flex items-center gap-2 text-xs font-semibold">
        <LayoutGrid className="h-4 w-4" />
        {strings.nav.dashboard}
      </a>
      <a href="#system" className="flex items-center gap-2 text-xs font-semibold">
        <Gauge className="h-4 w-4" />
        {strings.nav.system}
      </a>
      <a href="#board" className="flex items-center gap-2 text-xs font-semibold">
        <MessageSquare className="h-4 w-4" />
        {strings.nav.board}
      </a>
    </nav>
  );
}
