/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, Select, MenuItem, Chip } from '@mui/material';

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
        {filteredItems.map((i) => {
          return (
            <div className="Bookmarks__item" key={i.id}>
              <div className="Bookmarks__item-text">
                <div className="Bookmarks__item-name">{i.name}</div>
                <div className="Bookmarks__item-url">{i.url}</div>
                <div className="Bookmarks__item-tags">
                  {i.tags?.map((tag) => (
                    <Chip label={tag} />
                  ))}
                </div>
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
