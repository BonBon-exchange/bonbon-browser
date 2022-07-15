/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect, useRef, useState } from 'react';
import { FoundInPageEvent } from 'electron';
import { TextField } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';

import { getWebviewFromBrowserId } from 'renderer/App/helpers/dom';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';

import { SearchFormProps } from './Types';

import './style.scss';

export const SearchForm: React.FC<SearchFormProps> = ({
  browserId,
}: SearchFormProps) => {
  const textFieldRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [ordinal, setOrdinal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const webview = getWebviewFromBrowserId(browserId);
  const { browser } = useStoreHelpers();

  const handleClearAndClose = () => {
    setInputValue('');
    webview?.stopFindInPage('clearSelection');
    browser.toggleSearch(browserId);
  };

  const foundInPageListener = useCallback((e: Event) => {
    const event = e as FoundInPageEvent;
    setOrdinal(event.result.activeMatchOrdinal);
    setTotal(event.result.matches);
  }, []);

  const handleKeyDown = (key: string) => {
    if (key === 'Enter' || key === 'NumpadEnter') {
      webview?.findInPage(inputValue, { forward: true });
    }
  };

  useEffect(() => {
    if (textFieldRef.current)
      textFieldRef.current.getElementsByTagName('input')[0].focus();
  }, []);

  useEffect(() => {
    if (inputValue.length > 0) webview?.findInPage(inputValue);
  }, [webview, inputValue]);

  useEffect(() => {
    webview?.addEventListener('found-in-page', foundInPageListener);
    return () =>
      webview?.removeEventListener('found-in-page', foundInPageListener);
  }, [foundInPageListener, webview]);

  return (
    <div className="SearchForm__container">
      <TextField
        className="SearchForm__textfield"
        ref={textFieldRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e.key)}
      />
      {`${ordinal}/${total}`}
      <div
        className="SearchForm__control-item"
        onClick={() => webview?.findInPage(inputValue, { forward: false })}
      >
        <ExpandLessIcon />
      </div>
      <div
        className="SearchForm__control-item"
        onClick={() => webview?.findInPage(inputValue, { forward: true })}
      >
        <ExpandMoreIcon />
      </div>
      <div className="SearchForm__control-item" onClick={handleClearAndClose}>
        <ClearIcon />
      </div>
    </div>
  );
};
