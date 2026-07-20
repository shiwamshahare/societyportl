import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import visitorReducer from './slices/visitorSlice';
import alertReducer from './slices/alertSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    visitor: visitorReducer,
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
