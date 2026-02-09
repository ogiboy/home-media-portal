// Dashboard sections stack for the main portal view.
import type { PortalStrings } from '@/lib/i18n';
import SearchSection from '@/components/portal/search-section';
import LibrarySection from '@/components/portal/library-section';
import GamesSection from '@/components/portal/games-section';
import ShortcutsSection from '@/components/portal/shortcuts-section';
import ServicesSection from '@/components/portal/services-section';
import BoardSection from '@/components/portal/board-section';

export type DashboardSectionsProps = Readonly<{
  strings: PortalStrings;
  isHome: boolean;
  isPublic: boolean;
}>;

/**
 * Render the ordered dashboard sections: search, library, games, shortcuts, services, board.
 */
export default function DashboardSections({
  strings,
  isHome,
  isPublic,
}: DashboardSectionsProps) {
  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 flex flex-col gap-10">
        <SearchSection strings={strings} delay={80} />
        <LibrarySection strings={strings} delay={140} />
        <GamesSection strings={strings} variant="preview" delay={200} />
        <ShortcutsSection strings={strings} delay={260} />
        <ServicesSection
          strings={strings}
          isHome={isHome}
          isPublic={isPublic}
          delay={320}
        />
      </div>
      <aside className="min-w-0 flex flex-col gap-6">
        <BoardSection
          strings={strings}
          isHome={isHome}
          delay={380}
          variant="compact"
        />
      </aside>
    </div>
  );
}
