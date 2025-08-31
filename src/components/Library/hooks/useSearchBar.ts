import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { SearchBarProps } from "../types";

export const useSearchBar = ({ searchText, onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState<string>(searchText);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  }, [inputValue, onSearch]);

  const handleClear = useCallback(() => {
    setInputValue("");
    onSearch("");
  }, [onSearch]);

  return {
    inputValue,
    handleInputChange,
    handleSubmit,
    handleClear,
  };
};