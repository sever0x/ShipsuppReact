import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../actions/catalogActions';
import CategoryDropdown from '../components/CategoryDropdown';
import { RootState } from "app/reducers";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Catalog: React.FC = () => {
    const dispatch = useDispatch();
    const { categories, goods, loading, error } = useSelector((state: RootState) => state.catalog);

    useEffect(() => {
        dispatch(fetchCategories() as any);
    }, [dispatch]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Catalog</Typography>
            <CategoryDropdown categories={categories} />
            {goods.length > 0 && (
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {goods.map((good: any) => (
                                <TableRow key={good.id}>
                                    <TableCell>{good.title}</TableCell>
                                    <TableCell>{good.brand}</TableCell>
                                    <TableCell>{`${good.price} ${good.currency}`}</TableCell>
                                    <TableCell>{good.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default Catalog;