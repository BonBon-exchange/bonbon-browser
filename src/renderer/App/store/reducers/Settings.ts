import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { flatten } from 'flat';

export type SettingsState = {
  settings: {
    [key: string]: any;
  };
};

export const initialState: SettingsState = {
  settings: {},
};

// The settingsSlice for managing application settings
export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Set a single setting value
    setSetting: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.settings[action.payload.key] = action.payload.value;
      window.app.config.set({
        key: action.payload.key,
        value: action.payload.value,
      });
    },

    // Sync settings by replacing the whole state with new settings
    syncSettings: (state, action: PayloadAction<Record<string, any>>) => {
      state.settings = { ...state.settings, ...flatten(action.payload) }; // Merge new settings with existing state
    },
  },
});

// Exporting the actions
export const { setSetting, syncSettings } = settingsSlice.actions;

// Exporting the reducer
export default settingsSlice.reducer;
