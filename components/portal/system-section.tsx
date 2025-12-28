// System status section for the portal dashboard.
import SystemPanel from '@/components/client/system-panel';
import SystemUpdatedBadge from '@/components/client/system-updated-badge';
import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';

type SystemSectionProps = {
  strings: PortalStrings;
  isHome: boolean;
  delay?: number;
};

// Section that wraps system stats widgets.
export default function SystemSection({
  strings,
  isHome,
  delay = 0,
}: SystemSectionProps) {
  return (
    <section
      id="system"
      aria-labelledby="system-title"
      className="portal-entrance scroll-mt-32"
      style={withDelay(delay)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 id="system-title" className="text-xl font-semibold">
            {strings.system.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {strings.system.description}
          </p>
        </div>
        <SystemUpdatedBadge isHome={isHome} strings={strings} />
      </div>
      <SystemPanel isHome={isHome} strings={strings} />
    </section>
  );
}
