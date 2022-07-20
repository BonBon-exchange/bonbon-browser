import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DownloadState } from 'renderer/TitleBar/components/TopBar/Types';

export type DownloadItem = {
  savePath: string;
  filename: string;
  progress: number;
  etag: string;
  startTime: number;
  state: DownloadState;
};

export type DownloadsState = {
  items: DownloadItem[];
};

export const initialState: DownloadsState = {
  items: [],
};

export const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    setDownloadItem: (state, action: PayloadAction<DownloadItem>) => {
      const itemIndex = state.items.findIndex(
        (i) =>
          i.savePath === action.payload.savePath &&
          i.startTime === action.payload.startTime
      );
      if (itemIndex === -1) state.items.push(action.payload);
      else state.items[itemIndex] = action.payload;

      if (state.items.length > 10) state.items.splice(0, 1);
    },
    clearDownloads: (state) => {
      state.items = [];
    },
  },
});

export const { setDownloadItem, clearDownloads } = downloadsSlice.actions;

export default downloadsSlice.reducer;
