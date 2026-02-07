// System status section for the portal dashboard.
import SystemPanel from '@/components/client/system-panel';
import SystemUpdatedBadge from '@/components/client/system-updated-badge';
import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';
import { cn } from '@/lib/utils';

type SystemSectionProps = Readonly<{
  strings: PortalStrings;
  isHome: boolean;
  delay?: number;
  variant?: 'full' | 'compact';
}>;

/**
 * Renders the "System" section of the portal, including title, description, update badge, and system widgets.
 *
 * @param strings - Localized strings for the section content
 * @param isHome - Whether the portal is rendering in the "home" context (affects badge and panel behavior)
 * @param delay - Optional delay applied to the entrance animation
 * @returns The section element containing the system header, update badge, and system panel
 */
export default function SystemSection({
  strings,
  isHome,
  delay = 0,
  variant = 'full',
}: SystemSectionProps) {
  const isCompact = variant === 'compact';

  return (
    <section
      id="system"
      aria-labelledby="system-title"
      className={cn(
        'portal-entrance scroll-mt-32',
        isCompact && 'portal-surface rounded-(--radius) p-5'
      )}
      style={withDelay(delay)}
    >
      <div
        className={cn(
          'flex items-center justify-between',
          isCompact && 'gap-2'
        )}
      >
        <div>
          <h2
            id="system-title"
            className={cn('text-xl font-semibold', isCompact && 'text-lg')}
          >
            {strings.system.title}
          </h2>
          <p
            className={cn(
              'text-sm text-muted-foreground',
              isCompact && 'text-xs'
            )}
          >
            {strings.system.description}
          </p>
        </div>
        <SystemUpdatedBadge isHome={isHome} strings={strings} />
      </div>
      <SystemPanel isHome={isHome} strings={strings} variant={variant} />
    </section>
  );
}
