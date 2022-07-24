/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable import/prefer-default-export */
import { ReactEventHandler, useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useBoard } from 'renderer/App/hooks/useBoard';
import icon from 'renderer/App/components/LeftBar/icon.png';
import loadingImg from 'renderer/App/svg/loading.svg';

import { MiniWindow, MiniView } from './Types';

import './style.scss';

export const Minimap: React.FC = () => {
  const board = useBoard();
  const [windows, setWindows] = useState<MiniWindow[]>([]);
  const [view, setView] = useState<MiniView>({
    top: 0,
    height: 100,
  });
  const [showView, setShowView] = useState<boolean>(false);

  const minimapContainer = document.querySelector('#Minimap__container');
  const boardContainer = document.querySelector('#Board__container');

  const handleImageError: ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.target as HTMLImageElement;
    target.src = icon;
  };

  const makeMiniWindows = useCallback((sorted: MiniWindow[]) => {
    return sorted.map((w) => {
      return (
        <motion.div
          className="Minimap__window"
          style={{
            height: `${w.height}px`,
            width: `${w.width}px`,
            top: `${w.top}px`,
            left: `${w.left}px`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={`miniwindow_${w.id}`}
        >
          <img
            src={w.isLoading ? loadingImg : w.favicon || icon}
            className="Minimap__browserFavImg"
            onError={handleImageError}
            width={w.height / 2}
          />
        </motion.div>
      );
    });
  }, []);

  const mouseMoveHandler = useCallback(
    (e: any) => {
      if (minimapContainer && boardContainer) {
        const ratioY =
          minimapContainer.clientHeight / boardContainer.clientHeight;

        const top = Math.max(e.y - view.height / 2, 0);

        setView({ top, height: view.height });
        window.scrollTo(0, top / ratioY);
      }
    },
    [boardContainer, minimapContainer, view.height]
  );

  const mouseEnterHandler = useCallback(
    (_e: any) => {
      const top = window.scrollY;
      if (minimapContainer && boardContainer) {
        const ratioY =
          minimapContainer.clientHeight / boardContainer.clientHeight;

        const height = minimapContainer.clientHeight * ratioY;
        setView({ top: top * ratioY, height });
        setShowView(true);
      }
    },
    [boardContainer, minimapContainer]
  );

  const mouseLeaveHandler = useCallback(() => {
    setShowView(false);
  }, []);

  const mouseUpHandler = useCallback(
    (_e: any) => {
      document
        .querySelector('#Minimap__container')
        ?.removeEventListener('mousemove', mouseMoveHandler);
    },
    [mouseMoveHandler]
  );

  const clickHandler = useCallback(
    (e: any) => {
      if (minimapContainer && boardContainer) {
        const ratioY =
          minimapContainer.clientHeight / boardContainer.clientHeight;

        const top = Math.max(e.y - view.height / 2, 0);
        const height = minimapContainer.clientHeight * ratioY;

        setView({ top, height });
        window.scrollTo(0, top / ratioY);

        document
          .querySelector('#Minimap__container')
          ?.addEventListener('mousemove', mouseMoveHandler);
      }
    },
    [view.height, minimapContainer, boardContainer, mouseMoveHandler]
  );

  useEffect(() => {
    if (minimapContainer && boardContainer) {
      const ratioX = minimapContainer.clientWidth / boardContainer.clientWidth;
      const ratioY =
        minimapContainer.clientHeight / boardContainer.clientHeight;
      const tmpWindows = board.browsers.map((b) => {
        return {
          id: b.id,
          height: b.height * ratioY,
          width: b.width * ratioX,
          top: b.top * ratioY,
          left: b.left * ratioX,
          favicon: b.favicon,
          isLoading: b.isLoading,
        };
      });
      const toSort = [...tmpWindows];
      const sorted = toSort.sort((a, b) => {
        return a.id > b.id ? 1 : -1;
      });
      setWindows(sorted);
    } else {
      setWindows([]);
    }
  }, [board.browsers, boardContainer, minimapContainer]);

  useEffect(() => {
    if (minimapContainer && boardContainer) {
      const ratioY =
        minimapContainer.clientHeight / boardContainer.clientHeight;
      const height = minimapContainer.clientHeight * ratioY;
      setView({ top: 0, height });
    }
  }, [boardContainer, minimapContainer]);

  useEffect(() => {
    document
      .querySelector('#Minimap__container')
      ?.addEventListener('mousedown', clickHandler);
    return () =>
      document
        .querySelector('#Minimap__container')
        ?.removeEventListener('mousedown', clickHandler);
  }, [clickHandler]);

  useEffect(() => {
    document
      .querySelector('#Minimap__container')
      ?.addEventListener('mouseenter', mouseEnterHandler);
    return () =>
      document
        .querySelector('#Minimap__container')
        ?.removeEventListener('mouseenter', mouseEnterHandler);
  }, [mouseEnterHandler]);

  useEffect(() => {
    document
      .querySelector('#Minimap__container')
      ?.addEventListener('mouseleave', mouseLeaveHandler);
    return () =>
      document
        .querySelector('#Minimap__container')
        ?.removeEventListener('mouseleave', mouseLeaveHandler);
  }, [mouseLeaveHandler]);

  useEffect(() => {
    document
      .querySelector('#Minimap__container')
      ?.addEventListener('mouseup', mouseUpHandler);
    return () =>
      document
        .querySelector('#Minimap__container')
        ?.removeEventListener('mouseup', mouseUpHandler);
  }, [mouseUpHandler]);

  return (
    <div id="Minimap__container">
      {showView && (
        <div
          id="Minimap__view"
          style={{ top: view.top, height: view.height }}
        />
      )}
      <AnimatePresence>{makeMiniWindows(windows)}</AnimatePresence>
    </div>
  );
};
