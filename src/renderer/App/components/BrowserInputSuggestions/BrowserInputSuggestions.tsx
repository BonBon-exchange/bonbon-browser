/* eslint-disable import/prefer-default-export */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react';

import { getDomainsFromHistory } from 'renderer/App/helpers/web';

import { BrowserInputSuggestionsProps, SuggestionItem } from './Types';

import './style.scss';

export const BrowserInputSuggestions: React.FC<
  BrowserInputSuggestionsProps
> = ({ inputValue, handleSuggestionClick }: BrowserInputSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);

  useEffect(() => {
    if (inputValue.length === 0) {
      setSuggestions([]);
      return;
    }

    const promises = [
      window.app.db.findInBookmarks(inputValue),
      window.app.db.findInHistory(inputValue),
    ];

    Promise.all(promises)
      .then((result: any[]) => {
        // 2 suggestions of bookmarks
        const rows = result[0].rows.slice(0, 2);

        // 2 suggestions of domains
        const domains = getDomainsFromHistory(result[1].rows);
        rows.push(
          ...domains.filter((d) => d.url.includes(inputValue)).slice(0, 2)
        );

        // 2 suggestions of history
        rows.push(...result[1].rows.slice(0, 2));

        setSuggestions(rows || []);
      })
      .catch(console.log);
  }, [inputValue]);

  return (
    <div className="BrowserInputSuggestions__container">
      <ul>
        {suggestions.map((s) => (
          <li
            key={`${s.id}::${s.url}`}
            onClick={() => handleSuggestionClick(s.url)}
          >
            {s.url}
          </li>
        ))}
      </ul>
    </div>
  );
};
