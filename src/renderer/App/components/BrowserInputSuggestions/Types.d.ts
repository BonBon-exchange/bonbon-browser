export interface BrowserInputSuggestionsProps {
  inputValue: string;
  handleSuggestionClick: (url: string) => void;
  setSelectedSuggestion: (url: string | null) => void;
}

export type HistoryItem = {
  id: number;
  url: string;
  date: string;
}

export type SuggestionItem = {
  id: number;
  url: string;
}
