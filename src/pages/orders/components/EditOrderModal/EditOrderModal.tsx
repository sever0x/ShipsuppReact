import React from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip
} from '@mui/material';
import { updateOrderStatus } from '../../actions/orderActions';

interface EditOrderModalProps {
    open: boolean;
    onClose: () => void;
    order: any;
}

const statusOrder = [
    'APPROVE_BY_BUYER',
    'APPROVE_BY_SELLER',
    'SENT',
    'ARRIVED',
    'COMPLETED'
];

const statusLabels: { [key: string]: string } = {
    'APPROVE_BY_BUYER': 'Approve',
    'APPROVE_BY_SELLER': 'Approve',
    'SENT': 'Sent',
    'ARRIVED': 'Delivered',
    'COMPLETED': 'Complete',
    'CANCEL_BY_SELLER': 'Cancel order'
};

const statusColors: { [key: string]: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } = {
    'APPROVE_BY_BUYER': 'info',
    'APPROVE_BY_SELLER': 'primary',
    'SENT': 'secondary',
    'ARRIVED': 'warning',
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

const EditOrderModal: React.FC<EditOrderModalProps> = ({ open, onClose, order }) => {
    const dispatch = useDispatch();

    const handleStatusChange = (newStatus: string) => {
        dispatch(updateOrderStatus(order.id, newStatus) as any);
        onClose();
    };

    const currentStatusIndex = statusOrder.indexOf(order.status);
    const availableStatuses = statusOrder.slice(currentStatusIndex + 1);

    const isOrderCancelled = order.status === 'CANCEL_BY_SELLER';
    const isOrderCompleted = order.status === 'COMPLETED';

    const sortedStatusChanges = Object.entries(order.datesOfStatusChange as Record<string, string>)
        .sort(([, dateA], [, dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Order #{order.orderNumber}</DialogTitle>
            <DialogContent>
                <Typography>Current status:
                    <Chip
                        label={statusMessages[order.status]}
                        color={statusColors[order.status]}
                        size="small"
                        style={{ marginLeft: '10px' }}
                    />
                </Typography>
                <Typography>Quantity: {order.quantity}</Typography>
                <Typography>Price per one: {order.priceInOrder}</Typography>
                <Typography>Total price: {order.quantity * order.priceInOrder}</Typography>
                <Typography>Currency: {order.currencyInOrder}</Typography>
                <Box mt={2}>
                    <Typography variant="subtitle1">Status timeline:</Typography>
                    {sortedStatusChanges.map(([status, date]) => (
                        <Typography key={status}>
                            {statusMessages[status]} → {new Date(date).toLocaleString()}
                        </Typography>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                {!isOrderCancelled && !isOrderCompleted && availableStatuses.map((status) => (
                    <Button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        color="primary"
                        variant="contained"
                        style={{ marginLeft: '10px' }}
                    >
                        {statusLabels[status]}
                    </Button>
                ))}
                {!isOrderCancelled && !isOrderCompleted && (
                    <Button
                        onClick={() => handleStatusChange('CANCEL_BY_SELLER')}
                        color="error"
                        variant="contained"
                        style={{ marginLeft: '10px' }}
                    >
                        Cancel Order
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default EditOrderModal;