/* eslint-disable @typescript-eslint/no-unused-expressions */
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
  useRef,
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
import { SuggestionItem } from 'renderer/App/components/BrowserInputSuggestions/Types';
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
  const [urlInputForAutocomplete, setUrlInputForAutocomplete] =
    useState<string>();
  const [urlInputValue, setUrlInputValue] = useState<string>(url);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [domainSuggestionResults, setDomainSuggestionResults] = useState<
    SuggestionItem[]
  >([]);
  const [inputCursor, setInputCursor] = useState<number>(0);
  const [userTyped, setUserTyped] = useState<string>('');
  const [userDeleting, setUserDeleting] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const webview = getWebviewFromBrowserId(browserId);
  const board = useBoard();
  const browser = board.browsers.find((b) => b.id === browserId);

  const hideSuggestions = () => {
    setShowSuggestions(false);
    setSelectedSuggestion(null);
  };

  const handleLoadUserUrl = async (loadUrl: string) => {
    const re =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

    const addHttps =
      !isValidHttpUrl(loadUrl) &&
      isValidHttpUrl(`https://${loadUrl}`) &&
      `https://${loadUrl}`.match(re);

    let newUrl;
    if (addHttps) {
      newUrl = `https://${loadUrl}`;
    } else {
      newUrl = isValidHttpUrl(loadUrl) ? loadUrl : await makeSearchUrl(loadUrl);
    }

    webview?.loadURL(newUrl).catch(console.log);

    dispatch(
      updateBrowserUrl({
        url: newUrl,
        browserId,
      })
    );
  };

  const handleSuggestionClick = (clickedUrl: string) => {
    hideSuggestions();
    handleLoadUserUrl(clickedUrl);
  };

  const urlInputOnKeyUp: KeyboardEventHandler = (e) => {
    if (e.key !== 'ArrowUp') return;
    const target = e.target as HTMLInputElement;
    target?.setSelectionRange(target?.value.length, target?.value.length);
  };

  const urlInputOnKeyDown: KeyboardEventHandler = (e) => {
    const target = e.target as HTMLInputElement;

    if (e.key === 'Escape') {
      setShowSuggestions(false);
      return;
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setUserDeleting(true);
      setUrlInputForAutocomplete(undefined);
      setDomainSuggestionResults([]);
    } else {
      setUserDeleting(false);
    }

    if (selectedSuggestion && showSuggestions && e.key === 'Enter') {
      hideSuggestions();
      handleLoadUserUrl(selectedSuggestion);
      return;
    }

    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      hideSuggestions();
      domainSuggestionResults[0]
        ? handleLoadUserUrl(
            domainSuggestionResults[0].url ||
              domainSuggestionResults[0].display ||
              ''
          )
        : handleLoadUserUrl(target?.value);
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
        window.app.bookmark.removeBookmark(browser?.url);
        setIsBookmarked(false);
      } else {
        window.app.bookmark
          .addBookmark({
            url: browser?.url,
            name: browser?.title,
          })
          .then(() => {
            setIsBookmarked(true);
          })
          .catch(console.log);
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
    if (selectedSuggestion) setUrlInputValue(selectedSuggestion);
  }, [selectedSuggestion]);

  useEffect(() => {
    if (
      domainSuggestionResults[0] &&
      urlInputValue.length > 0 &&
      !userDeleting &&
      selectedSuggestion !== urlInputValue
    )
      setUrlInputForAutocomplete(domainSuggestionResults[0].display);
    else setUrlInputForAutocomplete(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domainSuggestionResults]);

  useEffect(() => {
    if (
      urlInputForAutocomplete &&
      urlInputValue.length > 0 &&
      urlInputForAutocomplete.indexOf(urlInputValue) === 0 &&
      selectedSuggestion !== urlInputValue
    )
      setUrlInputValue(urlInputForAutocomplete);

    if (!urlInputForAutocomplete) setUrlInputValue(userTyped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlInputForAutocomplete]);

  useEffect(() => {
    if (
      urlInputValue !== urlInputForAutocomplete &&
      urlInputForAutocomplete &&
      urlInputForAutocomplete.indexOf(urlInputValue) === 0 &&
      urlInputValue !== selectedSuggestion &&
      showSuggestions
    ) {
      setUrlInputValue(urlInputForAutocomplete);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlInputValue]);

  useEffect(() => {
    if (urlInputValue !== urlInputForAutocomplete) {
      if (urlInputValue.length < userTyped.length) {
        setUrlInputForAutocomplete(undefined);
      }

      if (urlInputValue !== selectedSuggestion) {
        setInputCursor(urlInputValue.length);
        setUrlInputForSuggestion(urlInputValue);
        setUserTyped(urlInputValue);
      }
    } else {
      const target = inputRef.current?.querySelector('input');
      if (target?.value)
        target?.setSelectionRange(inputCursor, target.value.length);
    }
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
      window.app.bookmark
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
        onKeyDown={urlInputOnKeyDown}
        onKeyUp={urlInputOnKeyUp}
        onFocus={onFocusInput}
        ref={inputRef}
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
          setDomainSuggestionResults={setDomainSuggestionResults}
        />
      )}
    </div>
  );
};
