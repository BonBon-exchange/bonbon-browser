/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import { BrowserProps } from 'renderer/App/components/Browser/Types';
import { BoardType } from 'renderer/App/components/Board/Types';
import { WritableDraft } from 'immer/dist/internal';

type UpdateBrowserType = {
  browserId: string;
  params: Partial<BrowserProps>;
};

type UpdateBrowserUrlType = {
  url: string;
  browserId: string;
};

type UpdateBrowserLoadingType = {
  isLoading: boolean;
  browserId: string;
};

type UpdateBrowserTitleType = {
  title: string;
  browserId: string;
};

type UpdateBrowserFavType = {
  favicon: string;
  browserId: string;
};

type UpdateBrowserCertificateFingerprintType = {
  certificateErrorFingerprint: string | null;
  browserId: string;
};

interface BoardState {
  board: BoardType;
}

const browserId = v4();
const newBrowser = {
  id: browserId,
  url: 'https://www.google.com',
  top: 120,
  left: 120,
  height: 800,
  width: 600,
  firstRendering: true,
  favicon: '',
  title: '',
  isLoading: true,
  isMinimized: false,
};

const boardId = v4();
const newBoard = {
  id: boardId,
  label: 'New board',
  browsers: [newBrowser],
  activeBrowser: browserId,
  closedUrls: [],
  isFullSize: false,
};

export const initialState: BoardState = {
  board: newBoard,
};

