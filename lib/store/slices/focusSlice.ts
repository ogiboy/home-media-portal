import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FocusState {
  isOpen: boolean;
  serviceId: string | null;
  serviceUrl: string | null;
  serviceTitle: string | null;
  isGame: boolean;
}

const initialState: FocusState = {
  isOpen: false,
  serviceId: null,
  serviceUrl: null,
  serviceTitle: null,
  isGame: false,
};

const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    openFocus: (
      state,
      action: PayloadAction<{
        serviceId: string;
        serviceUrl: string;
        serviceTitle: string;
        isGame?: boolean;
      }>
    ) => {
      state.isOpen = true;
      state.serviceId = action.payload.serviceId;
      state.serviceUrl = action.payload.serviceUrl;
      state.serviceTitle = action.payload.serviceTitle;
      state.isGame = action.payload.isGame || false;
      if (globalThis.window !== undefined) {
        globalThis.document.documentElement.dataset.focus = 'true';
      }
    },
    closeFocus: (state) => {
      state.isOpen = false;
      state.serviceId = null;
      state.serviceUrl = null;
      state.serviceTitle = null;
      state.isGame = false;
      if (globalThis.window !== undefined) {
        delete globalThis.document.documentElement.dataset.focus;
      }
    },
  },
});

export const { openFocus, closeFocus } = focusSlice.actions;
export default focusSlice.reducer;
