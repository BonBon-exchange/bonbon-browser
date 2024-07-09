/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect, Dispatch, ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import AutoSize from 'react-virtualized-auto-sizer';

import { CloseButton } from 'renderer/App/components/CloseButton';
import { Loader } from 'renderer/App/components/Loader';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';

import { History as HistoryType } from 'types/history';

import { HistoryProps } from './Types';

import './style.scss';

const handleHistoryClick = (
  url: string,
  browser: any,
  handleClose: () => void
) => {
  browser.add({ url });
  handleClose();
};

const handleDeleteHistory = (
  id: number,
  items: HistoryType[],
  setItems: Dispatch<React.SetStateAction<HistoryType[]>>
) => {
  window.app.history
    .removeHistory(id)
    .then(() => {
      const newItems = [...items];
      const index = newItems.findIndex((i) => i.id === id);
      if (index > -1) newItems.splice(index, 1);
      setItems(newItems);
    })
    .catch(console.log);
};

const Item = ({
  data,
  index,
  style,
  items,
  setItems,
  browser,
  handleClose,
}: {
  data: HistoryType[];
  index: number;
  style: any;
  items: HistoryType[];
  setItems: Dispatch<React.SetStateAction<HistoryType[]>>;
  browser: any;
  handleClose: () => void;
}) => {
  return (
    <div style={style}>
      <div className="History__item" key={data[index].id}>
        <div
          className="History__item-text"
          onClick={() =>
            handleHistoryClick(data[index].url, browser, handleClose)
          }
        >
          <div className="History__item-title">{data[index].title}</div>
          <div className="History__item-date">{data[index].date}</div>
          <div className="History__item-url">{data[index].url}</div>
        </div>
        <div className="History__item-controls">
          <div
            className="History__item-control"
            onClick={() => handleDeleteHistory(data[index].id, items, setItems)}
          >
            <DeleteForeverIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

/* eslint-disable react/prop-types */
export const History = ({ handleClose }: HistoryProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<HistoryType[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryType[]>([]);
  const { browser } = useStoreHelpers();

  const handleClearHistory = () => {
    window.app.history
      .clearHistory()
      .then(() => {
        setItems([]);
      })
      .catch(console.log);
  };

  useEffect(() => {
    const filtered = items.filter(
      (i) =>
        (i.url && i.url.includes(search)) ||
        (i.title && i.title.includes(search))
    );
    setFilteredItems(filtered);
  }, [search, items]);

  useEffect(() => {
    window.app.history
      .getAllHistory()
      .then((val) => {
        setItems(val);
        setFilteredItems(val as HistoryType[]);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });

    window.app.analytics.page('/history');
  }, []);

  return (
    <div id="History__container">
      <CloseButton handleClose={handleClose} />
      <div id="History__centered-container">
        <h2>{t('History')}</h2>
        <Button
          variant="contained"
          className="History__clear-button"
          onClick={handleClearHistory}
        >
          Clear history
        </Button>
        <input
          type="text"
          className="History__search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('Search')}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <AutoSize>
            {({ height }: { height: number }) => (
              <List
                height={height - 230}
                itemCount={filteredItems.length}
                width={800}
                itemData={filteredItems as unknown as History[]}
                itemSize={110}
              >
                {
                  ((data: any, index: any, style: any) => (
                    <Item
                      data={data}
                      index={index}
                      style={style}
                      items={items}
                      setItems={setItems}
                      browser={browser}
                      handleClose={handleClose}
                    />
                  )) as ComponentType<ListChildComponentProps<History[]>>
                }
              </List>
            )}
          </AutoSize>
        )}
      </div>
    </div>
  );
};
