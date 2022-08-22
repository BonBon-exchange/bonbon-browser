/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { CloseButton } from 'renderer/App/components/CloseButton';

import { ExtensionsProps } from './Types';

import './style.scss';

export const Extensions: React.FC<ExtensionsProps> = ({
  handleClose,
}: ExtensionsProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<Electron.Extension[]>([]);
  const [filteredItems, setFilteredItems] = useState<Electron.Extension[]>([]);

  const handleDeleteExtension = (id: string) => {
    window.app.extension
      .deleteExtension(id)
      .then(() => {
        const newItems = [...items];
        const index = newItems.findIndex((i) => i.id === id);
        if (index > -1) newItems.splice(index, 1);
        setItems(newItems);
      })
      .catch(console.log);
  };

  useEffect(() => {
    const filtered = items.filter(
      (i) =>
        (i.name && i.name.includes(search)) || (i.id && i.id.includes(search))
    );
    setFilteredItems(filtered);
  }, [search, items]);

  useEffect(() => {
    window.app.extension
      .getAllExtensions()
      .then((val) => {
        setItems(val);
        setFilteredItems(val);
      })
      .catch(console.log);

    window.app.analytics.page('/extensions');
  }, []);

  return (
    <div id="Extensions__container">
      <CloseButton handleClose={handleClose} />
      <div id="Extensions__centered-container">
        <h2>{t('Extensions')}</h2>
        <input
          type="text"
          className="Extensions__search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('Search')}
        />
        {filteredItems.map((i) => {
          return (
            <div className="Extensions__item" key={i.id}>
              <div className="Extensions__item-text">
                <div className="Extensions__item-name">{i.name}</div>
                <div className="Extensions__item-version">v{i.version}</div>
                <div className="Extensions__item-description">
                  {i.manifest.description}
                </div>
              </div>
              <div className="Extensions__item-controls">
                <div
                  className="Extensions__item-control"
                  onClick={() => handleDeleteExtension(i.id)}
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
