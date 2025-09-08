import { useSearchBar } from "../hooks/useSearchBar";
import { SearchBarProps } from "../types";

export const SearchBar = ({ searchText, onSearch, dict }: SearchBarProps) => {
  const { inputValue, handleInputChange, handleSubmit, handleClear } =
    useSearchBar({
      searchText,
      onSearch,
      dict,
    });

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={dict?.searchPlaceholder}
          className="w-full px-4 py-2 font-herm bg-offNegro border border-white text-white focus:outline-none focus:border-ama/50 pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-white font-herm text-sm"
            >
              {dict?.close}
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-1 bg-ama/20 font-herm text-ama border border-ama/30 text-sm hover:bg-ama/30 transition-colors"
          >
            {dict?.search}
          </button>
        </div>
      </form>
    </div>
  );
};
