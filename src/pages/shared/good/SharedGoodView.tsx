import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Typography, Skeleton } from '@mui/material';
import { BACKEND_SERVICE } from "../../../constants/api";
import {Good} from "pages/catalog/types/Good";
import EditGoodModal from 'pages/catalog/components/EditGoodModal';

const SharedGoodView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState<Good | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const productId = searchParams.get('product');
            if (!productId) {
                setError('No product ID provided');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${BACKEND_SERVICE}/getGoodDetails`, {
                    params: { goodId: productId }
                });

                if (response.data.error === null && response.data.message === 'success') {
                    setProduct(response.data.data);
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [searchParams]);

    if (loading) {
        return (
            <Container maxWidth="xl">
                <Box sx={{ mt: 4 }}>
                    <Skeleton variant="rectangular" height={300} />
                    <Skeleton variant="text" height={60} />
                    <Skeleton variant="text" height={40} />
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
                </Box>
            </Container>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <Container maxWidth="xl">
            <EditGoodModal
                open={true}
                onClose={() => {}}
                good={product}
                onSave={() => {}}
                categories={[]}
                readOnly={true}
            />
        </Container>
    );
};

export default SharedGoodView;