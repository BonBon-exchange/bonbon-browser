/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useState, ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { CloseButton } from 'renderer/App/components/CloseButton';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { WebpagesWindows } from './WebpagesWindows';

import './style.scss';

import { DocumentationProps } from './Types';

export const Documentation: React.FC<DocumentationProps> = ({
  handleClose,
}: DocumentationProps) => {
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState<ReactElement>(
    <KeyboardShortcuts />
  );
  const [scrollbarVisible, setScrollBarVisible] = useState<null | boolean>(
    false
  );

  const isScrollbarVisible = (element: HTMLElement | null) => {
    return element && element.scrollHeight > element.clientHeight;
  };

  useEffect(() => {
    setScrollBarVisible(
      isScrollbarVisible(document.getElementById('Documentation__right-panel'))
    );
  }, []);

  return (
    <div id="Documentation__container">
      <CloseButton
        handleClose={handleClose}
        customClass={clsx({
          'CloseButton__with-scrollbar': scrollbarVisible,
        })}
      />
      <div id="Documentation__left-panel">
        <h2>{t('Documentation')}</h2>
        <ul>
          <li onClick={() => setSelectedView(<KeyboardShortcuts />)}>
            {t('Keyboard shortcuts')}
          </li>
          <li
            onClick={() => setSelectedView(<WebpagesWindows />)}
            data-testid="documentation-webpages-link"
          >
            {t('Webpages windows')}
          </li>
        </ul>
      </div>
      <div id="Documentation__right-panel">{selectedView}</div>
    </div>
  );
};
