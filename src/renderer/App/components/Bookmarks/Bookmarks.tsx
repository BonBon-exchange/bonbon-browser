/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { CloseButton } from 'renderer/App/components/CloseButton';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';

import { BookmarksProps, BookmarkType } from './Types';

import './style.scss';

export const Bookmarks: React.FC<BookmarksProps> = ({
  handleClose,
}: BookmarksProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<BookmarkType[]>([]);
  const [filteredItems, setFilteredItems] = useState<BookmarkType[]>([]);
  const { browser } = useStoreHelpers();

  const handleBookmarkClick = (url: string) => {
    browser.add({ url });
    handleClose();
  };

  const handleDeleteBookmark = (id: number) => {
    const url = items.find((i) => i.id === id)?.url;
    if (url) window.app.db.removeBookmark(url);
    const newItems = [...items];
    const index = newItems.findIndex((i) => i.id === id);
    if (index > -1) newItems.splice(index, 1);
    setItems(newItems);
  };

  useEffect(() => {
    const filtered = items.filter(
      (i) => i.url.includes(search) || i.name.includes(search)
    );
    setFilteredItems(filtered);
  }, [search, items]);

  useEffect(() => {
    window.app.db
      .getAllBookmarks()
      .then((val) => {
        setItems(val);
        setFilteredItems(val);
      })
      .catch(console.log);
  }, []);

  return (
    <div id="Bookmarks__container">
      <CloseButton handleClose={handleClose} />
      <div id="Bookmarks__centered-container">
        <h2>{t('Bookmarks')}</h2>
        <input
          type="text"
          className="Bookmarks__search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('Search')}
        />
        {filteredItems.map((i) => {
          return (
            <div className="Bookmarks__item" key={i.id}>
              <div
                className="Bookmarks__item-text"
                onClick={() => handleBookmarkClick(i.url)}
              >
                <div className="Bookmarks__item-name">{i.name}</div>
                <div className="Bookmarks__item-url">{i.url}</div>
              </div>
              <div className="Bookmarks__item-controls">
                <div
                  className="Bookmarks__item-control"
                  onClick={() => handleDeleteBookmark(i.id)}
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
