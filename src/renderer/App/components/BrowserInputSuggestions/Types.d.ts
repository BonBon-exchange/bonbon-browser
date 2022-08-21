export interface BrowserInputSuggestionsProps {
  inputValue: string;
  handleSuggestionClick: (url: string) => void;
  setSelectedSuggestion: (url: string | null) => void;
  setDomainSuggestionResults: (items: SuggestionItem[]) => void;
}

export type HistoryItem = {
  id: number;
  url: string;
  date: string;
}

export type SuggestionItem = {
  id: string;
  url?: string;
  display?: string;
  type: string;
}
