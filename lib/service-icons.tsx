import {
  Captions,
  Clapperboard,
  Download,
  Film,
  Radar,
  Tv,
  type LucideIcon,
} from "lucide-react";

type ServiceIconProps = {
  className?: string;
  "aria-hidden"?: boolean;
};

const icons: Record<string, LucideIcon> = {
  tv: Tv,
  clapperboard: Clapperboard,
  film: Film,
  radar: Radar,
  captions: Captions,
  download: Download,
};

export const renderServiceIcon = (name: string, props: ServiceIconProps) => {
  const Icon = icons[name] ?? Tv;
  return <Icon {...props} />;
};
