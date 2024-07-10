import React, {useRef, useState} from 'react';
import { Modal, Box, TextField, Button, Typography, Grid, IconButton, Menu, MenuItem, ListItemText, ListItemIcon, Collapse } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import {Good} from '../../types/Good';
import {ChevronRight, ExpandMore} from "@mui/icons-material";

interface Category {
    id: string;
    title: string;
    categories?: Category[];
    index?: number;
}

interface AddGoodModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (newGood: Omit<Good, 'id'>, newImages: File[]) => void;
    categories: Category[];
}

const AddGoodModal: React.FC<AddGoodModalProps> = ({ open, onClose, onAdd, categories }) => {
    const [newGood, setNewGood] = useState<Omit<Good, 'id'>>({
        article: '',
        title: '',
        price: 0,
        brand: '',
        color: '',
        description: '',
        categoryId: '',
        currency: 'USD',
        ownerId: '',
        portId: '',
        createTimestampGMT: '',
        available: true,
    });
    const [newImages, setNewImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewGood(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    };

    const handleAdd = () => {
        onAdd(newGood, newImages);
        onClose();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesToUpload = Array.from(e.target.files).slice(0, 5 - newImages.length);
            setNewImages(prev => [...prev, ...filesToUpload]);
        }
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCategoryClose = () => {
        setAnchorEl(null);
    };

    const handleSubcategoryClick = (categoryId: string) => {
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
        setNewGood(prev => ({ ...prev, categoryId: selectedId }));
        setSelectedCategory(category.title);
        handleCategoryClose();
    };

    const renderCategories = (categories: Category[], depth = 0) => {
        const sortedCategories = [...categories].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

        return sortedCategories.map((category) => {
            const hasSubcategories = shouldRenderSubcategories(category);

            return (
                <React.Fragment key={category.id}>
                    <MenuItem
                        onClick={() => hasSubcategories ? handleSubcategoryClick(category.id) : handleCategorySelect(category)}
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
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                maxHeight: '90vh',
                overflowY: 'auto',
            }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Add New Good
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    name="article"
                    label="Article"
                    value={newGood.article}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="title"
                    label="Title"
                    value={newGood.title}
                    onChange={handleChange}
                    inputProps={{ maxLength: 100 }}
                    helperText={`${newGood.title.length}/100`}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="price"
                    label="Price in USD"
                    type="number"
                    value={newGood.price}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: '$',
                    }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="brand"
                    label="Brand"
                    value={newGood.brand}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="color"
                    label="Color"
                    value={newGood.color}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    value={newGood.description}
                    onChange={handleChange}
                    inputProps={{ maxLength: 400 }}
                    helperText={`${newGood.description.length}/400`}
                />
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleCategoryClick}
                    sx={{ mt: 2, mb: 2 }}
                >
                    {selectedCategory || "Select Category"}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCategoryClose}
                >
                    {renderCategories(categories)}
                </Menu>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Images
                    </Typography>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddPhotoAlternateIcon />}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={newImages.length >= 5}
                    >
                        Add Photos (max 5)
                    </Button>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {newImages.map((file, index) => (
                            <Grid item key={index} xs={4}>
                                <Box position="relative">
                                    <img src={URL.createObjectURL(file)} alt="New product" style={{ width: '100%', height: 'auto' }} />
                                    <IconButton
                                        size="small"
                                        sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                                        onClick={() => handleRemoveNewImage(index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Button onClick={handleAdd} variant="contained" sx={{ mt: 2 }}>
                    Add Good
                </Button>
            </Box>
        </Modal>
    );
};

export default AddGoodModal;