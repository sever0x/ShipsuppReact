import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    resetSearch: () => void;
}

const defaultContextValue: SearchContextType = {
    searchTerm: '',
    setSearchTerm: () => {},
    resetSearch: () => {},
};

export const SearchContext = createContext<SearchContextType>(defaultContextValue);

export const useSearch = () => useContext(SearchContext);

interface SearchProviderProps {
    children: ReactNode;
}

const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const resetSearch = () => setSearchTerm('');

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm, resetSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchProvider;