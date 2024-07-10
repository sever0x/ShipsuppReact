import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchGoods, updateGood, deleteGood, addGood } from '../actions/catalogActions';
import CategoryDropdown from '../components/CategoryDropdown';
import EditGoodModal from '../components/EditGoodModal';
import AddGoodModal from '../components/AddGoodModal';
import { RootState } from "app/reducers";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Good } from '../types/Good';

const Catalog: React.FC = () => {
    const dispatch = useDispatch();
    const { categories, goods, loading, error } = useSelector((state: RootState) => state.catalog);
    const [editingGood, setEditingGood] = useState<Good | null>(null);
    const [deletingGood, setDeletingGood] = useState<Good | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories() as any);
    }, [dispatch]);

    const handleCategorySelect = (categoryId: string) => {
        dispatch(fetchGoods(categoryId) as any);
    };

    const handleEditClick = (good: Good) => {
        setEditingGood(good);
    };

    const handleDeleteClick = (good: Good) => {
        setDeletingGood(good);
    };

    const handleCloseModal = () => {
        setEditingGood(null);
    };

    const handleCloseDeleteDialog = () => {
        setDeletingGood(null);
    };

    const handleConfirmDelete = () => {
        if (deletingGood) {
            dispatch(deleteGood(deletingGood) as any);
            setDeletingGood(null);
        }
    };

    const handleSaveGood = (updatedGood: Good, newImages: File[], deletedImageKeys: string[]) => {
        dispatch(updateGood(updatedGood, newImages, deletedImageKeys) as any);
    };

    const handleAddGood = (newGood: Omit<Good, 'id'>, newImages: File[]) => {
        dispatch(addGood(newGood, newImages) as any);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Catalog</Typography>
            <CategoryDropdown categories={categories} onCategorySelect={handleCategorySelect} />
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setIsAddModalOpen(true)}
                style={{ marginTop: '20px' }}
            >
                Add New Good
            </Button>
            {goods.length > 0 && (
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {goods.map((good: Good) => (
                                <TableRow key={good.id}>
                                    <TableCell>
                                        {good.images && Object.values(good.images)[0] && (
                                            <img
                                                src={Object.values(good.images)[0]}
                                                alt={good.title}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{good.title}</TableCell>
                                    <TableCell>{good.brand}</TableCell>
                                    <TableCell>{`${good.price} ${good.currency}`}</TableCell>
                                    <TableCell>{good.description}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditClick(good)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(good)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {editingGood && (
                <EditGoodModal
                    open={!!editingGood}
                    onClose={handleCloseModal}
                    good={editingGood}
                    onSave={handleSaveGood}
                />
            )}
            <AddGoodModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddGood}
                categories={categories}
            />
            <Dialog
                open={!!deletingGood}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Catalog;