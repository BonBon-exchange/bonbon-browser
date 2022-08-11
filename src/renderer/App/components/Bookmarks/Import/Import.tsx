/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, Select, MenuItem, Chip } from '@mui/material';
import { FixedSizeList as List } from 'react-window';
import AutoSize from 'react-virtualized-auto-sizer';

import { CloseButton } from 'renderer/App/components/CloseButton';

import { ImportProps } from './Types';
import { BookmarkType } from '../Types';

import './style.scss';

export const Import: React.FC<ImportProps> = ({ handleClose }: ImportProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<BookmarkType[]>([]);
  const [bookmarksProviders, setBookmarksProviders] = useState<string[]>([]);
  const [selectedBookmarksProviders, setSelectedBookmarksProviders] =
    useState<string>('');
  const [filteredItems, setFilteredItems] = useState<BookmarkType[]>([]);
  const [importButtonText, setImportButtonText] = useState<string>(
    t('Import all')
  );

  const handleImportAll = () => {
    if (selectedBookmarksProviders?.length === 0) return;
    window.app.bookmark.importBookmarks(filteredItems);
    setImportButtonText(t('Importing...'));
    setTimeout(() => {
      setImportButtonText(t('Done'));
      setSelectedBookmarksProviders('');
      setItems([]);
    }, 1500);
  };

  const handleDeleteBookmark = (id: number) => {
    const newItems = [...items];
    const index = newItems.findIndex((i) => i.id === id);
    if (index > -1) newItems.splice(index, 1);
    setItems(newItems);
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
        <div className="Bookmarks__item" key={data[index].id}>
          <div className="Bookmarks__item-text">
            <div className="Bookmarks__item-name">{data[index].name}</div>
            <div className="Bookmarks__item-url">{data[index].url}</div>
            <div className="Bookmarks__item-tags">
              {data[index].tags?.map((tag) => (
                <Chip label={tag} key={tag} />
              ))}
            </div>
          </div>
          <div className="Bookmarks__item-controls">
            <div
              className="Bookmarks__item-control"
              onClick={() => handleDeleteBookmark(data[index].id)}
            >
              <DeleteForeverIcon />
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const filtered = items
      ? items.filter(
          (i) =>
            i.url.toLowerCase().includes(search.toLowerCase()) ||
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            !i.tags?.every(
              (tag) => !tag.toLocaleLowerCase().includes(search.toLowerCase())
            )
        )
      : [];
    setFilteredItems(filtered);
  }, [search, items]);

  useEffect(() => {
    window.app.bookmark
      .getBookmarksProviders()
      .then((val) => {
        setBookmarksProviders(val);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (selectedBookmarksProviders && selectedBookmarksProviders.length > 0) {
      setImportButtonText(t('Import all'));
      window.app.bookmark
        .getBookmarksFromProvider(selectedBookmarksProviders)
        .then((val) => {
          setItems(val);
        })
        .catch(console.log);
    } else {
      setItems([]);
    }
  }, [selectedBookmarksProviders, t]);

  return (
    <div id="Import__container">
      <CloseButton handleClose={handleClose} />
      <div id="Import__centered-container">
        <h2>{t('Import')}</h2>
        <div className="Import__action-line">
          {t('Select a browser to import from')}
          <Select
            className="Import_providers-list"
            label="Browsers"
            value={selectedBookmarksProviders}
            onChange={(e) => setSelectedBookmarksProviders(e.target.value)}
          >
            {bookmarksProviders.map((b) => {
              return (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <Button
          variant="contained"
          className="Import_import-all-button"
          onClick={handleImportAll}
          disabled={importButtonText !== t('Import all')}
        >
          {importButtonText}
        </Button>
        <input
          type="text"
          className="Import__search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('Search')}
        />
        <AutoSize>
          {({ height }) => (
            <List
              height={height - 290}
              itemCount={filteredItems.length}
              width={800}
              itemData={filteredItems}
              itemSize={150}
            >
              {Item}
            </List>
          )}
        </AutoSize>
      </div>
    </div>
  );
};
