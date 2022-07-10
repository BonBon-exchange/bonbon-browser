/* eslint-disable import/prefer-default-export */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useState } from 'react';

import { BrowserInputSuggestionsProps, HistoryItem } from './Types';

import './style.scss';

export const BrowserInputSuggestions: React.FC<
  BrowserInputSuggestionsProps
> = ({ inputValue, handleSuggestionClick }: BrowserInputSuggestionsProps) => {
  const [suggetions, setSuggestions] = useState<HistoryItem[]>([]);

  useEffect(() => {
    window.app.db
      .findInHistory(inputValue)
      .then(({ rows }: { rows: HistoryItem[] }) => {
        setSuggestions(rows || []);
      })
      .catch(console.log);
  }, [inputValue]);

  return (
    <div className="BrowserInputSuggestions__container">
      <ul>
        {suggetions.map((s) => (
          <li key={s.id} onClick={() => handleSuggestionClick(s.url)}>
            {s.url}
          </li>
        ))}
      </ul>
    </div>
  );
};
