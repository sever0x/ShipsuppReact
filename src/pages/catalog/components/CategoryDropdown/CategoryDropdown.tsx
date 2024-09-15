import React, {useEffect, useState} from 'react';
import {ExpandMore} from '@mui/icons-material';
import Box from 'components/Box';
import Typography from 'components/Typography';
import CategorySelector from '../CategorySelector';

interface Category {
    id: string;
    title: string;
    categories?: Category[];
    index?: number;
}

interface CategoryDropdownProps {
    categories: Category[];
    onCategorySelect: (categoryId: string, categoryTitle: string) => void;
    selectedCategory: { id: string; title: string } | null;
    label?: string;
    containerSx?: React.CSSProperties;
    dropdownSx?: React.CSSProperties;
    typographySx?: React.CSSProperties;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
    categories,
    onCategorySelect,
    selectedCategory,
    label,
    containerSx,
    dropdownSx,
    typographySx
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [displayedCategory, setDisplayedCategory] = useState<string>(label ?? 'Select category');

    useEffect(() => {
        if (selectedCategory) {
            setDisplayedCategory(selectedCategory.title);
        } else {
            setDisplayedCategory(label ?? 'Select category');
        }
    }, [selectedCategory, label]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCategorySelect = (categoryId: string, categoryTitle: string) => {
        onCategorySelect(categoryId, categoryTitle);
        handleClose();
    };

    return (
        <Box sx={{ flex: 3, ...containerSx }}>
            <Box
                onClick={handleClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    ...dropdownSx
                }}
                justifyContent='space-between'
            >
                <Typography sx={typographySx}>{displayedCategory}</Typography>
                <ExpandMore sx={{ ml: 1 }} />
            </Box>
            <CategorySelector
                categories={categories}
                onCategorySelect={handleCategorySelect}
                anchorEl={anchorEl}
                onClose={handleClose}
            />
        </Box>
    );
};

export default CategoryDropdown;