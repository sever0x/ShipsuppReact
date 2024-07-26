import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    fetchCategories,
    fetchGoods,
    updateGood,
    deleteGood,
    addGood,
    fetchAllUserGoods
} from '../actions/catalogActions';
import CategoryDropdown from '../components/CategoryDropdown';
import EditGoodModal from '../components/EditGoodModal';
import AddGoodModal from '../components/AddGoodModal';
import {RootState} from "app/reducers";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField, CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import {Good} from '../types/Good';
import Typography from 'components/Typography';
import Box from 'components/Box';
import Button from 'components/Button';
import IconButton from 'components/IconButton';


const Catalog: React.FC = () => {
    const dispatch = useDispatch();
    const { categories, goods, loading, error } = useSelector((state: RootState) => state.catalog);
    const [editingGood, setEditingGood] = useState<Good | null>(null);
    const [deletingGood, setDeletingGood] = useState<Good | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchCategories() as any);
        dispatch(fetchAllUserGoods() as any);
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

    const filteredGoods = goods.filter(good =>
        good.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        good.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        good.article.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <CircularProgress/>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h4" sx={{ flex: 1 }}>Goods</Typography>
                <Box justifyContent='flex-end' sx={{display: 'flex', alignItems: 'center', flex: 4}}>
                    <CategoryDropdown
                        categories={categories}
                        onCategorySelect={handleCategorySelect}
                    />
                    <TextField
                        placeholder="Search for goods..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon color="action"/>,
                        }}
                        sx={{ flex: 3 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon/>}
                        onClick={() => setIsAddModalOpen(true)}
                        sx={{ ml: 2, flex: 1 }}
                    >
                        Add New Good
                    </Button>
                </Box>
            </Box>
            {filteredGoods.length > 0 && (
                <TableContainer component={
                    props =>
                        <Paper
                            {...props}
                            variant="outlined"
                            sx={{backgroundColor: 'transparent'}}
                        />
                }>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Article</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell>Color</TableCell>
                                <TableCell>Price ({goods[0]?.currency})</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGoods.map((good: Good) => (
                                <TableRow key={good.id}>
                                    <TableCell>
                                        {good.images && Object.values(good.images)[0] && (
                                            <img
                                                src={Object.values(good.images)[0]}
                                                alt={good.title}
                                                style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{good.article}</TableCell>
                                    <TableCell>{good.title}</TableCell>
                                    <TableCell>{good.brand}</TableCell>
                                    <TableCell>{good.color}</TableCell>
                                    <TableCell>{good.price}</TableCell>
                                    <TableCell>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: good.available ? '#e6f4ea' : '#fce8e6',
                                            color: good.available ? '#34a853' : '#ea4335'
                                        }}>
                                            {good.available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <IconButton onClick={() => handleEditClick(good)}>
                                                <EditIcon/>
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(good)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </div>
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
                    categories={categories}
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