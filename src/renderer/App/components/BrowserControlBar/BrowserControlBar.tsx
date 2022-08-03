/* eslint-disable promise/always-return */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
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
import CloseIcon from '@mui/icons-material/Close';

import { BrowserInputSuggestions } from 'renderer/App/components/BrowserInputSuggestions';
import { updateBrowserUrl } from 'renderer/App/store/reducers/Board';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { isValidHttpUrl, makeSearchUrl } from 'renderer/App/helpers/web';
import { getWebviewFromBrowserId } from 'renderer/App/helpers/dom';
import { useBoard } from 'renderer/App/hooks/useBoard';

import { BrowserControlBarProps } from './Types';

import './style.scss';

export const BrowserControlBar: React.FC<BrowserControlBarProps> = ({
  url,
  browserId,
}) => {
  const [urlInputForSuggestion, setUrlInputForSuggestion] =
    useState<string>(url);
  const [urlInputValue, setUrlInputValue] = useState<string>(url);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const dispatch = useAppDispatch();
  const webview = getWebviewFromBrowserId(browserId);
  const board = useBoard();
  const browser = board.browsers.find((b) => b.id === browserId);

  const hideSuggestions = () => {
    setShowSuggestions(false);
    setSelectedSuggestion(null);
  };

  const handleSuggestionClick = (clickedUrl: string) => {
    hideSuggestions();
    dispatch(
      updateBrowserUrl({
        url: clickedUrl,
        browserId,
      })
    );
    webview?.loadURL(clickedUrl).catch(console.log);
  };

  const urlInputOnKeyUp: KeyboardEventHandler = (e) => {
    if (e.key !== 'ArrowUp') return;
    const target = e.target as HTMLInputElement;
    target?.setSelectionRange(target?.value.length, target?.value.length);
  };

  const urlInputOnKeyPress: KeyboardEventHandler = async (e) => {
    const target = e.target as HTMLInputElement;
    if (selectedSuggestion && showSuggestions && e.key === 'Enter') {
      handleSuggestionClick(selectedSuggestion);
      return;
    }

    if (
      showSuggestions &&
      selectedSuggestion &&
      (e.key === 'ArrowDown' || e.key === 'ArrowUp')
    ) {
      setUrlInputValue(selectedSuggestion);
      return;
    }

    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      hideSuggestions();

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

      return;
    }

    setShowSuggestions(true);
  };

  const onFocusInput: FocusEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    target.select();
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

  const goBack = () => {
    webview?.goBack();
  };

  const goForward = () => {
    webview?.goForward();
  };

  const reload = () => {
    webview?.reload();
  };

  const stop = () => {
    webview?.stop();
  };

  const goHome = () => {
    window.app.config.get('browsing.defaultWebpage').then((val) => {
      const defaultWebpage = val as string;
      webview?.loadURL(defaultWebpage).catch(console.log);
      dispatch(
        updateBrowserUrl({
          url: defaultWebpage,
          browserId,
        })
      );
    });
  };

  useEffect(() => {
    if (urlInputValue !== selectedSuggestion)
      setUrlInputForSuggestion(urlInputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlInputValue]);

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

  useEffect(() => {
    if (urlInputValue.length === 0) hideSuggestions();
  }, [urlInputValue.length]);

  return (
    <div className="BrowserControlBar__container">
      <div className="BrowserControlBar__controls">
        <div className="BrowserControlBar__control" onClick={goBack}>
          <ArrowBackIcon />
        </div>
        <div className="BrowserControlBar__control" onClick={goForward}>
          <ArrowForwardIcon />
        </div>
        {browser?.isLoading ? (
          <div className="BrowserControlBar__control" onClick={stop}>
            <CloseIcon />
          </div>
        ) : (
          <div className="BrowserControlBar__control" onClick={reload}>
            <CachedIcon />
          </div>
        )}
        <div className="BrowserControlBar__control" onClick={goHome}>
          <HomeIcon />
        </div>
      </div>
      <TextField
        variant="standard"
        value={urlInputValue}
        className="BrowserControlBar_url-input"
        // onKeyPress={urlInputOnKeyPress}
        onKeyDown={urlInputOnKeyPress}
        onKeyUp={urlInputOnKeyUp}
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
          inputValue={urlInputForSuggestion}
          handleSuggestionClick={handleSuggestionClick}
          setSelectedSuggestion={setSelectedSuggestion}
        />
      )}
    </div>
  );
};
