/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { CloseButton } from 'renderer/App/components/CloseButton';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { Import } from './Import';
import { BookmarksItem } from './BookmarksItem';

import { BookmarksProps, BookmarkType } from './Types';

import './style.scss';

export const Bookmarks: React.FC<BookmarksProps> = ({
  handleClose,
}: BookmarksProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [showImport, setShowImport] = useState<boolean>(false);
  const [items, setItems] = useState<BookmarkType[]>([]);
  const [filteredItems, setFilteredItems] = useState<BookmarkType[]>([]);
  const { browser } = useStoreHelpers();

  const replaceItem = (bookmark: BookmarkType) => {
    const newItems = [...items];
    const index = newItems.findIndex((i) => i.id === bookmark.id);
    if (index > -1) newItems[index] = bookmark;
    setItems(newItems);
  };

  const handleDeleteBookmark = (id: number) => {
    const url = items.find((i) => i.id === id)?.url;
    if (url) window.app.bookmark.removeBookmark(url);
    const newItems = [...items];
    const index = newItems.findIndex((i) => i.id === id);
    if (index > -1) newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleBookmarkClick = (url: string) => {
    browser.add({ url });
    handleClose();
  };

  const refreshList = () => {
    window.app.bookmark
      .getAllBookmarks()
      .then((val) => {
        setItems(val);
        setFilteredItems(val);
      })
      .catch(console.log);
  };

  const handleImport = () => setShowImport(true);
  const handleCloseImport = () => {
    setShowImport(false);
    refreshList();
  };

  useEffect(() => {
    const filtered = items?.filter(
      (i) =>
        i.url.toLowerCase().includes(search.toLowerCase()) ||
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        !i.tags?.every(
          (tag) => !tag.toLocaleLowerCase().includes(search.toLowerCase())
        )
    );
    setFilteredItems(filtered);
  }, [search, items]);

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <>
      {showImport && <Import handleClose={handleCloseImport} />}
      <div id="Bookmarks__container">
        <CloseButton handleClose={handleClose} />
        <div id="Bookmarks__centered-container">
          <h2>{t('Bookmarks')}</h2>
          <Button
            variant="contained"
            className="Bookmarks_import-button"
            onClick={handleImport}
          >
            {t('Import')}
          </Button>
          <input
            type="text"
            className="Bookmarks__search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search')}
          />
          {filteredItems?.map((i) => (
            <BookmarksItem
              key={i.id}
              bookmark={i}
              handleClick={handleBookmarkClick}
              handleDelete={handleDeleteBookmark}
              replaceItem={replaceItem}
            />
          ))}
        </div>
      </div>
    </>
  );
};
