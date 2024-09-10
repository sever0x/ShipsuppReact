import React, {useState} from 'react';
import {Collapse, ListItemIcon, ListItemText} from '@mui/material';
import {ChevronRight, ExpandMore} from '@mui/icons-material';
import MenuItem from 'components/MenuItem';
import Menu from 'components/Menu';

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

    const renderCategories = (categories: Category[], depth = 1) => {
        const sortedCategories = [...categories].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

        return sortedCategories.flatMap((category) => {
            const hasSubcategories = shouldRenderSubcategories(category);

            const items = [
                <MenuItem
                    key={category.id}
                    onClick={() => hasSubcategories ? handleCategoryClick(category.id) : handleCategorySelect(category)}
                    sx={{
                        paddingLeft: `${depth * 16}px`,
                    }}
                >
                    <ListItemText primary={category.title} />
                    {hasSubcategories && (
                        <ListItemIcon>
                            {openCategories[category.id] ? <ExpandMore /> : <ChevronRight />}
                        </ListItemIcon>
                    )}
                </MenuItem>
            ];

            if (hasSubcategories && category.categories) {
                items.push(
                    <Collapse key={`collapse-${category.id}`} in={openCategories[category.id]} timeout="auto" unmountOnExit>
                        {renderCategories(category.categories, depth + 1)}
                    </Collapse>
                );
            }

            return items;
        });
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        width: '24%',
                    },
                }
            }}
        >
            {renderCategories(categories)}
        </Menu>
    );
};

export default CategorySelector;