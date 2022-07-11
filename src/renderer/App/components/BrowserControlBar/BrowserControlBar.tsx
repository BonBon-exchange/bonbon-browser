/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React, {
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from 'react';
import TextField from '@mui/material/TextField';
import CachedIcon from '@mui/icons-material/Cached';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

import { BrowserInputSuggestions } from 'renderer/App/components/BrowserInputSuggestions';
import { updateBrowserUrl } from 'renderer/App/store/reducers/Board';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { isValidHttpUrl, makeSearchUrl } from 'renderer/App/helpers/web';
import { useBoard } from 'renderer/App/hooks/useBoard';

import { BrowserControlBarProps } from './Types';

import './style.scss';

export const BrowserControlBar: React.FC<BrowserControlBarProps> = ({
  goBack,
  goForward,
  reload,
  url,
  browserId,
  goHome,
}) => {
  const [urlInputValue, setUrlInputValue] = useState<string>(url);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const container = document.querySelector(`#Browser__${browserId}`);
  const webview = container?.querySelector('webview') as Electron.WebviewTag;
  const board = useBoard();
  const browser = board.browsers.find((b) => b.id === browserId);

  const urlInputOnKeyPress: KeyboardEventHandler = async (e) => {
    setShowSuggestions(true);
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      setShowSuggestions(false);
      const target = e.target as HTMLInputElement;

      const re =
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

      const addHttps =
        !isValidHttpUrl(target?.value) &&
        isValidHttpUrl(`https://${target?.value}`) &&
        `https://${target?.value}`.match(re);

      let newUrl;
      if (addHttps) {
        newUrl = `https://${target?.value}`;
      } else {
        newUrl = isValidHttpUrl(target?.value)
          ? target?.value
          : await makeSearchUrl(target?.value);
      }

      webview?.loadURL(newUrl).catch(console.log);

      dispatch(
        updateBrowserUrl({
          url: newUrl,
          browserId,
        })
      );
    }
  };

  const onFocusInput: FocusEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    target.select();
  };

  const hideSuggestions = () => setShowSuggestions(false);

  const handleSuggestionClick = (clickedUrl: string) => {
    webview?.loadURL(clickedUrl).catch(console.log);
  };

  const handleBookmark = () => {
    if (browser?.url && browser?.title) {
      if (isBookmarked) {
        window.app.db.removeBookmark(browser?.url);
        setIsBookmarked(false);
      } else {
        window.app.db.addBookmark({ url: browser?.url, title: browser?.title });
        setIsBookmarked(true);
      }
    }
  };

  useEffect(() => {
    setUrlInputValue(url);
  }, [url]);

  useEffect(() => {
    window.addEventListener('click', hideSuggestions);
    return () => window.removeEventListener('click', hideSuggestions);
  }, []);

  useEffect(() => {
    if (browser?.url) {
      window.app.db
        .isBookmarked(browser?.url)
        .then((val) => setIsBookmarked(val))
        .catch(console.log);
    }
  }, [browser?.url]);

  return (
    <div className="BrowserControlBar__container">
      <div className="BrowserControlBar__controls">
        <div className="BrowserControlBar__control" onClick={goBack}>
          <ArrowBackIcon />
        </div>
        <div className="BrowserControlBar__control" onClick={goForward}>
          <ArrowForwardIcon />
        </div>
        <div className="BrowserControlBar__control" onClick={reload}>
          <CachedIcon />
        </div>
        <div className="BrowserControlBar__control" onClick={goHome}>
          <HomeIcon />
        </div>
      </div>
      <TextField
        variant="standard"
        value={urlInputValue}
        className="BrowserControlBar_url-input"
        onKeyPress={urlInputOnKeyPress}
        onFocus={onFocusInput}
        onChange={(e) => setUrlInputValue(e.target.value)}
      />
      <div
        className="BrowserControlBar__bookmark-control"
        onClick={handleBookmark}
      >
        {isBookmarked ? <StarIcon /> : <StarBorderIcon />}
      </div>
      {showSuggestions && (
        <BrowserInputSuggestions
          inputValue={urlInputValue}
          handleSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
};
