import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AlertButtonConfig = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
};

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButtonConfig[];
}

const initialState: AlertState = {
  visible: false,
  title: '',
  message: '',
  buttons: [],
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlertConfig: (
      state,
      action: PayloadAction<{ title: string; message: string; buttons: AlertButtonConfig[] }>
    ) => {
      state.visible = true;
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.buttons = action.payload.buttons;
    },
    hideAlert: (state) => {
      state.visible = false;
    },
  },
});

export const { setAlertConfig, hideAlert } = alertSlice.actions;

export default alertSlice.reducer;
