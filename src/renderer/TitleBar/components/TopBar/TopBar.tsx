/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useCallback } from 'react';
import { v4 } from 'uuid';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import clsx from 'clsx';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CloseIcon from '@mui/icons-material/Close';

import { useAppDispatch, useAppSelector } from 'renderer/TitleBar/store/hooks';
import {
  addTab,
  setActiveTab,
  setIsRenaming,
  renameTab,
  removeTab,
  setWindowsCount,
  TabsState,
} from 'renderer/TitleBar/store/reducers/Tabs';

import './style.scss';

export const TopBar: React.FC = () => {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkMode, setIsDarkMode] = useState<boolean>(dark);
  const { tabs, activeTab, isRenaming } = useAppSelector(
    (state) => state.tabs as TabsState
  );

  const dispatch = useAppDispatch();

  const pushTab = useCallback(
    (params: { id?: string; label?: string }) => {
      const id = params.id || v4();
      const newTab = {
        id,
        label: params.label || `New board`,
      };

      dispatch(addTab(newTab));
      window.titleBar.tabs.select(id);
      window.titleBar.analytics.event('add_board');
    },
    [dispatch]
  );

  const tabOnKeyPress = (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string
  ) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      const target = e.target as HTMLInputElement;
      dispatch(setIsRenaming(null));
      dispatch(renameTab({ id, label: target?.value }));
      window.titleBar.tabs.rename({ tabId: id, label: target?.value });
    }
  };

  const switchBoard = useCallback(
    (tabId: string) => {
      if (!isRenaming) {
        window.titleBar.tabs.select(tabId);
        window.titleBar.analytics.event('switch_board');
      }
    },
    [isRenaming]
  );

  const dblclickEventListener = useCallback(
    (tab: Element) => dispatch(setIsRenaming(tab.getAttribute('data-tabid'))),
    [dispatch]
  );

  const openTabListener = useCallback(
    (_e: unknown, args: { id?: string; label?: string }) => {
      if (tabs?.find((t) => t.id === args?.id)) {
        if (args.id) switchBoard(args.id);
      } else {
        pushTab(args);
      }
    },
    [pushTab, switchBoard, tabs]
  );

  const closeTabListener = useCallback(
    (_e: unknown, args: { x: number; y: number }) => {
      const el = document.elementFromPoint(args.x, args.y);
      const tabId = el?.getAttribute('data-tabid');
      if (tabId) {
        dispatch(removeTab(tabId));
        window.titleBar.tabs.purge(tabId);
      }
    },
    [dispatch]
  );

  const closeActiveTabListener = useCallback(() => {
    const tabId = activeTab;
    if (tabId) {
      dispatch(removeTab(tabId));
      window.titleBar.tabs.purge(tabId);
    }
  }, [dispatch, activeTab]);

  const renameTabListener = useCallback(
    (_e: unknown, args: { x: number; y: number }) => {
      const el = document.elementFromPoint(args.x, args.y);
      const tabId = el?.getAttribute('data-tabid');
      if (tabId) {
        dispatch(setIsRenaming(tabId));
      }
    },
    [dispatch]
  );

  const saveBoardListener = useCallback(
    (_e: unknown, args: { x: number; y: number }) => {
      const el = document.elementFromPoint(args.x, args.y);
      const tabId = el?.getAttribute('data-tabid');
      if (tabId) {
        window.titleBar.tabs.save(tabId);
      }
    },
    []
  );

  const setWindowsCountListener = useCallback(
    (_e: unknown, args: { boardId: string; count: number }) => {
      dispatch(setWindowsCount({ id: args.boardId, count: args.count }));
    },
    [dispatch]
  );

  const selectNextBoardListener = useCallback(() => {
    const activeTabIndex = tabs.findIndex((t) => t.id === activeTab);
    const nextTabIndex =
      activeTabIndex === tabs.length - 1 ? 0 : activeTabIndex + 1;
    const nextTabId = tabs[nextTabIndex].id;
    dispatch(setActiveTab(nextTabId));
  }, [activeTab, dispatch, tabs]);

  const colorSchemeChangeListener = (e: MediaQueryListEvent) => {
    const colorScheme = e.matches ? 'dark-theme' : 'light-theme';
    setIsDarkMode(e.matches);
    // @ts-ignore
    window.document.querySelector('body').className = colorScheme;
  };

  const handleCloseTab = (tabId: string) => {
    dispatch(removeTab(tabId));
  };

  useEffect(() => {
    // @ts-ignore
    window.document.querySelector('body').className = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
      ? 'dark-theme'
      : 'light-theme';

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', colorSchemeChangeListener);

    return () =>
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', colorSchemeChangeListener);
  }, []);

  useEffect(() => {
    document.querySelectorAll('.TopBar__tab').forEach((tab) => {
      tab.addEventListener('dblclick', () => dblclickEventListener(tab));
    });
    return () =>
      document.querySelectorAll('.TopBar__tab').forEach((tab) => {
        tab.removeEventListener('dblclick', () => dblclickEventListener(tab));
      });
  }, [dblclickEventListener, tabs]);

  useEffect(() => {
    switchBoard(activeTab);
  }, [switchBoard, activeTab]);

  useEffect(() => {
    window.titleBar.listener.openTab(openTabListener);
    return () => window.titleBar.off.openTab();
  }, [openTabListener]);

  useEffect(() => {
    window.titleBar.listener.closeTab(closeTabListener);
    return () => window.titleBar.off.closeTab();
  }, [closeTabListener]);

  useEffect(() => {
    window.titleBar.listener.renameTab(renameTabListener);
    return () => window.titleBar.off.renameTab();
  }, [renameTabListener]);

  useEffect(() => {
    window.titleBar.listener.saveBoard(saveBoardListener);
    return () => window.titleBar.off.saveBoard();
  }, [saveBoardListener]);

  useEffect(() => {
    window.titleBar.listener.closeActiveTab(closeActiveTabListener);
    return () => window.titleBar.off.closeActiveTab();
  }, [closeActiveTabListener]);

  useEffect(() => {
    window.titleBar.listener.selectNextBoard(selectNextBoardListener);
    return () => window.titleBar.off.selectNextBoard();
  }, [selectNextBoardListener]);

  useEffect(() => {
    window.titleBar.listener.setWindowsCount(setWindowsCountListener);
    return () => window.titleBar.off.setWindowsCount();
  }, [setWindowsCountListener]);

  useEffect(() => {
    if (tabs.length === 0) pushTab({});
  }, [tabs, pushTab]);

  useEffect(() => {
    if (isRenaming) {
      const target = document.getElementById(
        'TopBar__tab-renaming'
      ) as HTMLInputElement;
      target?.select();
    }
  }, [isRenaming]);

  return (
    <div
      id="TopBar__container"
      className={clsx({
        macTitleBar: window.titleBar.os.getPlatform() === 'darwin',
      })}
    >
      <div id="TopBar__tabs-container">
        {tabs.map((t) => {
          return (
            <div className="TopBar__tab-container">
              <div
                className={clsx({
                  TopBar__tab: true,
                  selected: activeTab === t.id,
                })}
                key={t.id}
                onClick={() => dispatch(setActiveTab(t.id))}
                data-tabid={t.id}
              >
                {isRenaming === t.id ? (
                  <TextField
                    label="Board name"
                    defaultValue={t.label}
                    variant="standard"
                    onKeyPress={(e) => tabOnKeyPress(e, t.id)}
                    id="TopBar__tab-renaming"
                  />
                ) : (
                  `${t.label} (${t.windowsCount || '?'})`
                )}
              </div>

              <div className="TopBar__closeTab">
                <CloseIcon onClick={() => handleCloseTab(t.id)} />
              </div>
            </div>
          );
        })}
        <div id="TopBar__addBoard" onClick={() => pushTab({})}>
          <AddIcon />
        </div>
      </div>
      {/* @ts-ignore */}
      <browser-action-list />
      <div id="TopBar__menu-container">
        <div className="TopBar__menu-item">
          {isDarkMode ? (
            <Brightness7Icon onClick={() => window.darkMode.toggle()} />
          ) : (
            <Brightness4Icon onClick={() => window.darkMode.toggle()} />
          )}
        </div>
      </div>
    </div>
  );
};
