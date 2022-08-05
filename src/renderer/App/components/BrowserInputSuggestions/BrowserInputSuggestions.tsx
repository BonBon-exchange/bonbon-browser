/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState, useCallback } from 'react';

import { getHostsFromHistory } from 'renderer/App/helpers/web';

import { BrowserInputSuggestionsProps, SuggestionItem } from './Types';

import './style.scss';

export const BrowserInputSuggestions: React.FC<
  BrowserInputSuggestionsProps
> = ({
  inputValue,
  handleSuggestionClick,
  setSelectedSuggestion,
  setSuggestionResults,
}: BrowserInputSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [selected, setSelected] = useState<SuggestionItem | null>(null);

  const keyDownListener = useCallback(
    (e: KeyboardEvent) => {
      let direction: 'next' | 'previous' | null;
      const selectedCurrentIndex = suggestions.findIndex((s) => s === selected);

      switch (e.key) {
        case 'ArrowDown':
          direction = 'next';
          break;

        case 'ArrowUp':
          direction = 'previous';
          break;

        default:
          direction = null;
          if (selected && selectedCurrentIndex === -1) setSelected(null);
          break;
      }

      if (direction) {
        if (selectedCurrentIndex === -1) {
          direction === 'next'
            ? setSelected(suggestions[0])
            : setSelected(suggestions[suggestions.length - 1]);
        } else {
          let newIndex;
          direction === 'next'
            ? (newIndex = selectedCurrentIndex + 1)
            : (newIndex = selectedCurrentIndex - 1);

          if (newIndex > suggestions.length - 1) {
            newIndex = 0;
          }

          if (newIndex < 0) {
            newIndex = suggestions.length - 1;
          }

          setSelected(suggestions[newIndex]);
        }
      }
    },
    [selected, suggestions]
  );

  useEffect(() => {
    setSelectedSuggestion(selected?.url || null);
  }, [selected?.url, setSelectedSuggestion]);

  useEffect(() => {
    if (inputValue.length === 0) {
      setSuggestions([]);
      setSelected(null);
      return;
    }

    const promises = [
      window.app.bookmark.findInBookmarks(inputValue),
      window.app.history.findInHistory(inputValue),
    ];

    Promise.all(promises)
      .then((result: any[]) => {
        // 2 suggestions of bookmarks
        const rows = result[0].rows
          .slice(0, 2)
          .map((r: SuggestionItem) => ({ ...r, id: `bookmark::${r.id}` }));

        // 4 suggestions of domains
        const domains = getHostsFromHistory([
          ...result[1].rows,
          ...result[0].rows,
        ]);
        rows.push(
          ...domains
            .filter((d) => d.url.includes(inputValue))
            .slice(0, 4)
            .map((r: SuggestionItem) => ({ ...r, id: `domain::${r.id}` }))
        );

        setSuggestionResults(
          domains
            .map((d) => (d.url.indexOf(inputValue) === 0 ? d.url : ''))
            .filter((u) => u !== '')
        );

        // 2 suggestions of history
        rows.push(
          ...result[1].rows
            .slice(0, 2)
            .map((r: SuggestionItem) => ({ ...r, id: `history::${r.id}` }))
        );

        setSuggestions(rows || []);
      })
      .catch(console.log);
  }, [inputValue, setSuggestionResults]);

  useEffect(() => {
    window.addEventListener('keydown', keyDownListener);
    return () => window.removeEventListener('keydown', keyDownListener);
  }, [keyDownListener]);

  return (
    <div className="BrowserInputSuggestions__container">
      <ul>
        {suggestions.map((s) => (
          <li
            key={`${s.id}::${s.url}`}
            className={
              s === selected
                ? 'BrowserInputSuggestions__selected-item'
                : undefined
            }
            onClick={() => handleSuggestionClick(s.url)}
          >
            {s.url}
          </li>
        ))}
      </ul>
    </div>
  );
};
