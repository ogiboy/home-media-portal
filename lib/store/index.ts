import { configureStore } from '@reduxjs/toolkit';

import chatReducer from './slices/chatSlice';
import portalReducer from './slices/portalSlice';
import toastReducer from './slices/toastSlice';
import focusReducer from './slices/focusSlice';
import systemReducer from './slices/systemSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    portal: portalReducer,
    toast: toastReducer,
    focus: focusReducer,
    system: systemReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['chat/addMessage', 'chat/updateMessage'],
        ignoredPaths: ['chat.messages.timestamp'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
