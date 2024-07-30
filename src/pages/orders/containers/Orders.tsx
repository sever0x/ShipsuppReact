import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Box,
    Chip,
    Container,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {fetchOrderDetails, fetchSellerOrders} from '../actions/orderActions';
import {RootState} from 'app/reducers';
import EditOrderModal from '../components/EditOrderModal';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "../../../components/IconButton";
import {Order} from "pages/orders/types/Order";

const statusColors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
    'APPROVE_BY_BUYER': 'info',
    'APPROVE_BY_SELLER': 'primary',
    'SENT': 'secondary',
    'DELIVERED': 'warning',
    'COMPLETED': 'success',
    'CANCEL_BY_SELLER': 'error'
};

const statusMessages: { [key: string]: string } = {
    'APPROVE_BY_BUYER': 'Order created',
    'APPROVE_BY_SELLER': 'Order approved',
    'SENT': 'Sent',
    'ARRIVED': 'Delivered',
    'COMPLETED': 'Completed',
    'CANCEL_BY_SELLER': 'Cancelled by seller'
};

const Orders: React.FC = () => {
    const dispatch = useDispatch();
    const { loadingOrders, data: orders, error } = useSelector((state: RootState) => state.orders);
    const user = useSelector((state: RootState) => state.userAuth.user);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchSellerOrders(user.uid) as any);
        }
    }, [dispatch, user]);

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        dispatch(fetchOrderDetails(order.id) as any);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const filteredOrders = orders.filter((order: any) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderSkeleton = () => (
        <TableRow>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="rectangular" width={80} height={30} /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
        </TableRow>
    );

    const renderTable = () => {
        if (loadingOrders) {
            return (
                <TableContainer component={props => <Paper {...props} variant="outlined" sx={{ backgroundColor: 'transparent' }} />}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Order number</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price per one</TableCell>
                                <TableCell>Total price</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from(new Array(5)).map((_, index) => renderSkeleton())}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }

        if (filteredOrders.length > 0) {
            return (
                <TableContainer component={props => <Paper {...props} variant="outlined" sx={{ backgroundColor: 'transparent' }} />}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Order number</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price per one</TableCell>
                                <TableCell>Total price</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.map((order: any) => (
                                <TableRow key={order.id}>
                                    <TableCell>{new Date(order.createTimestampGMT).toLocaleString()}</TableCell>
                                    <TableCell>{order.orderNumber}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statusMessages[order.status]}
                                            color={statusColors[order.status]}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{order.priceInOrder}</TableCell>
                                    <TableCell>{order.quantity * order.priceInOrder}</TableCell>
                                    <TableCell>{order.currencyInOrder}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEditOrder(order)}>
                                            <EditIcon />
                                        </IconButton>
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
                    You don't have any orders yet.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Orders will appear here once customers start purchasing your goods.
                </Typography>
            </Box>
        );
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ flex: 1 }}>Your Orders</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 2 }}>
                    <TextField
                        placeholder="Search for orders..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon color="action" />,
                        }}
                        sx={{ flex: 1 }}
                    />
                </Box>
            </Box>
            {renderTable()}
            {selectedOrder && (
                <EditOrderModal
                    open={!!selectedOrder}
                    onClose={handleCloseModal}
                    order={selectedOrder}
                />
            )}
        </Container>
    );
};

export default Orders;