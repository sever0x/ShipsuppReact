import React from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Typography,
    Box,
    Chip,
    IconButton,
    styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
    'COMPLETED': 'Complete'
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
    'ARRIVED': 'Arrived',
    'COMPLETED': 'Completed',
    'CANCEL_BY_SELLER': 'Cancelled by seller'
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
        backgroundColor: 'white',
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
    },
    '& .MuiDialogTitle-root': {
        padding: theme.spacing(2),
    },
}));

const ContentWrapper = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
});

const InfoColumn = styled(Box)({
    flex: 1,
    marginRight: '24px',
});

const HistoryColumn = styled(Box)({
    flex: 1,
    borderLeft: '1px solid #e0e0e0',
    paddingLeft: '24px',
});

const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
}));

const StatusButton = styled(Button)(({ theme }) => ({
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

const HistoryItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
    '&::before': {
        content: '""',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        marginRight: theme.spacing(1),
        marginTop: '6px',
    },
}));

const EditOrderModal: React.FC<EditOrderModalProps> = ({ open, onClose, order }) => {
    const dispatch = useDispatch();

    const handleStatusChange = (newStatus: string) => {
        dispatch(updateOrderStatus(order.id, newStatus) as any);
        onClose();
    };

    const currentStatusIndex = statusOrder.indexOf(order.status);
    const nextStatus = statusOrder[currentStatusIndex + 1];

    const isOrderCancelled = order.status === 'CANCEL_BY_SELLER';
    const isOrderCompleted = order.status === 'COMPLETED';

    const getBuyerInfo = () => {
        if (typeof order.buyer === 'object' && order.buyer !== null) {
            return `${order.buyer.firstName || ''} ${order.buyer.lastName || ''}`.trim() || 'Unknown';
        }
        return order.buyer || 'Unknown';
    };

    const getPortInfo = () => {
        if (typeof order.port === 'object' && order.port !== null) {
            return order.port.title || 'Unknown';
        }
        return order.port || 'Unknown';
    };

    const sortedStatusChanges = Object.entries(order.datesOfStatusChange as Record<string, string>)
        .sort(([, dateA], [, dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());

    return (
        <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                #{order.orderNumber}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <ContentWrapper>
                    <InfoColumn>
                        <InfoRow>
                            <Typography variant="body1">Current status:</Typography>
                            <Chip
                                label={statusMessages[order.status]}
                                color={statusColors[order.status]}
                                size="small"
                            />
                        </InfoRow>
                        <InfoRow>
                            <Typography variant="body1">Article:</Typography>
                            <Typography variant="body1">{order.article || '-'}</Typography>
                        </InfoRow>
                        <InfoRow>
                            <Typography variant="body1">Title:</Typography>
                            <Typography variant="body1">{order.title || '-'}</Typography>
                        </InfoRow>
                        <InfoRow>
                            <Typography variant="body1">Quantity:</Typography>
                            <Typography variant="body1">{order.quantity}</Typography>
                        </InfoRow>
                        <InfoRow>
                            <Typography variant="body1">Price per one:</Typography>
                            <Typography variant="body1">{order.priceInOrder}</Typography>
                        </InfoRow>
                        <InfoRow>
                            <Typography variant="body1">Total price:</Typography>
                            <Typography variant="body1">{order.quantity * order.priceInOrder}</Typography>
                        </InfoRow>
                        <InfoRow>
                            <Typography variant="body1">Buyer:</Typography>
                            <Typography variant="body1">{getBuyerInfo()}</Typography>
                        </InfoRow>
                        <InfoRow>
                            <Typography variant="body1">Port:</Typography>
                            <Typography variant="body1">{getPortInfo()}</Typography>
                        </InfoRow>

                        <Box mt={2}>
                            <Typography variant="subtitle1">Set new order status:</Typography>
                            <Typography variant="caption" color="error">
                                *be careful, you cannot change the status back
                            </Typography>
                            <Box mt={1}>
                                {!isOrderCancelled && !isOrderCompleted && nextStatus && (
                                    <StatusButton
                                        onClick={() => handleStatusChange(nextStatus)}
                                        variant="contained"
                                        color="primary"
                                    >
                                        {statusLabels[nextStatus]}
                                    </StatusButton>
                                )}
                                {!isOrderCancelled && !isOrderCompleted && (
                                    <StatusButton
                                        onClick={() => handleStatusChange('CANCEL_BY_SELLER')}
                                        variant="contained"
                                        color="error"
                                    >
                                        Cancel order
                                    </StatusButton>
                                )}
                            </Box>
                        </Box>
                    </InfoColumn>
                    <HistoryColumn>
                        <Typography variant="h6" gutterBottom>Order History</Typography>
                        {sortedStatusChanges.map(([status, date]) => (
                            <HistoryItem key={status}>
                                <Box>
                                    <Typography variant="body2" fontWeight="bold">
                                        {statusMessages[status]}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {new Date(date).toLocaleString()}
                                    </Typography>
                                </Box>
                            </HistoryItem>
                        ))}
                    </HistoryColumn>
                </ContentWrapper>
            </DialogContent>
        </StyledDialog>
    );
};

export default EditOrderModal;