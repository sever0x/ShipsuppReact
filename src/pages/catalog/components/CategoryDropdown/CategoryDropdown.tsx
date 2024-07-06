import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemText, ListItemIcon, Collapse } from '@mui/material';
import { ExpandMore, ChevronRight } from '@mui/icons-material';
import { useDispatch } from "react-redux";
import { fetchGoods } from "pages/catalog/actions/catalogActions";

interface Category {
    id: string;
    title: string;
    categories?: Category[];
    index?: number;
}

interface CategoryDropdownProps {
    categories: Category[];
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories }) => {
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
        if (category.categories && category.categories.length === 1) {
            selectedId = category.categories[0].id;
        } else {
            selectedId = category.id;
        }
        dispatch(fetchGoods(selectedId) as any);
        handleClose();
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
                        <Collapse in={!!openCategories[category.id]} timeout="auto" unmountOnExit>
                            {renderCategories(category.categories, depth + 1)}
                        </Collapse>
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <>
            <Button
                onClick={handleClick}
                endIcon={<ExpandMore />}
            >
                Categories
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {renderCategories(categories)}
            </Menu>
        </>
    );
};

export default CategoryDropdown;