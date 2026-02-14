import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';
export type Language = 'tr' | 'en' | 'it';
export type PortalView =
  | 'dashboard'
  | 'games'
  | 'search'
  | 'library'
  | 'shortcuts'
  | 'services'
  | 'board'
  | 'chat'
  | 'settings';

interface PortalState {
  theme: Theme;
  language: Language;
  currentView: PortalView;
  isHomeDeployment: boolean;
}

const isBrowser = () => globalThis.window !== undefined;

const getInitialTheme = (): Theme => {
  if (!isBrowser()) {
    return 'light';
  }

  const saved = globalThis.window.localStorage.getItem('portal_theme');
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const getInitialLanguage = (): Language => {
  if (!isBrowser()) {
    return 'tr';
  }

  const saved = globalThis.window.localStorage.getItem('portal_locale');
  if (saved === 'tr' || saved === 'en' || saved === 'it') {
    return saved;
  }

  return 'tr';
};

const initialState: PortalState = {
  theme: 'light',
  language: 'tr',
  currentView: 'dashboard',
  isHomeDeployment: false,
};

const portalSlice = createSlice({
  name: 'portal',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      if (isBrowser()) {
        globalThis.window.localStorage.setItem('portal_theme', action.payload);
        globalThis.document.documentElement.dataset.theme = action.payload;
      }
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      if (isBrowser()) {
        globalThis.window.localStorage.setItem('portal_theme', newTheme);
        globalThis.document.documentElement.dataset.theme = newTheme;
      }
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      if (isBrowser()) {
        globalThis.window.localStorage.setItem('portal_locale', action.payload);
      }
    },
    setCurrentView: (state, action: PayloadAction<PortalView>) => {
      state.currentView = action.payload;
    },
    setIsHomeDeployment: (state, action: PayloadAction<boolean>) => {
      state.isHomeDeployment = action.payload;
    },
    initializePortal: (state) => {
      state.theme = getInitialTheme();
      state.language = getInitialLanguage();
      if (isBrowser()) {
        globalThis.document.documentElement.dataset.theme = state.theme;
      }
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setLanguage,
  setCurrentView,
  setIsHomeDeployment,
  initializePortal,
} = portalSlice.actions;

export default portalSlice.reducer;
