import React, { useContext, useEffect } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import pageURLs from 'constants/pagesURLs';
import {SearchContext} from "../../misc/providers/SearchProvider";

const GlobalSearch: React.FC = () => {
    const location = useLocation();
    const { searchTerm, setSearchTerm } = useContext(SearchContext);

    const isSearchVisible = [pageURLs.catalog, pageURLs.orders].includes(location.pathname);

    useEffect(() => {
        setSearchTerm('');
    }, [location, setSearchTerm]);

    if (!isSearchVisible) return null;

    const placeholder = location.pathname === pageURLs.catalog
        ? "Search for goods..."
        : location.pathname === pageURLs.orders
            ? "Search for orders..."
            : "Search...";

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <TextField
            placeholder={placeholder}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="action" />
                    </InputAdornment>
                ),
            }}
            sx={{ width: 300, mr: 2 }}
        />
    );
};

export default GlobalSearch;