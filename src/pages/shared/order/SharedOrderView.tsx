import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Typography, Skeleton } from '@mui/material';
import { BACKEND_SERVICE } from "../../../constants/api";
import { getIdToken } from 'firebase/auth';
import { auth } from 'app/config/firebaseConfig';
import {Order} from "pages/orders/types/Order";
import EditOrderModal from 'pages/orders/components/EditOrderModal';

const SharedOrderView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            const orderId = searchParams.get('order');
            const orderNumber = searchParams.get('orderNumber');

            if (!orderId && !orderNumber) {
                setError('No order identifier provided');
                setLoading(false);
                return;
            }

            try {
                const user = auth.currentUser;
                if (!user) {
                    setError('Please sign in to view this order');
                    setLoading(false);
                    return;
                }

                const token = await getIdToken(user);
                const response = await axios.get(`${BACKEND_SERVICE}/getOrderDetails`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        userId: user.uid,
                        ...(orderId ? { orderId } : { orderNumber })
                    }
                });

                if (response.data.error === null && response.data.message === 'success') {
                    setOrder(response.data.data);
                } else {
                    setError(response.data.error || 'Permission denied');
                }
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [searchParams]);

    if (loading) {
        return (
            <Container maxWidth="xl">
                <Box sx={{ mt: 4 }}>
                    <Skeleton variant="rectangular" height={300} />
                    <Skeleton variant="text" height={60} />
                    <Skeleton variant="text" height={40} />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl">
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                }}>
                    <Typography variant="h5" color="error" gutterBottom>
                        {error}
                    </Typography>
                    {error === 'Please sign in to view this order' && (
                        <Typography variant="body1">
                            Please sign in to view order details.
                        </Typography>
                    )}
                </Box>
            </Container>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <Container maxWidth="xl">
            <EditOrderModal
                open={true}
                onClose={() => {}}
                order={order}
                readOnly={true}
            />
        </Container>
    );
};

export default SharedOrderView;