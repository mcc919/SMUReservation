import { SuggestionStates } from "../components/SuggestionState";

export const suggestionStateList = Object.entries(SuggestionStates).map(([key, value]) => ({
  key,
  label: `${value.icon} ${value.label}`,
  value: value.value,
}));
