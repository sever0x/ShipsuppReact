import React, {useState} from 'react';
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
}

interface Category {
    id: string;
    title: string;
    categories?: Category[];
    index?: number;
}

interface CategoryDropdownProps {
    categories: Category[];
    onCategorySelect: (categoryId: string, categoryTitle: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories, onCategorySelect }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('Select category');

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCategorySelect = (categoryId: string, categoryTitle: string) => {
        setSelectedCategory(categoryTitle);
        onCategorySelect(categoryId, categoryTitle);
        handleClose();
    };

    return (
        <Box sx={{ mr: 2, flex: 3 }}>
            <Box
                onClick={handleClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px 12px',
                }}
                justifyContent='space-between'
            >
                <Typography>{selectedCategory}</Typography>
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