/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';

import { BrowserInputSuggestionsProps, HistoryItem } from './Types';

import './style.scss';

export const BrowserInputSuggestions: React.FC<
  BrowserInputSuggestionsProps
> = ({ inputValue, handleSuggestionClick }: BrowserInputSuggestionsProps) => {
  const [suggetions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    window.app.db
      .findInHistory(inputValue)
      .then(({ _err, rows }: { _err: unknown; rows: HistoryItem[] }) => {
        const sugg = rows.map((r) => r.url);
        setSuggestions(sugg);
      });
  }, [inputValue]);

  return (
    <div className="BrowserInputSuggestions__container">
      <ul>
        {suggetions.map((s) => (
          <li onClick={() => handleSuggestionClick(s)}>{s}</li>
        ))}
      </ul>
    </div>
  );
};
