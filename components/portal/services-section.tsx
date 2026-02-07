// Service list section for the portal dashboard.
import { MonitorPlay } from 'lucide-react';

import type { PortalStrings } from '@/lib/i18n';
import { services } from '@/lib/services';
import { withDelay } from '@/components/portal/portal-motion';
import ServiceCard from '@/components/portal/service-card';

const CARD_BASE_DELAY = 180;
const CARD_STAGGER = 70;

type ServicesSectionProps = Readonly<{
  strings: PortalStrings;
  isHome: boolean;
  isPublic: boolean;
  delay?: number;
}>;

/**
 * Render the Services section with a header and a responsive grid of service cards.
 *
 * @param strings - Localized text used for the section title, description, and hint
 * @param isHome - Whether the section is rendered on the home page (affects card rendering)
 * @param isPublic - Whether the section is rendered in a public context (affects card rendering)
 * @param delay - Initial entrance animation delay in milliseconds applied to the section
 * @returns The section element containing the services header and a grid of ServiceCard components
 */
export default function ServicesSection({
  strings,
  isHome,
  isPublic,
  delay = 0,
}: ServicesSectionProps) {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="portal-entrance scroll-mt-32"
      style={withDelay(delay)}
    >
      <div className="portal-surface rounded-(--radius) p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="services-title" className="text-xl font-semibold">
              {strings.services.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {strings.services.description}
            </p>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <MonitorPlay className="h-4 w-4" />
            <span>{strings.services.focusHint}</span>
          </div>
        </div>

        <ul className="mt-6 grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              strings={strings}
              isHome={isHome}
              isPublic={isPublic}
              delay={CARD_BASE_DELAY + index * CARD_STAGGER}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
