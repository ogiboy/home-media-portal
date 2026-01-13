// Settings placeholder section.
import type { PortalStrings } from '@/lib/i18n';
import { withDelay } from '@/components/portal/portal-motion';

export type SettingsSectionProps = Readonly<{
  strings: PortalStrings;
  delay?: number;
}>;

/**
 * Render a settings placeholder section.
 */
export default function SettingsSection({
  strings,
  delay = 0,
}: SettingsSectionProps) {
  return (
    <section
      id="settings"
      aria-labelledby="settings-title"
      className="portal-entrance scroll-mt-32"
      style={withDelay(delay)}
    >
      <div className="portal-surface rounded-(--radius) p-6">
        <h2 id="settings-title" className="text-xl font-semibold">
          {strings.settings.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {strings.settings.description}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          {strings.settings.comingSoon}
        </p>
      </div>
    </section>
  );
}
