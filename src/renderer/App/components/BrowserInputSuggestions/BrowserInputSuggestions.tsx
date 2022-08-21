/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState, useCallback } from 'react';

import { BrowserInputSuggestionsProps, SuggestionItem } from './Types';

import './style.scss';

export const BrowserInputSuggestions: React.FC<
  BrowserInputSuggestionsProps
> = ({
  inputValue,
  handleSuggestionClick,
  setSelectedSuggestion,
  setDomainSuggestionResults,
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
    if (selected) {
      switch (selected.type) {
        case 'domain':
          setSelectedSuggestion(selected?.display || null);
          break;

        default:
          setSelectedSuggestion(selected?.url || null);
          break;
      }
    }
  }, [setSelectedSuggestion, selected]);

  useEffect(() => {
    if (inputValue.length === 0) {
      setSuggestions([]);
      setSelected(null);
      return;
    }

    const promises = [
      window.app.bookmark.findInBookmarks(inputValue),
      window.app.history.findInHistory(inputValue),
      window.app.tools.findInKnownDomains(inputValue),
    ];

    Promise.all(promises)
      .then((result: any[]) => {
        // 2 suggestions of bookmarks
        const rows = result[0].slice(0, 2).map((r: SuggestionItem) => ({
          ...r,
          type: 'bookmark',
          id: `bookmark::${r.id}`,
        }));

        // 4 suggestions of domains
        const domainsResults: SuggestionItem[] = result[2]
          .map((r: any, i: number) => {
            return {
              id: `domain::${r.id}::${i}`,
              display: r.domain,
              type: 'domain',
            };
          })
          .reduce((acc: SuggestionItem[], val: SuggestionItem) => {
            const exist = acc.find((a) => a.display === val.display);
            return exist ? acc : [...acc, val];
          }, [])
          .slice(0, 3);

        setDomainSuggestionResults(domainsResults);
        rows.push(...domainsResults);

        // 2 suggestions of history
        rows.push(
          ...result[1].slice(0, 2).map((r: SuggestionItem) => ({
            ...r,
            type: 'history',
            id: `history::${r.id}`,
          }))
        );

        setSuggestions(rows || []);
      })
      .catch(console.log);
  }, [inputValue, setDomainSuggestionResults]);

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
            onClick={() => handleSuggestionClick(s.url || s.display || '')}
          >
            {s.display || s.url}
          </li>
        ))}
      </ul>
    </div>
  );
};
