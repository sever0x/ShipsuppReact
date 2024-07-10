import React, { useState } from 'react';
import { Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import CategorySelector from "pages/catalog/components/CategorySelector";

interface Category {
    id: string;
    title: string;
    categories?: Category[];
    index?: number;
}

interface CategoryDropdownProps {
    categories: Category[];
    onCategorySelect: (categoryId: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories, onCategorySelect }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('Categories');

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCategorySelect = (categoryId: string, categoryTitle: string) => {
        setSelectedCategory(categoryTitle);
        onCategorySelect(categoryId);
    };

    return (
        <>
            <Button
                onClick={handleClick}
                endIcon={<ExpandMore />}
            >
                {selectedCategory}
            </Button>
            <CategorySelector
                categories={categories}
                onCategorySelect={handleCategorySelect}
                anchorEl={anchorEl}
                onClose={handleClose}
            />
        </>
    );
};

export default CategoryDropdown;