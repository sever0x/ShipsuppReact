import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, Typography, Container
} from '@mui/material';
import { fetchSellerOrders } from '../actions/orderActions';
import { RootState } from 'app/reducers';

const Orders: React.FC = () => {
    const dispatch = useDispatch();
    const { loading, data: orders, error } = useSelector((state: RootState) => state.orders);
    const user = useSelector((state: RootState) => state.userAuth.user);

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchSellerOrders(user.uid) as any);
        }
    }, [dispatch, user]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Your Orders</Typography>
            <TableContainer component={Paper}>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order: any) => (
                            <TableRow key={order.id}>
                                <TableCell>{new Date(order.createTimestampGMT).toLocaleString()}</TableCell>
                                <TableCell>{order.orderNumber}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>{order.priceInOrder}</TableCell>
                                <TableCell>{order.quantity * order.priceInOrder}</TableCell>
                                <TableCell>{order.currencyInOrder}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Orders;