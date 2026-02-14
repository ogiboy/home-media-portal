import type { PortalView } from '@/lib/store/slices/portalSlice';

export interface NavLinks {
  dashboard: string;
  search: string;
  library: string;
  games: string;
  shortcuts: string;
  services: string;
  system: string;
  board: string;
  chat: string;
  settings: string;
}

export const createNavLinks = (isDashboardView: boolean): NavLinks => ({
  dashboard: isDashboardView ? '#search' : '/',
  search: isDashboardView ? '#search' : '/search',
  library: isDashboardView ? '#library' : '/library',
  games: '/games',
  shortcuts: isDashboardView ? '#shortcuts' : '/shortcuts',
  services: isDashboardView ? '#services' : '/services',
  system: '/system',
  board: isDashboardView ? '#board' : '/#board',
  chat: '/chat',
  settings: '/settings',
});

export const getActiveNav = (
  view: PortalView,
  isDashboardView: boolean
): PortalView => (isDashboardView ? 'dashboard' : view);

export const getMobileActive = (activeNav: PortalView): PortalView => {
  if (activeNav === 'services' || activeNav === 'board') {
    return 'dashboard';
  }
  return activeNav;
};
