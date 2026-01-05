// Server-rendered service card shell with client status/actions at the leaf nodes.
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ServiceActions from '@/components/client/service-actions';
import {
  ServiceLatency,
  ServiceStatusBadge,
} from '@/components/client/service-status';
import type { PortalStrings } from '@/lib/i18n';
import { renderServiceIcon } from '@/lib/service-icons';
import type { ServiceDefinition } from '@/lib/services';
import { withDelay } from '@/components/portal/portal-motion';

type ServiceCardProps = Readonly<{
  service: ServiceDefinition;
  strings: PortalStrings;
  isHome: boolean;
  isPublic: boolean;
  delay?: number;
}>;

/**
 * Render a card layout for a single service entry in the portal.
 *
 * @param service - Service metadata and presentation values used to populate the card (name, id, icon, accent, openMode, etc.)
 * @param strings - Localized UI strings used for titles, descriptions, hints, and labels
 * @param isHome - Whether the card is rendered on the home view (affects status/latency components)
 * @param isPublic - Whether the service is exposed publicly (affects available actions)
 * @param delay - Optional entrance animation delay applied to the list item
 * @returns A list item element (<li>) containing the composed service card UI
 */
export default function ServiceCard({
  service,
  strings,
  isHome,
  isPublic,
  delay = 0,
}: ServiceCardProps) {
  return (
    <li className="portal-entrance h-full" style={withDelay(delay)}>
      <article className="portal-card group flex h-full flex-col rounded-(--radius)">
        <div
          className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-35"
          style={{ background: service.accent }}
        />
        <CardHeader className="gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg"
                style={{ background: service.accent }}
              >
                {renderServiceIcon(service.icon, {
                  className: 'h-5 w-5',
                  'aria-hidden': true,
                })}
              </div>
              <div>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>
                  {strings.services.items[service.id]}
                </CardDescription>
              </div>
            </div>
            <ServiceStatusBadge
              serviceId={service.id}
              isHome={isHome}
              strings={strings}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{strings.services.latency}</span>
            <ServiceLatency
              serviceId={service.id}
              isHome={isHome}
              strings={strings}
            />
          </div>
          <Separator />
          <ServiceActions service={service} isPublic={isPublic} strings={strings} />
        </CardContent>
        <CardFooter className="mt-auto text-xs text-muted-foreground">
          {service.openMode === 'overlay'
            ? strings.services.overlayHint
            : strings.services.newTabHint}
        </CardFooter>
      </article>
    </li>
  );
}