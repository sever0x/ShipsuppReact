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
import {Good} from '../../types/Good';
import CategorySelector from "pages/catalog/components/CategorySelector";
import {useDropzone} from "react-dropzone";
import {Close, ExpandMore} from '@mui/icons-material';
import {useAppDispatch} from "misc/hooks/useAppDispatch";
import {addGood} from "pages/catalog/actions/catalogActions";
import storage from "misc/storage";
import PortSelector from 'components/PortSelector';

interface Category {
    id: string;
    title: string;
    categories?: Category[];
    index?: number;
}

interface AddGoodModalProps {
    open: boolean;
    onClose: () => void;
    categories: Category[];
}

interface Errors {
    [key: string]: string;
}

const initialGoodState: Omit<Good, 'id'> = {
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
};

const AddGoodModal: React.FC<AddGoodModalProps> = ({ open, onClose, categories }) => {
    const dispatch = useAppDispatch();
    const [newGood, setNewGood] = useState<Omit<Good, 'id'>>(initialGoodState);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('Select category');
    const [errors, setErrors] = useState<Errors>({});
    const [userPorts, setUserPorts] = useState<{ [key: string]: any }>({});

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open]);

    useEffect(() => {
        const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
        if (userData.ports) {
            setUserPorts(userData.ports);
        }
    }, []);

    const resetForm = () => {
        setNewGood(initialGoodState);
        setNewImages([]);
        setSelectedCategory('Select category');
        setErrors({});
        setAnchorEl(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewGood(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = (): boolean => {
        const newErrors: Errors = {};
        if (!newGood.categoryId) newErrors.category = 'Category is required';
        if (!newGood.portId) newErrors.port = 'Port is required';
        if (!newGood.article.trim()) newErrors.article = 'Article is required';
        if (!newGood.title.trim()) newErrors.title = 'Title is required';
        if (newGood.price <= 0) newErrors.price = 'Price must be greater than 0';
        if (!newGood.brand.trim()) newErrors.brand = 'Brand is required';
        if (!newGood.description.trim()) newErrors.description = 'Description is required';
        if (newImages.length === 0) newErrors.images = 'At least one image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdd = async () => {
        if (validateForm()) {
            const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
            const goodWithOwnerId = {
                ...newGood,
                ownerId: userData.id,
                createTimestampGMT: new Date().toISOString(),
            };
            try {
                await dispatch(addGood(goodWithOwnerId, newImages) as any);
                resetForm();
                onClose();
            } catch (error) {
                console.error('Failed to add good:', error);
            }
        }
    };

    const handleImageUpload = (files: File[]) => {
        const remainingSlots = 5 - newImages.length;
        const filesToUpload = files.slice(0, remainingSlots);
        setNewImages(prev => [...prev, ...filesToUpload]);
        setErrors(prev => ({ ...prev, images: '' }));
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        handleImageUpload(acceptedFiles);
    }, [newImages]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 5 - newImages.length,
    });

    const handleRemoveNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCategoryClose = () => {
        setAnchorEl(null);
    };

    const handleCategorySelect = (categoryId: string, categoryTitle: string) => {
        setNewGood(prev => ({ ...prev, categoryId: categoryId }));
        setSelectedCategory(categoryTitle);
        handleCategoryClose();
        setErrors(prev => ({ ...prev, category: '' }));
    };

    const handlePortSelect = (portId: string) => {
        setNewGood(prev => ({ ...prev, portId: portId }));
        setErrors(prev => ({ ...prev, port: '' }));
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

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
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
                <Typography variant="h6" component="h2" gutterBottom>
                    Add New Item
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
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
                            <Typography color={errors.category ? 'error' : 'inherit'}>{selectedCategory}</Typography>
                            <ExpandMore sx={{ ml: 1 }} />
                        </Box>
                        {errors.category && <Typography color="error">{errors.category}</Typography>}
                        <CategorySelector
                            categories={categories}
                            onCategorySelect={handleCategorySelect}
                            anchorEl={anchorEl}
                            onClose={handleCategoryClose}
                        />
                        <Box sx={{ mb: 2 }}>
                            <PortSelector
                                ports={userPorts}
                                selectedPorts={newGood.portId ? [newGood.portId] : []}
                                onPortSelect={handlePortSelect}
                                multiSelect={false}
                                label="Select port"
                                containerSx={{
                                    border: errors.port ? '1px solid red' : '1px solid #ccc',
                                }}
                            />
                            {errors.port && <Typography color="error">{errors.port}</Typography>}
                        </Box>
                        <TextField
                            fullWidth
                            margin="normal"
                            name="article"
                            label="Article"
                            value={newGood.article}
                            onChange={handleChange}
                            error={!!errors.article}
                            helperText={errors.article}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            name="title"
                            label="Title"
                            value={newGood.title}
                            onChange={handleChange}
                            inputProps={{ maxLength: 100 }}
                            error={!!errors.title}
                            helperText={errors.title || `${newGood.title.length}/100`}
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
                            value={newGood.brand}
                            onChange={handleChange}
                            error={!!errors.brand}
                            helperText={errors.brand}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            name="color"
                            label="Color"
                            value={newGood.color}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            name="description"
                            label="Description"
                            multiline
                            rows={4}
                            value={newGood.description}
                            onChange={handleChange}
                            inputProps={{ maxLength: 400 }}
                            error={!!errors.description}
                            helperText={errors.description || `${newGood.description.length}/400`}
                        />
                        <Typography variant="subtitle1" gutterBottom>
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
                                cursor: 'pointer',
                                bgcolor: isDragActive ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                            }}
                        >
                            <input {...getInputProps()} />
                            <AddPhotoAlternateIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="body1" align="center">
                                {isDragActive
                                    ? "Drop the images here"
                                    : "Drag 'n' drop some images here, or click to select images"}
                            </Typography>
                            <Typography variant="caption" align="center" color="text.secondary">
                                {`${newImages.length}/5 images uploaded`}
                            </Typography>
                        </Box>
                        {errors.images && <Typography color="error">{errors.images}</Typography>}
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {newImages.map((file, index) => (
                                <Grid item key={index} xs={4} sm={3} md={4}>
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
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleClose} sx={{ mr: 1 }}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} variant="contained" color="primary">
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddGoodModal;