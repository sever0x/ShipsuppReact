import React, { useContext } from 'react';
import { TextField, InputAdornment, Theme, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';
import pageURLs from 'constants/pagesURLs';
import { SearchContext } from "../../misc/providers/SearchProvider";

interface GlobalSearchProps {
    expanded?: boolean;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ expanded = false }) => {
    const location = useLocation();
    const { searchTerm, setSearchTerm } = useContext(SearchContext);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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
            sx={{
                width: isMobile ? (expanded ? '100%' : '40px') : 300,
                mr: 2,
                transition: 'width 0.3s ease-in-out',
                '& .MuiOutlinedInput-root': {
                    pr: isMobile && !expanded ? 0 : 'inherit',
                },
                '& .MuiOutlinedInput-input': {
                    p: isMobile && !expanded ? 0 : 'inherit',
                    width: isMobile && !expanded ? 0 : 'inherit',
                },
            }}
        />
    );
};

export default GlobalSearch;