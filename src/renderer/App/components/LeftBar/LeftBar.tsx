/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React, { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Reorder } from 'framer-motion';

import { useBoard } from 'renderer/App/hooks/useBoard';
import { BrowserProps } from 'renderer/App/components/Browser/Types';
import { useBrowserMethods } from 'renderer/App/hooks/useBrowserMethods';

import icon from './icon.png';

import './style.scss';

export const LeftBar: React.FC = () => {
  const board = useBoard();
  const { focus } = useBrowserMethods();
  const [items, setItems] = useState<BrowserProps[]>(board.browsers);

  useEffect(() => {
    setItems(board.browsers);
  }, [board.browsers]);

  return (
    <div className="LeftBar__browserFavContainer">
      <Reorder.Group values={items} onReorder={setItems}>
        {items.map((b: BrowserProps) => {
          return (
            <Reorder.Item key={b.id} value={b}>
              <Tooltip title={b.title || ''} placement="right" key={b.id}>
                <div
                  className="LeftBar__browserFav"
                  key={b.id}
                  onClick={() => focus(document, b.id)}
                  data-browserid={b.id}
                >
                  <img
                    src={b.favicon || icon}
                    className="LeftBar__browserFavImg"
                  />
                </div>
              </Tooltip>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
};
