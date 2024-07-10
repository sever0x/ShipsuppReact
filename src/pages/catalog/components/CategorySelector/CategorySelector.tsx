import React, { useState } from 'react';
import { Menu, MenuItem, ListItemText, ListItemIcon, Collapse } from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

interface Category {
    id: string;
    title: string;
    categories?: Category[];
    index?: number;
}

interface CategorySelectorProps {
    categories: Category[];
    onCategorySelect: (categoryId: string, categoryTitle: string) => void;
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, onCategorySelect, anchorEl, onClose }) => {
    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

    const handleCategoryClick = (categoryId: string) => {
        setOpenCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
    };

    const shouldRenderSubcategories = (category: Category): boolean => {
        return !!category.categories &&
            category.categories.length > 0 &&
            !(category.categories.length === 1 && category.categories[0].title === category.title);
    };

    const handleCategorySelect = (category: Category) => {
        let selectedId: string;
        let selectedTitle: string;
        if (category.categories && category.categories.length === 1) {
            selectedId = category.categories[0].id;
            selectedTitle = category.categories[0].title;
        } else {
            selectedId = category.id;
            selectedTitle = category.title;
        }
        onCategorySelect(selectedId, selectedTitle);
        onClose();
    };

    const renderCategories = (categories: Category[], depth = 0) => {
        const sortedCategories = [...categories].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

        return sortedCategories.map((category) => {
            const hasSubcategories = shouldRenderSubcategories(category);

            return (
                <React.Fragment key={category.id}>
                    <MenuItem
                        onClick={() => hasSubcategories ? handleCategoryClick(category.id) : handleCategorySelect(category)}
                        style={{ paddingLeft: `${depth * 16}px` }}
                    >
                        <ListItemText primary={category.title} />
                        {hasSubcategories && (
                            <ListItemIcon>
                                {openCategories[category.id] ? <ExpandMore /> : <ChevronRight />}
                            </ListItemIcon>
                        )}
                    </MenuItem>
                    {hasSubcategories && category.categories && (
                        <Collapse in={openCategories[category.id]} timeout="auto" unmountOnExit>
                            {renderCategories(category.categories, depth + 1)}
                        </Collapse>
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
        >
            {renderCategories(categories)}
        </Menu>
    );
};

export default CategorySelector;