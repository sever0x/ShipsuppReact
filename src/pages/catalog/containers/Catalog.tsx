import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchGoods, updateGood } from '../actions/catalogActions';
import CategoryDropdown from '../components/CategoryDropdown';
import EditGoodModal from '../components/EditGoodModal';
import { RootState } from "app/reducers";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Good } from '../types/Good';

const Catalog: React.FC = () => {
    const dispatch = useDispatch();
    const { categories, goods, loading, error } = useSelector((state: RootState) => state.catalog);
    const [editingGood, setEditingGood] = useState<Good | null>(null);

    useEffect(() => {
        dispatch(fetchCategories() as any);
    }, [dispatch]);

    const handleCategorySelect = (categoryId: string) => {
        dispatch(fetchGoods(categoryId) as any);
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    const getFirstImageUrl = (images?: { [key: string]: string }): string | undefined => {
        if (!images) return undefined;
        const imageUrls = Object.values(images);
        return imageUrls.length > 0 ? imageUrls[0] : undefined;
    };

    const handleEditClick = (good: Good) => {
        setEditingGood(good);
    };

    const handleCloseModal = () => {
        setEditingGood(null);
    };

    const handleSaveGood = (updatedGood: Good, newImages: File[], deletedImageKeys: string[]) => {
        dispatch(updateGood(updatedGood, newImages, deletedImageKeys) as any);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Catalog</Typography>
            <CategoryDropdown categories={categories} onCategorySelect={handleCategorySelect} />
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
                            {goods.map((good: Good) => {
                                const imageUrl = getFirstImageUrl(good.images);
                                return (
                                    <TableRow key={good.id}>
                                        <TableCell>
                                            {imageUrl && (
                                                <img
                                                    src={imageUrl}
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
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
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
        </Container>
    );
};

export default Catalog;