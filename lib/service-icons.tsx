import {
  Captions,
  Clapperboard,
  Download,
  Film,
  Radar,
  Tv,
  type LucideIcon,
} from "lucide-react";

// Props passed to lucide service icons.
type ServiceIconProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

// Map of service icon keys to lucide components.
const icons: Record<string, LucideIcon> = {
  tv: Tv,
  clapperboard: Clapperboard,
  film: Film,
  radar: Radar,
  captions: Captions,
  download: Download,
};

// Render a service icon by name with a safe fallback.
export const renderServiceIcon = (name: string, props: ServiceIconProps) => {
  const Icon = icons[name] ?? Tv;
  return <Icon {...props} />;
};
