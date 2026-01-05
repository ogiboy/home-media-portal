import PortalApp from '@/components/portal-app';

/**
 * Render the public games route inside the portal shell.
 *
 * @returns A React element that renders the portal application configured for the "games" view.
 */
export default function GamesPage() {
  return <PortalApp view="games" />;
}