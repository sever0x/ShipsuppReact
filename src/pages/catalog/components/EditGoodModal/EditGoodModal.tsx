import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import { Good } from '../../types/Good';

interface EditGoodModalProps {
    open: boolean;
    onClose: () => void;
    good: Good;
    onSave: (updatedGood: Good) => void;
}

const EditGoodModal: React.FC<EditGoodModalProps> = ({ open, onClose, good, onSave }) => {
    const [editedGood, setEditedGood] = useState<Good>(good);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedGood(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(editedGood);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <TextField
                    fullWidth
                    margin="normal"
                    name="title"
                    label="Title"
                    value={editedGood.title}
                    onChange={handleChange}
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
                    name="price"
                    label="Price"
                    type="number"
                    value={editedGood.price}
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
                />
                <Button onClick={handleSave} variant="contained" sx={{ mt: 2 }}>
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

export default EditGoodModal;