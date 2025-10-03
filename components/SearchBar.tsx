"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Поиск товаров...", 
  className = "",
  initialValue = ""
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  // Update local state when initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleClear = () => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        position: 'relative', 
        width: '100%' 
      }}
      className={className}
    >
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        backgroundColor: isFocused ? 'white' : '#f9fafb',
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        border: isFocused ? '2px solid #fed7aa' : '1px solid #e5e7eb',
        boxShadow: isFocused ? '0 0 0 3px rgba(249, 115, 22, 0.1)' : 'none'
      }}>
        {/* Search Icon */}
        <div style={{
          position: 'absolute',
          left: '12px',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <Search size={16} color="#9ca3af" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            paddingLeft: '40px',
            paddingRight: query ? '40px' : '16px',
            paddingTop: '10px',
            paddingBottom: '10px',
            fontSize: '14px',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#111827'
          }}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '12px',
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#6b7280'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#9ca3af'}
            aria-label="Очистить поиск"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Hidden submit button for accessibility */}
      <button type="submit" style={{ display: 'none' }}>
        Найти
      </button>
    </form>
  );
};

export default SearchBar;
