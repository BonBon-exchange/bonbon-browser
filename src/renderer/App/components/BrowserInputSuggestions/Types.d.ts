export interface BrowserInputSuggestionsProps {
  inputValue: string;
  handleSuggestionClick: (url: string) => void;
}

export type HistoryItem = {
  id: number;
  url: string;
  date: string;
}
