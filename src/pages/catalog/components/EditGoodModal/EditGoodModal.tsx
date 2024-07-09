import React, { useState, useRef } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { Good } from '../../types/Good';

interface EditGoodModalProps {
    open: boolean;
    onClose: () => void;
    good: Good;
    onSave: (updatedGood: Good, newImages: File[], deletedImageKeys: string[]) => void;
}

const EditGoodModal: React.FC<EditGoodModalProps> = ({ open, onClose, good, onSave }) => {
    const [editedGood, setEditedGood] = useState<Good>(good);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImageKeys, setDeletedImageKeys] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedGood(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    };

    const handleSave = () => {
        onSave(editedGood, newImages, deletedImageKeys);
        onClose();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesToUpload = Array.from(e.target.files).slice(0, 5 - Object.keys(editedGood.images || {}).length + deletedImageKeys.length - newImages.length);
            setNewImages(prev => [...prev, ...filesToUpload]);
        }
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (key: string) => {
        setDeletedImageKeys(prev => [...prev, key]);
    };

    const handleUndoRemoveExistingImage = (key: string) => {
        setDeletedImageKeys(prev => prev.filter(k => k !== key));
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
                    Edit Good
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    name="article"
                    label="Article"
                    value={editedGood.article || ''}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="title"
                    label="Title"
                    value={editedGood.title}
                    onChange={handleChange}
                    inputProps={{ maxLength: 100 }}
                    helperText={`${editedGood.title.length}/100`}
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
                        startAdornment: '$',
                    }}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="brand"
                    label="Brand"
                    value={editedGood.brand}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="color"
                    label="Color"
                    value={editedGood.color || ''}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    value={editedGood.description}
                    onChange={handleChange}
                    inputProps={{ maxLength: 400 }}
                    helperText={`${editedGood.description.length}/400`}
                />
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
                        disabled={Object.keys(editedGood.images || {}).length - deletedImageKeys.length + newImages.length >= 5}
                    >
                        Add Photos (max 5)
                    </Button>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {Object.entries(editedGood.images || {}).map(([key, url]) => (
                            <Grid item key={key} xs={4}>
                                <Box position="relative">
                                    <img src={url} alt="Product" style={{ width: '100%', height: 'auto', opacity: deletedImageKeys.includes(key) ? 0.5 : 1 }} />
                                    <IconButton
                                        size="small"
                                        sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                                        onClick={() => deletedImageKeys.includes(key) ? handleUndoRemoveExistingImage(key) : handleRemoveExistingImage(key)}
                                    >
                                        {deletedImageKeys.includes(key) ? 'Undo' : <DeleteIcon />}
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
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
                <Button onClick={handleSave} variant="contained" sx={{ mt: 2 }}>
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

export default EditGoodModal;