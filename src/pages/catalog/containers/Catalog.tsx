import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography } from '@mui/material';
import { fetchCategories } from '../actions/catalogActions';
import CategoryDropdown from '../components/CategoryDropdown';
import { RootState } from "app/reducers";

const Catalog: React.FC = () => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state: RootState) => state.catalog);

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
        </Container>
    );
};

export default Catalog;