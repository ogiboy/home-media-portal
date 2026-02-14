import { cn } from '@/lib/utils';
import type { PortalStrings } from '@/lib/i18n';
import type { PortalView } from '@/lib/store/slices/portalSlice';

import GamesSection from './games-section';
import SearchSection from './search-section';
import LibrarySection from './library-section';
import ShortcutsSection from './shortcuts-section';
import ServicesSection from './services-section';
import SettingsSection from './settings-section';
import DashboardSections from './dashboard-sections';
import ChatView from './views/chat-view';

type ViewRendererProps = Readonly<{
  view: PortalView;
  strings: PortalStrings;
  isHome: boolean;
  isPublic: boolean;
  lockPortal: boolean;
}>;

export default function ViewRenderer({
  view,
  strings,
  isHome,
  isPublic,
  lockPortal,
}: ViewRendererProps) {
  const commonProps = {
    strings,
    delay: 140,
  };

  return (
    <>
      {view === 'games' && <GamesSection {...commonProps} variant="full" />}

      {view === 'search' && <SearchSection {...commonProps} />}

      {view === 'library' && <LibrarySection {...commonProps} />}

      {view === 'shortcuts' && <ShortcutsSection {...commonProps} />}

      {view === 'services' && (
        <ServicesSection {...commonProps} isHome={isHome} isPublic={isPublic} />
      )}

      {view === 'settings' && <SettingsSection {...commonProps} isHome={isHome} />}

      {view === 'dashboard' && (
        <div
          className={cn(
            'flex flex-col gap-10',
            lockPortal && 'pointer-events-none opacity-60'
          )}
        >
          <DashboardSections strings={strings} isHome={isHome} isPublic={isPublic} />
        </div>
      )}

      {view === 'chat' && <ChatView strings={strings} />}
    </>
  );
}
