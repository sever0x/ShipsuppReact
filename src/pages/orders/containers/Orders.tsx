import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Box,
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
import OrderStatus from '../components/OrderStatus';
import storage from 'misc/storage';
import PortSelector from 'components/PortSelector';
import {Port} from 'misc/types/Port';
import { useSearch } from 'misc/providers/SearchProvider';

const Orders: React.FC = () => {
    const dispatch = useDispatch();
    const { searchTerm } = useSearch();
    const { loadingOrders, data: orders, error } = useSelector((state: RootState) => state.orders);
    const user = useSelector((state: RootState) => state.userAuth.user);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedPort, setSelectedPort] = useState<string | null>(null);
    const [userPorts, setUserPorts] = useState<{ [key: string]: Port }>({});

    useEffect(() => {
        const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
        if (userData.portsArray) {
            setUserPorts(userData.portsArray);
        }
    }, []);

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchSellerOrders(user.uid) as any);
        }
    }, [dispatch, user]);

    const handlePortSelect = (portId: string) => {
        setSelectedPort(portId === 'all' ? null : portId);
    };

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        dispatch(fetchOrderDetails(order.id) as any);
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const filteredOrders = orders ? orders.filter((order: Order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!selectedPort || order.portId === selectedPort)
    ) : [];

    const renderSkeleton = (index: number) => (
        <TableRow key={`skeleton-${index}`}>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="rectangular" width={40} height={40} /></TableCell>
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
                                <TableCell>Goods article</TableCell>
                                <TableCell>Goods title</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price per one</TableCell>
                                <TableCell>Total price</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from(new Array(5)).map((_, index) => renderSkeleton(index))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        }

        if (!orders || orders.length === 0) {
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
        }

        if (filteredOrders.length > 0) {
            return (
                <TableContainer component={props => <Paper {...props} variant="outlined" sx={{ backgroundColor: 'transparent' }} />}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Order number</TableCell>
                                <TableCell>Goods article</TableCell>
                                <TableCell>Goods title</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price per one</TableCell>
                                <TableCell>Total price</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredOrders.map((order: Order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{new Date(order.createTimestampGMT).toLocaleString()}</TableCell>
                                    <TableCell>{order.orderNumber}</TableCell>
                                    <TableCell>{order.good.article}</TableCell>
                                    <TableCell>{order.good.title}</TableCell>
                                    <TableCell>
                                        {order.good.images && Object.values(order.good.images)[0] && (
                                            <img
                                                src={Object.values(order.good.images)[0]}
                                                alt={order.good.title}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <OrderStatus status={order.status} size="small" />
                                    </TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{order.good.price}</TableCell>
                                    <TableCell>{order.quantity * order.good.price}</TableCell>
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
                    No orders match your search criteria.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Try adjusting your search or filter settings.
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
                    <PortSelector
                        ports={{
                            all: {
                                id: 'all',
                                title: 'All Ports',
                                city: {
                                    country: {
                                        id: 'all',
                                        title: 'All Countries'
                                    },
                                    title: 'All Cities'
                                }
                            },
                            ...userPorts
                        }}
                        selectedPorts={selectedPort ? [selectedPort] : ['all']}
                        onPortSelect={handlePortSelect}
                        multiSelect={false}
                        label="Select port"
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