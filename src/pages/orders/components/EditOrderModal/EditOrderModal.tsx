import React from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
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

const EditOrderModal: React.FC<EditOrderModalProps> = ({ open, onClose, order }) => {
    const dispatch = useDispatch();

    const handleStatusChange = (newStatus: string) => {
        dispatch(updateOrderStatus(order.id, newStatus) as any);
        onClose();
    };

    const handleCancel = () => {
        dispatch(updateOrderStatus(order.id, 'CANCEL_BY_SELLER') as any);
        onClose();
    };

    const currentStatusIndex = statusOrder.indexOf(order.status);
    const nextStatus = statusOrder[currentStatusIndex + 1];

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Order #{order.orderNumber}</DialogTitle>
            <DialogContent>
                <Typography>Current status: {order.status}</Typography>
                <Typography>Quantity: {order.quantity}</Typography>
                <Typography>Price per one: {order.priceInOrder}</Typography>
                <Typography>Total price: {order.quantity * order.priceInOrder}</Typography>
                <Typography>Currency: {order.currencyInOrder}</Typography>
                <Box mt={2}>
                    <Typography variant="subtitle1">Status timeline:</Typography>
                    {Object.entries(order.datesOfStatusChange).map(([status, date]) => (
                        <Typography key={status}>
                            {status}: {typeof date === 'string' ? new Date(date).toLocaleString() : 'Invalid date'}
                        </Typography>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                {order.status !== 'COMPLETED' && (
                    <>
                        <Button
                            onClick={() => handleStatusChange(nextStatus)}
                            color="primary"
                            disabled={!nextStatus}
                        >
                            {nextStatus ? nextStatus.replace(/_/g, ' ') : 'No next status'}
                        </Button>
                        <Button
                            onClick={handleCancel}
                            color="secondary"
                            disabled={order.status === 'CANCEL_BY_SELLER'}
                        >
                            Cancel Order
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default EditOrderModal;