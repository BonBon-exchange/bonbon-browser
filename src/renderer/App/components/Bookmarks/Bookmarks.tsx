/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import AutoSize from 'react-virtualized-auto-sizer';

import { CloseButton } from 'renderer/App/components/CloseButton';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { Loader } from 'renderer/App/components/Loader';
import { Bookmark as BookmarkType } from 'types/bookmarks';
import { BookmarksItem } from './BookmarksItem';
import { Import } from './Import';

import { BookmarksProps } from './Types';

import './style.scss';

export const Bookmarks: React.FC<BookmarksProps> = ({
  handleClose,
}: BookmarksProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [showImport, setShowImport] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    if (url) {
      window.app.bookmark
        .removeBookmark(url)
        .then(() => {
          const newItems = [...items];
          const index = newItems.findIndex((i) => i.id === id);
          if (index > -1) newItems.splice(index, 1);
          setItems(newItems);
        })
        .catch(console.log);
    }
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
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  };

  const handleImport = () => setShowImport(true);
  const handleCloseImport = () => {
    setShowImport(false);
    refreshList();
  };

  const Item = ({
    data,
    index,
    style,
  }: {
    data: BookmarkType[];
    index: number;
    style: any;
  }) => {
    return (
      <div style={style}>
        <BookmarksItem
          key={data[index].id}
          bookmark={data[index]}
          handleClick={handleBookmarkClick}
          handleDelete={handleDeleteBookmark}
          replaceItem={replaceItem}
        />
      </div>
    );
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
    window.app.analytics.page('/bookmarks');
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
            data-testid="import-bookmarks-button"
          >
            {t('Import')}
          </Button>
          <input
            type="text"
            className="Bookmarks__search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('Search')}
          />
          {isLoading ? (
            <Loader />
          ) : (
            <AutoSize>
              {({ height }) => (
                <List
                  height={height - 230}
                  itemCount={filteredItems.length}
                  width={800}
                  itemData={filteredItems}
                  itemSize={150}
                >
                  {Item}
                </List>
              )}
            </AutoSize>
          )}
        </div>
      </div>
    </>
  );
};