const addCLosedUrl = (state: WritableDraft<BoardState>, url: string) => {
  if (state.board.closedUrls.length > 20) {
    state.board.closedUrls.splice(0, 1);
  }
  state.board.closedUrls.push(url);
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<BoardType>) => {
      state.board = action.payload;
      const finded = state.board.browsers.find(
        (b) => b.id === state.board.activeBrowser
      );
      if (!state.board.activeBrowser || !finded) {
        if (state.board.browsers.length > 0) {
          state.board.activeBrowser =
            state.board.browsers[state.board.browsers.length - 1].id;
        }
      }
      const wcId = state.board.browsers.find(
        (b) => b.id === state.board.activeBrowser
      )?.webContentsId;
      if (wcId) window.app.browser.select(wcId);
    },
    toggleBoardFullSize: (state) => {
      state.board.isFullSize = !state.board.isFullSize;
      window.app.analytics.event(`toggle_fullsize_${!state.board.isFullSize}`);
    },
    setActiveBrowser: (state, action: PayloadAction<string>) => {
      state.board.activeBrowser = action.payload;

      const wcId = state.board.browsers.find(
        (b) => b.id === action.payload
      )?.webContentsId;
      if (wcId) window.app.browser.select(wcId);
    },
    addBrowser: (state, action: PayloadAction<BrowserProps>) => {
      state.board.browsers.push(action.payload);
      state.board.activeBrowser = action.payload.id;
      window.app.analytics.event('add_browser');
    },
    setBrowsers: (state, action: PayloadAction<BrowserProps[]>) => {
      state.board.browsers = action.payload;
    },
    updateBrowser: (state, action: PayloadAction<UpdateBrowserType>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload.browserId
      );
      if (browserIndex > -1) {
        state.board.browsers[browserIndex] = {
          ...state.board.browsers[browserIndex],
          ...action.payload.params,
        };
      }
    },
    updateBrowserUrl: (state, action: PayloadAction<UpdateBrowserUrlType>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload.browserId
      );
      if (browserIndex > -1) {
        state.board.browsers[browserIndex].url = action.payload.url;
      }
    },
    updateBrowserLoading: (
      state,
      action: PayloadAction<UpdateBrowserLoadingType>
    ) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload.browserId
      );
      if (browserIndex > -1) {
        state.board.browsers[browserIndex].isLoading = action.payload.isLoading;
      }
    },
    updateBrowserTitle: (
      state,
      action: PayloadAction<UpdateBrowserTitleType>
    ) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload.browserId
      );
      if (browserIndex > -1) {
        state.board.browsers[browserIndex].title = action.payload.title;
      }
    },
    updateBrowserFav: (state, action: PayloadAction<UpdateBrowserFavType>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload.browserId
      );
      if (browserIndex > -1) {
        state.board.browsers[browserIndex].favicon = action.payload.favicon;
      }
    },
    renameBoard: (state, action: PayloadAction<string>) => {
      state.board.label = action.payload;
      window.app.analytics.event('rename_board');
    },
    minimizeBrowser: (state, action: PayloadAction<string>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload
      );
      state.board.browsers[browserIndex].isMinimized = true;
    },
    unminimizeBrowser: (state, action: PayloadAction<string>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload
      );
      state.board.browsers[browserIndex].isMinimized = false;
    },
    removeBrowser: (state, action: PayloadAction<string>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload
      );

      // remove browser from state
      if (browserIndex > -1) {
        if (!state.board.closedUrls) state.board.closedUrls = [];
        addCLosedUrl(state, state.board.browsers[browserIndex].url);
        state.board.lastClosedBrowserDimensions = [
          state.board.browsers[browserIndex].width,
          state.board.browsers[browserIndex].height,
        ];
        state.board.browsers.splice(browserIndex, 1);
      }

      // clean activeBrowser
      if (state.board.activeBrowser === action.payload) {
        if (state.board.browsers.length > 0) {
          state.board.browsers[browserIndex]
            ? (state.board.activeBrowser =
                state.board.browsers[browserIndex].id)
            : (state.board.activeBrowser =
                state.board.browsers[browserIndex - 1].id);

          const wcId = state.board.browsers.find(
            (b) => b.id === state.board.activeBrowser
          )?.webContentsId;
          if (wcId) window.app.browser.select(wcId);
        } else {
          state.board.activeBrowser = null;
          window.app.browser.selectBrowserView();
        }
      }

      // send event
      window.app.analytics.event('close_browser');
    },
    removeAllBrowsersExcept: (state, action: PayloadAction<string>) => {
      state.board.browsers = state.board.browsers.filter(
        (b) => b.id === action.payload
      );

      // clean activeBrowser
      state.board.activeBrowser = action.payload;
      const wcId = state.board.browsers.find(
        (b) => b.id === state.board.activeBrowser
      )?.webContentsId;
      if (wcId) window.app.browser.select(wcId);

      // send event
      window.app.analytics.event('close_others_browser');
    },
    updateBrowserCertificateErrorFingerprint: (
      state,
      action: PayloadAction<UpdateBrowserCertificateFingerprintType>
    ) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload.browserId
      );
      if (browserIndex > -1) {
        state.board.browsers[browserIndex].certificateErrorFingerprint =
          action.payload.certificateErrorFingerprint;
      }
    },
    removeAllBrowsers: (state) => {
      if (!state.board.closedUrls) state.board.closedUrls = [];
      state.board.browsers.forEach((b) => addCLosedUrl(state, b.url));
      state.board.browsers = [];
      window.app.analytics.event('close_all_browsers');
    },
    removeLastCloseUrl: (state) => {
      state.board.closedUrls.splice(state.board.closedUrls.length - 1, 1);
    },
    toggleSearch: (state, action: PayloadAction<string>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload
      );
      state.board.browsers[browserIndex].isSearching =
        !state.board.browsers[browserIndex].isSearching;
    },
  },
});

export const {
  setBoard,
  updateBrowserUrl,
  updateBrowserFav,
  renameBoard,
  removeBrowser,
  minimizeBrowser,
  unminimizeBrowser,
  removeAllBrowsers,
  addBrowser,
  setActiveBrowser,
  updateBrowserTitle,
  updateBrowser,
  toggleBoardFullSize,
  removeLastCloseUrl,
  setBrowsers,
  removeAllBrowsersExcept,
  updateBrowserLoading,
  updateBrowserCertificateErrorFingerprint,
  toggleSearch,
} = boardSlice.actions;

export default boardSlice.reducer;
