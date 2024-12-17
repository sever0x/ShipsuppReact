import React, {useCallback, useEffect, useState} from 'react';
import {
    Box,
    Button,
    Grid,
    IconButton,
    InputAdornment,
    Modal,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import {ExpandMore} from '@mui/icons-material';
import {Good} from '../../types/Good';
import CategorySelector from "pages/catalog/components/CategorySelector";
import {useDropzone} from "react-dropzone";
import ShareButton from 'components/ShareButton/ShareButton';
import TextDisplay from 'components/TextDisplay/TextDisplay';

interface Category {
    id: string;
    title: string;
    categories?: Category[];
    index?: number;
}

interface EditGoodModalProps {
    open: boolean;
    onClose: () => void;
    good: Good;
    onSave: (updatedGood: Good, newImages: File[], deletedImageKeys: string[]) => void;
    categories: Category[];
    readOnly?: boolean;
    isSharedView?: boolean;
}

interface Errors {
    [key: string]: string;
}

const EditGoodModal: React.FC<EditGoodModalProps> = ({ open, onClose, good, onSave, categories, readOnly = false, isSharedView=false }) => {
    const [editedGood, setEditedGood] = useState<Good>(good);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImageKeys, setDeletedImageKeys] = useState<string[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>(good.categoryId || 'Select category');
    const [errors, setErrors] = useState<Errors>({});

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    const totalImageCount = Object.keys(editedGood.images || {}).length - deletedImageKeys.length + newImages.length;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (readOnly) return;
        const { name, value } = e.target;
        setEditedGood(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = (): boolean => {
        if (readOnly) return true;
        const newErrors: Errors = {};
        if (!editedGood.categoryId) newErrors.category = 'Category is required';
        if (!editedGood.article.trim()) newErrors.article = 'Article is required';
        if (!editedGood.title.trim()) newErrors.title = 'Title is required';
        if (editedGood.price <= 0) newErrors.price = 'Price must be greater than 0';
        if (!editedGood.brand.trim()) newErrors.brand = 'Brand is required';
        if (!editedGood.description.trim()) newErrors.description = 'Description is required';
        if (totalImageCount === 0) newErrors.images = 'At least one image is required';
        if (totalImageCount > 5) newErrors.images = 'Maximum 5 images allowed';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleClose = () => {
        if (isSharedView) {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/catalog';
            }
        } else {
            onClose();
        }
    };

    const handleSave = () => {
        if (readOnly) return;
        if (validateForm()) {
            onSave(editedGood, newImages, deletedImageKeys);
            onClose();
        }
    };

    const handleImageUpload = (files: File[]) => {
        if (readOnly) return;
        const remainingSlots = 5 - totalImageCount;
        const filesToUpload = files.slice(0, remainingSlots);
        setNewImages(prev => [...prev, ...filesToUpload]);
        setErrors(prev => ({ ...prev, images: '' }));
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (readOnly) return;
        handleImageUpload(acceptedFiles);
    }, [totalImageCount, readOnly]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 5 - totalImageCount,
        disabled: readOnly || totalImageCount >= 5,
    });

    const handleRemoveNewImage = (index: number) => {
        if (readOnly) return;
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (key: string) => {
        if (readOnly) return;
        setDeletedImageKeys(prev => [...prev, key]);
    };

    const handleUndoRemoveExistingImage = (key: string) => {
        if (readOnly) return;
        setDeletedImageKeys(prev => prev.filter(k => k !== key));
    };

    const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
        if (readOnly) return;
        setAnchorEl(event.currentTarget);
    };

    const handleCategoryClose = () => {
        if (readOnly) return;
        setAnchorEl(null);
    };

    const handleCategorySelect = (categoryId: string, categoryTitle: string) => {
        if (readOnly) return;
        setEditedGood(prev => ({ ...prev, categoryId: categoryId }));
        setSelectedCategory(categoryTitle);
        handleCategoryClose();
        setErrors(prev => ({ ...prev, category: '' }));
    };

    useEffect(() => {
        if (totalImageCount > 5) {
            setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' }));
        } else {
            setErrors(prev => ({ ...prev, images: '' }));
        }
    }, [totalImageCount]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '95%', sm: '80%', md: 800 },
                maxWidth: '100%',
                bgcolor: 'white',
                boxShadow: 24,
                p: { xs: 2, sm: 3, md: 4 },
                maxHeight: '90vh',
                overflowY: 'auto',
            }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    {readOnly ? 'View Good' : 'Edit Good'}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        {readOnly ? (
                            <>
                                <TextDisplay label="Category" value={selectedCategory} />
                                <TextDisplay label="Article" value={editedGood.article} />
                                <TextDisplay label="Title" value={editedGood.title} />
                                <TextDisplay label="Price in USD" value={editedGood.price} />
                                <TextDisplay label="Brand" value={editedGood.brand} />
                                <TextDisplay label="Color" value={editedGood.color} />
                                <TextDisplay label="Description" value={editedGood.description} />
                            </>
                        ) : (
                            <>
                                <Box
                                    onClick={handleCategoryClick}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        border: errors.category ? '1px solid red' : '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: '8px 12px',
                                        mb: 2,
                                    }}
                                    justifyContent='space-between'
                                >
                                    <Typography color={errors.category ? 'error' : 'inherit'}>
                                        {selectedCategory}
                                    </Typography>
                                    <ExpandMore sx={{ ml: 1 }} />
                                </Box>
                                {errors.category && (
                                    <Typography color="error">{errors.category}</Typography>
                                )}
                                <CategorySelector
                                    categories={categories}
                                    onCategorySelect={handleCategorySelect}
                                    anchorEl={anchorEl}
                                    onClose={handleCategoryClose}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="article"
                                    label="Article"
                                    value={editedGood.article || ''}
                                    onChange={handleChange}
                                    error={!!errors.article}
                                    helperText={errors.article}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="title"
                                    label="Title"
                                    value={editedGood.title}
                                    onChange={handleChange}
                                    inputProps={{ maxLength: 100 }}
                                    error={!!errors.title}
                                    helperText={errors.title || `${editedGood.title.length}/100`}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="price"
                                    label="Price in USD"
                                    type="number"
                                    value={editedGood.price}
                                    onChange={handleChange}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">$</InputAdornment>,
                                    }}
                                    error={!!errors.price}
                                    helperText={errors.price}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="brand"
                                    label="Brand"
                                    value={editedGood.brand}
                                    onChange={handleChange}
                                    error={!!errors.brand}
                                    helperText={errors.brand}
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="color"
                                    label="Color"
                                    value={editedGood.color || ''}
                                    onChange={handleChange}
                                />
                            </>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {readOnly ? (
                            <>
                                <TextDisplay label="Description" value={editedGood.description} />
                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                    Images
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    {Object.entries(editedGood.images || {}).map(([key, url]) => (
                                        <Grid item key={key} xs={4}>
                                            <Box position="relative">
                                                <img
                                                    src={url}
                                                    alt="Product"
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        ) : (
                            <>
                                <TextField
                                    fullWidth
                                    name="description"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    value={editedGood.description}
                                    onChange={handleChange}
                                    inputProps={{ maxLength: 400 }}
                                    error={!!errors.description}
                                    helperText={errors.description || `${editedGood.description.length}/400`}
                                />
                                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                    Manage images
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    max 5 images
                                </Typography>
                                <Box
                                    {...getRootProps()}
                                    sx={{
                                        border: errors.images ? '2px dashed red' : '2px dashed #ccc',
                                        borderRadius: 2,
                                        p: 2,
                                        minHeight: { xs: 100, sm: 150, md: 200 },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: totalImageCount >= 5 ? 'not-allowed' : 'pointer',
                                        bgcolor: isDragActive ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                                        opacity: totalImageCount >= 5 ? 0.5 : 1,
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="body1" align="center">
                                        {isDragActive
                                            ? "Drop the images here"
                                            : totalImageCount >= 5
                                                ? "Maximum number of images reached"
                                                : "Drag 'n' drop some images here, or click to select images"
                                        }
                                    </Typography>
                                    <Typography variant="caption" align="center" color="text.secondary">
                                        {`${totalImageCount}/5 images uploaded`}
                                    </Typography>
                                </Box>
                                {errors.images && <Typography color="error">{errors.images}</Typography>}
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    {Object.entries(editedGood.images || {}).map(([key, url]) => (
                                        <Grid item key={key} xs={4}>
                                            <Box position="relative">
                                                <img
                                                    src={url}
                                                    alt="Product"
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        opacity: deletedImageKeys.includes(key) ? 0.5 : 1,
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        bgcolor: 'background.paper'
                                                    }}
                                                    onClick={() => deletedImageKeys.includes(key)
                                                        ? handleUndoRemoveExistingImage(key)
                                                        : handleRemoveExistingImage(key)}
                                                >
                                                    {deletedImageKeys.includes(key) ? 'Undo' : <DeleteIcon />}
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                    {newImages.map((file, index) => (
                                        <Grid item key={index} xs={4}>
                                            <Box position="relative">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="New product"
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        bgcolor: 'background.paper'
                                                    }}
                                                    onClick={() => handleRemoveNewImage(index)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <ShareButton
                        type="product"
                        id={editedGood.id}
                    />
                    {!readOnly && (
                        <Button onClick={handleSave} variant="contained">
                            Save
                        </Button>
                    )}
                    <Button onClick={handleClose}>
                        {readOnly ? 'Close' : 'Cancel'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditGoodModal;