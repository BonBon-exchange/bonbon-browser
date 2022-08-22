/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Button from '@mui/material/Button';

import { CloseButton } from 'renderer/App/components/CloseButton';

import { DownloadsProps, DownloadType } from './Types';

import './style.scss';

export const Downloads: React.FC<DownloadsProps> = ({
  handleClose,
}: DownloadsProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<DownloadType[]>([]);
  const [filteredItems, setFilteredItems] = useState<DownloadType[]>([]);

  const handleOpenDownload = (savePath: string) => {
    window.app.tools.showItemInFolder(savePath);
  };

  const handleDeleteDownload = (id: number) => {
    window.app.download
      .removeDownload(id)
      .then(() => {
        const newItems = [...items];
        const index = newItems.findIndex((i) => i.id === id);
        if (index > -1) newItems.splice(index, 1);
        setItems(newItems);
      })
      .catch(console.log);
  };

  const handleClearDownloads = () => {
    window.app.download
      .clearDownloads()
      .then(() => {
        setItems([]);
      })
      .catch(console.log);
  };

  useEffect(() => {
    const filtered = items.filter(
      (i) =>
        (i.filename && i.filename.includes(search)) ||
        (i.savePath && i.savePath.includes(search))
    );
    setFilteredItems(filtered);
  }, [search, items]);

  useEffect(() => {
    window.app.download
      .getAllDownloads()
      .then((val) => {
        setItems(val);
        setFilteredItems(val);
      })
      .catch(console.log);

    window.app.analytics.page('/downloads');
  }, []);

  return (
    <div id="Downloads__container">
      <CloseButton handleClose={handleClose} />
      <div id="Downloads__centered-container">
        <h2>{t('Downloads')}</h2>
        <Button
          variant="contained"
          className="Downloads__clear-button"
          onClick={handleClearDownloads}
        >
          {t('Clear')}
        </Button>
        <input
          type="text"
          className="Downloads__search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('Search')}
        />
        {filteredItems.map((i) => {
          return (
            <div className="Downloads__item" key={i.id}>
              <div
                className="Downloads__item-text"
                onClick={() => handleOpenDownload(i.savePath)}
              >
                <div className="Downloads__item-title">{i.filename}</div>
                <div className="Downloads__item-date">{i.date}</div>
                <div className="Downloads__item-url">{i.savePath}</div>
              </div>
              <div className="Downloads__item-controls">
                <div
                  className="Downloads__item-control"
                  onClick={() => handleDeleteDownload(i.id)}
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
