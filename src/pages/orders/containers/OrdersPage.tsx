import React from 'react';
import { useSearchParams } from 'react-router-dom';
import SharedOrderView from "pages/shared/order";
import OrdersList from './OrdersList';

const OrdersPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order');
    const orderNumber = searchParams.get('orderNumber');

    if (orderId || orderNumber) {
        return <SharedOrderView />;
    }

    return <OrdersList />;
};

export default OrdersPage;