import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';

export type TabProps = {
  id: string;
  label: string;
  windowsCount: number;
};

export type TabsState = {
  tabs: TabProps[];
  activeTab: string;
  isRenaming: string | null;
};

type RenameTabType = {
  id: string;
  label: string;
};

type SetWindowsCountType = {
  id: string;
  count: number;
};

const initialState: TabsState = {
  tabs: [],
  activeTab: '',
  isRenaming: null,
};

export const tabsSlice: Slice<TabsState> = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<TabProps>) => {
      state.tabs.push(action.payload);
      state.activeTab = action.payload.id;
    },
    setTabs: (state, action: PayloadAction<TabProps[]>) => {
      state.tabs = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setIsRenaming: (state, action: PayloadAction<string | null>) => {
      state.isRenaming = action.payload;
    },
    renameTab: (state, action: PayloadAction<RenameTabType>) => {
      const tabIndex = state.tabs.findIndex((t) => t.id === action.payload.id);
      state.tabs[tabIndex].label = action.payload.label;
    },
    removeTab: (state, action: PayloadAction<string>) => {
      const tabIndex = state.tabs.findIndex((t) => t.id === action.payload);
      if (tabIndex > -1) state.tabs.splice(tabIndex, 1);
      if (state.activeTab === action.payload && state.tabs.length > 0) {
        state.activeTab = state.tabs[tabIndex]
          ? state.tabs[tabIndex].id
          : state.tabs[tabIndex - 1].id;
      }

      window.titleBar.tabs.purge(action.payload);

      if (state.tabs.length === 0) window.titleBar.app.close();
    },
    setWindowsCount: (state, action: PayloadAction<SetWindowsCountType>) => {
      const tabIndex = state.tabs.findIndex((t) => t.id === action.payload.id);
      if (tabIndex > -1) {
        state.tabs[tabIndex].windowsCount = action.payload.count;
      }
    },
    removeAllTabs: (state) => {
      state.tabs = [];
      state.activeTab = '';
      state.isRenaming = null;
      window.titleBar.app.close();
    },
    removeAllTabsExcept: (state, action: PayloadAction<string>) => {
      const toPurge = state.tabs.filter((t) => t.id !== action.payload);
      state.tabs = state.tabs.filter((t) => t.id === action.payload);
      state.activeTab = action.payload;
      toPurge.forEach((t) => window.titleBar.tabs.purge(t.id));
    },
  },
});

export const {
  addTab,
  setActiveTab,
  setIsRenaming,
  renameTab,
  removeTab,
  setWindowsCount,
  removeAllTabs,
  removeAllTabsExcept,
  setTabs,
} = tabsSlice.actions;

export default tabsSlice.reducer;
