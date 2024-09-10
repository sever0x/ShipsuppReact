import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addGood, deleteGood, fetchCategories, fetchGoods, updateGood} from '../actions/catalogActions';
import CategoryDropdown from '../components/CategoryDropdown';
import EditGoodModal from '../components/EditGoodModal';
import AddGoodModal from '../components/AddGoodModal';
import {RootState} from "app/reducers";
import {
    Checkbox,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
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
import storage from 'misc/storage';
import PortSelector from 'components/PortSelector';

const Catalog: React.FC = () => {
    const dispatch = useDispatch();
    const { categories, goods, loading, error } = useSelector((state: RootState) => state.catalog);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [editingGood, setEditingGood] = useState<Good | null>(null);
    const [deletingGood, setDeletingGood] = useState<Good | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<{ id: string; title: string } | null>(null);
    const [selectedPort, setSelectedPort] = useState<string | null>(null);
    const [selectedGoods, setSelectedGoods] = useState<Good[]>([]);
    const [userPorts, setUserPorts] = useState<{ [key: string]: any }>({});
    const [isLoadingPort, setIsLoadingPort] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await dispatch(fetchCategories() as any);
            let portId = null;
            while (portId === null) {
                const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
                if (userData.portsArray && userData.portsArray.length > 0) {
                    setUserPorts(userData.portsArray);
                    portId = userData.portsArray[0].id;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            setSelectedPort(portId);
            setIsLoadingPort(false);
            await dispatch(fetchGoods(undefined, portId) as any);
            setIsInitialLoad(false);
        };

        loadData();
    }, [dispatch]);

    useEffect(() => {
        if (!loading && isInitialLoad) {
            setIsInitialLoad(false);
        }
    }, [loading, isInitialLoad]);

    const handleSelectGood = (good: Good) => {
        setSelectedGoods(prev => [...prev, good]);
    };

    const handleDeselectGood = (goodId: string) => {
        setSelectedGoods(prev => prev.filter(g => g.id !== goodId));
    };

    const handleCategorySelect = (categoryId: string, categoryTitle: string) => {
        setSelectedCategory({ id: categoryId, title: categoryTitle });
        dispatch(fetchGoods(categoryId, selectedPort) as any);
    };

    const handlePortSelect = (portId: string) => {
        setSelectedPort(portId);
        dispatch(fetchGoods(selectedCategory?.id, portId) as any);
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

    const handleBulkDelete = () => {
        selectedGoods.forEach(good => dispatch(deleteGood(good) as any));
        setSelectedGoods([]);
    };

    const handleBulkMoveToCategory = (categoryId: string, categoryTitle: string) => {
        selectedGoods.forEach(good => {
            const updatedGood = { ...good, categoryId };
            dispatch(updateGood(updatedGood, [], []) as any);
        });
        setSelectedGoods([]);
    };

    const filteredGoods = goods.filter(good =>
        good.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        good.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        good.article.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderSkeleton = () => (
        <TableRow key={`skeleton-${Math.random()}`}>
            <TableCell><Skeleton variant="rectangular" width={16} height={16} /></TableCell>
            <TableCell><Skeleton variant="rectangular" width={50} height={50} /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
        </TableRow>
    );

    const renderTable = () => {
        if (isInitialLoad || loading || isLoadingPort) {
            return (
                <TableContainer component={props => <Paper {...props} variant="outlined" sx={{ backgroundColor: 'transparent' }} />}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Article</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell>Color</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from(new Array(5)).map((_, index) => (
                                <React.Fragment key={`skeleton-row-${index}`}>
                                    {renderSkeleton()}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }

        if (filteredGoods.length > 0) {
            return (
                <TableContainer component={props => <Paper {...props} variant="outlined" sx={{ backgroundColor: 'transparent' }} />}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selectedGoods.length > 0 && selectedGoods.length < filteredGoods.length}
                                        checked={filteredGoods.length > 0 && selectedGoods.length === filteredGoods.length}
                                        onChange={(_, checked) => {
                                            if (checked) {
                                                setSelectedGoods(filteredGoods);
                                            } else {
                                                setSelectedGoods([]);
                                            }
                                        }}
                                    />
                                </TableCell>
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
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedGoods.some(g => g.id === good.id)}
                                            onChange={() =>
                                                selectedGoods.some(g => g.id === good.id)
                                                    ? handleDeselectGood(good.id)
                                                    : handleSelectGood(good)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {good.images && Object.values(good.images)[0] && (
                                            <img
                                                src={Object.values(good.images)[0]}
                                                alt={good.title}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
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
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(good)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }

        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
                textAlign: 'center'
            }}>
                <Typography variant="h6" gutterBottom>
                    No goods available in this port
                </Typography>
                <Typography variant="body1" gutterBottom>
                    There are currently no items in your catalog for the selected port.
                </Typography>
                <Typography variant="body2" gutterBottom>
                    Click the "Add New Item" button to start adding products to this port.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddModalOpen(true)}
                    sx={{ mt: 2 }}
                >
                    Add New Item
                </Button>
            </Box>
        );
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="xl">
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                }}
            >
                <Typography variant="h4" sx={{ flex: 1 }}>
                    Catalog
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: 4,
                    }}
                >
                    {selectedGoods.length > 0 ? (
                        <>
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                {selectedGoods.length} item{selectedGoods.length !== 1 ? 's' : ''} selected
                            </Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleBulkDelete}
                                sx={{ mr: 2 }}
                            >
                                Delete Selected
                            </Button>
                            <CategoryDropdown
                                categories={categories}
                                onCategorySelect={(categoryId, categoryTitle) => handleBulkMoveToCategory(categoryId, categoryTitle)}
                                selectedCategory={null}
                                label="Move to Category"
                            />
                        </>
                    ) : (
                        <>
                            <PortSelector
                                ports={userPorts}
                                selectedPorts={selectedPort ? [selectedPort] : []}
                                onPortSelect={handlePortSelect}
                                multiSelect={false}
                                label="Select port"
                            />
                            <CategoryDropdown
                                categories={categories}
                                onCategorySelect={handleCategorySelect}
                                selectedCategory={selectedCategory}
                                label="Select category"
                            />
                            <TextField
                                placeholder="Search for goods..."
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon color="action" />,
                                }}
                                sx={{ flex: 3, mx: 2 }}
                            />
                        </>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setIsAddModalOpen(true)}
                        sx={{ ml: 2, flex: 1 }}
                    >
                        Add New Item
                    </Button>
                </Box>
            </Box>
            {renderTable()}
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
                PaperProps={{
                    style: {
                        backgroundColor: 'white',
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">{"Confirm deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this item?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} variant="outlined" color="error">Cancel</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Catalog;
