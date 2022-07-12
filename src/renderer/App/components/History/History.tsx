/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';

import { CloseButton } from 'renderer/App/components/CloseButton';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';

import { HistoryProps, HistoryType } from './Types';

import './style.scss';

export const History: React.FC<HistoryProps> = ({
  handleClose,
}: HistoryProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<HistoryType[]>([]);
  const [filteredItems, setFilteredItems] = useState<HistoryType[]>([]);
  const { browser } = useStoreHelpers();

  const handleHistoryClick = (url: string) => {
    browser.add({ url });
    handleClose();
  };

  const handleDeleteHistory = (id: number) => {
    window.app.db.removeHistory(id);
    const newItems = [...items];
    const index = newItems.findIndex((i) => i.id === id);
    if (index > -1) newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleClearHistory = () => {
    setItems([]);
    window.app.db.clearHistory();
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
    window.app.db
      .getAllHistory()
      .then((val) => {
        setItems(val);
        setFilteredItems(val);
      })
      .catch(console.log);
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
        {filteredItems.map((i) => {
          return (
            <div className="History__item" key={i.id}>
              <div
                className="History__item-text"
                onClick={() => handleHistoryClick(i.url)}
              >
                <div className="History__item-title">{i.title}</div>
                <div className="History__item-date">{i.date}</div>
                <div className="History__item-url">{i.url}</div>
              </div>
              <div className="History__item-controls">
                <div
                  className="History__item-control"
                  onClick={() => handleDeleteHistory(i.id)}
                >
                  <DeleteForeverIcon />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
