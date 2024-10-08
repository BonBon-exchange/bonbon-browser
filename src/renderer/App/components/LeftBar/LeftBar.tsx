import { ReactEventHandler, useCallback, useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import clsx from 'clsx';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { useBoard } from 'renderer/App/hooks/useBoard';
import { BrowserProps } from 'renderer/App/components/Browser/Types';
import { useBrowserMethods } from 'renderer/App/hooks/useBrowserMethods';
import { useAppDispatch } from 'renderer/App/store/hooks';
import {
  setBrowsers,
  toggleMagicChat,
} from 'renderer/App/store/reducers/Board';
import { ButtonAddBrowser } from 'renderer/App/components/ButtonAddBrowser';
import ErrorFallback from 'renderer/App/components/ErrorFallback';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { useAnalytics } from 'renderer/App/hooks/useAnalytics';

import loadingImg from 'renderer/App/svg/loading.svg';
import icon from './icon.png';

import './style.scss';

export const LeftBar = () => {
  const dispatch = useAppDispatch();
  const boardState = useBoard();
  const { focus } = useBrowserMethods();
  const [items, setItems] = useState<BrowserProps[]>(boardState.browsers);
  const { browser, board } = useStoreHelpers();
  const { anal } = useAnalytics();

  const handleReorder = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);

    setItems(newItems);
    dispatch(setBrowsers(newItems));
    board.distributeWindowsByOrder(newItems);
  };

  const handleImageError: ReactEventHandler<HTMLImageElement> = useCallback(
    (e) => {
      const target = e.target as HTMLImageElement;
      target.src = icon;
    },
    []
  );

  const handleClickFavicon = useCallback(
    (browserId: string) => {
      browser.show(browserId);
      anal.logEvent('leftbar_browser-favicon_click');
      setTimeout(() => {
        focus(browserId);
      }, 0);
    },
    [anal, browser, focus]
  );

  const makeItem = useCallback(
    (b: BrowserProps, index: number) => {
      return (
        <Draggable key={b.id} draggableId={b.id} index={index}>
          {(provided: any) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Tooltip title={b.title || ''} placement="right">
                <div className="LeftBar__browserContainer">
                  <div
                    className={
                      !b.isMinimized
                        ? 'LeftBar__closeBrowser'
                        : 'LeftBar__maximizeBrowser'
                    }
                    onClick={() => {
                      if (!b.isMinimized) {
                        browser.close(b.id);
                        anal.logEvent('leftbar_browser-close-icon_click');
                      }
                    }}
                  >
                    {!b.isMinimized ? <CloseIcon /> : <OpenInFullIcon />}
                  </div>
                  <div
                    className={clsx({
                      selected: b.id === boardState.activeBrowser,
                      LeftBar__browserFav: true,
                    })}
                    onClick={() => handleClickFavicon(b.id)}
                    data-browserid={b.id}
                  >
                    <img
                      src={b.isLoading ? loadingImg : b.favicon || icon}
                      className="LeftBar__browserFavImg"
                      onError={handleImageError}
                      alt={b.title}
                    />
                  </div>
                </div>
              </Tooltip>
            </div>
          )}
        </Draggable>
      );
    },
    [
      anal,
      boardState.activeBrowser,
      browser,
      handleClickFavicon,
      handleImageError,
    ]
  );

  const makeFavicons = useCallback(() => {
    return items.map((b: BrowserProps, index: number) => makeItem(b, index));
  }, [items, makeItem]);

  const magicChatOnClick = () => {
    dispatch(toggleMagicChat());
    anal.logEvent('leftbar_magic-chat-icon_click');
  };

  const buttonAddBrowserClick = () => {
    browser.add({});
    anal.logEvent('leftbar_add-browser-icon_click');
  };

  useEffect(() => {
    if (boardState.isFullSize) {
      setItems(boardState.browsers);
    }
  }, [boardState.isFullSize, boardState.browsers]);

  useEffect(() => {
    if (!boardState.isFullSize) {
      setItems(board.getSortedBrowsers);
    }
  }, [board.getSortedBrowsers, boardState.isFullSize]);

  return (
    <ErrorFallback>
      <div id="LeftBar__browserFavContainer">
        <DragDropContext onDragEnd={handleReorder}>
          <Droppable droppableId="browsers">
            {(provided) => (
              <div
                id="LeftBar__browserFavContainerItems"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {makeFavicons()}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <ButtonAddBrowser onClick={buttonAddBrowserClick} />
        </DragDropContext>
        <div id="LeftBar__magic-chat-icon" onClick={magicChatOnClick}>
          @
        </div>
      </div>
    </ErrorFallback>
  );
};
