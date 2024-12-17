import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    Link,
    Select,
    Skeleton,
    styled,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateOrderStatus } from '../../actions/orderActions';
import { RootState } from 'app/reducers';
import { switchToChatOrCreateNew } from "pages/chats/actions/chatActions";
import { Order } from "pages/orders/types/Order";
import useAuth from "../../../../misc/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Chat } from "@mui/icons-material";
import MenuItem from 'components/MenuItem';
import OrderStatus from '../OrderStatus';
import CancelOrderModal from '../CancelOrderModal';
import ShareButton from 'components/ShareButton/ShareButton';
import TextDisplay from 'components/TextDisplay/TextDisplay';

interface EditOrderModalProps {
    open: boolean;
    onClose: () => void;
    order: Order;
    readOnly?: boolean;
}

const statusOrder = [
    'APPROVE_BY_BUYER',
    'APPROVE_BY_SELLER',
    'SENT',
    'ARRIVED',
    'COMPLETED',
];

const statusLabels: { [key: string]: string } = {
    'APPROVE_BY_BUYER': 'Approve',
    'APPROVE_BY_SELLER': 'Approve',
    'SENT': 'Sent',
    'ARRIVED': 'Delivered',
    'COMPLETED': 'Complete',
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
        [theme.breakpoints.down('sm')]: {
            margin: 0,
            width: '100%',
            maxHeight: '100%',
        },
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(2),
        },
    },
    '& .MuiDialogTitle-root': {
        padding: theme.spacing(2),
    },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));

const InfoColumn = styled(Box)(({ theme }) => ({
    flex: 1,
    marginRight: '24px',
    [theme.breakpoints.down('md')]: {
        marginRight: 0,
        marginBottom: theme.spacing(3),
    },
}));

const HistoryColumn = styled(Box)(({ theme }) => ({
    flex: 1,
    borderLeft: '1px solid #e0e0e0',
    paddingLeft: '24px',
    [theme.breakpoints.down('md')]: {
        borderLeft: 'none',
        paddingLeft: 0,
        borderTop: '1px solid #e0e0e0',
        paddingTop: theme.spacing(3),
    },
}));

const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
}));

const HistoryItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
    '&::before': {
        content: '""',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        marginRight: theme.spacing(1),
        marginTop: '6px',
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    width: '100%',
    '& .MuiSelect-select': {
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #CCCCCC',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
}));

const EditOrderModal: React.FC<EditOrderModalProps> = ({ open, onClose, order, readOnly = false }) => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { loadingDetails, orderDetails, error } = useSelector((state: RootState) => state.orders);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleStatusChange = (newStatus: string) => {
        if (readOnly) return;
        if (order.id) {
            dispatch(updateOrderStatus(order.id, newStatus) as any);
            onClose();
        }
    };

    const handleCancelOrder = (reason: string) => {
        if (readOnly) return;
        if (order.id) {
            dispatch(updateOrderStatus(order.id, 'CANCEL_BY_SELLER', reason) as any);
            onClose();
        }
    };

    const handleOpenChatWithBuyer = (order: Order | null) => {
        if (user?.uid && order) {
            dispatch(switchToChatOrCreateNew(order, user?.uid) as any);
            navigate("/chats");
        }
    }

    const formatDate = (dateString: unknown): string => {
        if (typeof dateString === 'string' || typeof dateString === 'number') {
            return new Date(dateString).toLocaleString();
        }
        return 'Invalid Date';
    };

    const currentStatusIndex = statusOrder.indexOf(order.status);

    const isOrderCancelled = order.status === 'CANCEL_BY_SELLER';
    const isOrderCompleted = order.status === 'COMPLETED';
    const canChangeStatus = !isOrderCancelled && !isOrderCompleted && !readOnly;

    const getBuyerInfo = () => {
        if (orderDetails?.buyer) {
            return `${orderDetails.buyer.firstName || ''} ${orderDetails.buyer.lastName || ''}`.trim() || 'Unknown';
        }
        return `${order.buyer.firstName || ''} ${order.buyer.lastName || ''}`.trim() || 'Unknown';
    };

    const getPortInfo = () => {
        if (orderDetails?.port) {
            return orderDetails.port.title || 'Unknown';
        }
        return order.port.title || 'Unknown';
    };

    const displayOrder = orderDetails || order;

    const sortedStatusHistory = Object.entries(displayOrder.datesOfStatusChange)
        .sort(([, dateA], [, dateB]) => {
            const timeA = new Date(dateA).getTime();
            const timeB = new Date(dateB).getTime();
            return timeA - timeB;
        });

    if (loadingDetails) {
        return (
            <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Skeleton variant="text" width="60%" />
                </DialogTitle>
                <DialogContent>
                    <ContentWrapper>
                        <InfoColumn>
                            <Skeleton variant="text" height={30} width="80%" />
                            <Skeleton variant="text" height={24} width="60%" />
                            <Skeleton variant="rectangular" height={40} width="100%" />
                            <Skeleton variant="text" height={24} width="70%" />
                            <Skeleton variant="text" height={24} width="50%" />
                        </InfoColumn>
                        <HistoryColumn>
                            <Skeleton variant="text" height={30} width="80%" />
                            {[1, 2, 3].map((_, index) => (
                                <Box key={index} mb={2}>
                                    <Skeleton variant="text" width="70%" />
                                    <Skeleton variant="text" width="50%" />
                                </Box>
                            ))}
                        </HistoryColumn>
                    </ContentWrapper>
                </DialogContent>
            </StyledDialog>
        );
    }

    if (error) {
        return (
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <Typography color="error">Error: {error}</Typography>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <>
            <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isMobile}>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        #{displayOrder.orderNumber}
                        <ShareButton
                            type="order"
                            id={displayOrder.id}
                            orderNumber={displayOrder.orderNumber}
                        />
                    </Box>
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
                            {readOnly ? (
                                <Box sx={{mb: 4}}>
                                    <TextDisplay
                                        label="Current status"
                                        value={<OrderStatus status={displayOrder.status}/>}
                                    />
                                    <Divider sx={{my: 2}}/>

                                    <Typography variant="subtitle1" sx={{mb: 2}}>Product Information</Typography>
                                    <TextDisplay label="Article" value={displayOrder.good.article}/>
                                    <TextDisplay label="Title" value={displayOrder.good.title}/>
                                    <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                                        {displayOrder.good.images && Object.values(displayOrder.good.images)[0] && (
                                            <img
                                                src={Object.values(displayOrder.good.images)[0]}
                                                alt={displayOrder.good.title}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                        )}
                                    </Box>

                                    <Divider sx={{my: 2}}/>

                                    <Typography variant="subtitle1" sx={{mb: 2}}>Order Details</Typography>
                                    <TextDisplay label="Quantity" value={displayOrder.quantity}/>
                                    <TextDisplay
                                        label="Price per unit"
                                        value={`${displayOrder.priceInOrder} ${displayOrder.currencyInOrder}`}
                                    />
                                    <TextDisplay
                                        label="Total price"
                                        value={`${displayOrder.quantity * displayOrder.priceInOrder} ${displayOrder.currencyInOrder}`}
                                    />

                                    <Divider sx={{my: 2}}/>

                                    <Typography variant="subtitle1" sx={{mb: 2}}>Buyer Information</Typography>
                                    <TextDisplay
                                        label="Buyer"
                                        value={
                                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                {getBuyerInfo()}
                                                {!readOnly && (
                                                    <IconButton
                                                        onClick={() => handleOpenChatWithBuyer(orderDetails)}
                                                        size="small"
                                                    >
                                                        <Chat fontSize="small"/>
                                                    </IconButton>
                                                )}
                                            </Box>
                                        }
                                    />
                                    <TextDisplay label="Buyer ID" value={displayOrder.buyer.id}/>
                                    <TextDisplay label="MMSI" value={displayOrder.buyer.vesselMMSI || 'N/A'}/>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        <TextDisplay label="Port" value={getPortInfo()}/>
                                    </Box>

                                    {isOrderCancelled && (
                                        <>
                                            <Divider sx={{my: 2}}/>
                                            <Typography variant="subtitle1" color="error" sx={{mb: 2}}>
                                                Cancellation Information
                                            </Typography>
                                            <TextDisplay
                                                label="Cancellation Reason"
                                                value={displayOrder.cancellationReason}
                                            />
                                        </>
                                    )}
                                </Box>
                            ) : (
                                <>
                                    <InfoRow>
                                        <Typography variant="body1">Current status:</Typography>
                                        <OrderStatus status={displayOrder.status} />
                                    </InfoRow>
                                    <InfoRow>
                                        <Typography variant="body1">Article:</Typography>
                                        <Typography variant="body1">{displayOrder.good.article || '-'}</Typography>
                                    </InfoRow>
                                    <InfoRow>
                                        <Typography variant="body1">Title:</Typography>
                                        <Typography variant="body1">{displayOrder.good.title || '-'}</Typography>
                                    </InfoRow>
                                    <InfoRow>
                                        <Typography variant="body1">Quantity:</Typography>
                                        <Typography variant="body1">{displayOrder.quantity}</Typography>
                                    </InfoRow>
                                    <InfoRow>
                                        <Typography variant="body1">Price per one:</Typography>
                                        <Typography variant="body1">{displayOrder.priceInOrder}</Typography>
                                    </InfoRow>
                                    <InfoRow>
                                        <Typography variant="body1">Total price:</Typography>
                                        <Typography variant="body1">
                                            {displayOrder.quantity * displayOrder.priceInOrder}
                                        </Typography>
                                    </InfoRow>
                                    <InfoRow>
                                        <Typography variant="body1">Buyer:</Typography>
                                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <Typography variant="body1">{getBuyerInfo()}</Typography>
                                            {!readOnly && (
                                                <IconButton onClick={() => handleOpenChatWithBuyer(orderDetails)}>
                                                    <Chat fontSize="small" />
                                                </IconButton>
                                            )}
                                        </div>
                                    </InfoRow>
                                    <InfoRow>
                                        <Typography variant="body1">Buyer ID:</Typography>
                                        <Typography variant="body1">{displayOrder.buyer.id}</Typography>
                                    </InfoRow>
                                    <InfoRow>
                                        <Box>
                                            <Typography variant="body1">MMSI:</Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'grey.600',
                                                    fontSize: '12px',
                                                    mt: 0.5,
                                                    display: 'block',
                                                }}
                                            >
                                                <Link
                                                    href="https://www.marinetraffic.com/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    underline="hover"
                                                    sx={{
                                                        color: 'inherit',
                                                        fontSize: 'inherit',
                                                    }}
                                                >
                                                    Check on MarineTraffic
                                                </Link>
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1">{displayOrder.buyer.vesselMMSI || 'N/A'}</Typography>
                                    </InfoRow>
                                    <InfoRow>
                                        <Typography variant="body1">Port:</Typography>
                                        <Typography variant="body1">{getPortInfo()}</Typography>
                                    </InfoRow>

                                    {isOrderCancelled && (
                                        <InfoRow>
                                            <Typography variant="body1">Cancellation Reason:</Typography>
                                            <Typography variant="body1">{displayOrder.cancellationReason}</Typography>
                                        </InfoRow>
                                    )}

                                    {canChangeStatus && (
                                        <Box mt={2}>
                                            <Typography variant="subtitle1">Set new order status:</Typography>
                                            <Typography variant="caption" color="error.main">
                                                *be careful, you cannot change the status back
                                            </Typography>
                                            <Box mt={1}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="status-select-label">New Status</InputLabel>
                                                    <StyledSelect
                                                        labelId="status-select-label"
                                                        value=""
                                                        onChange={(e) => handleStatusChange(e.target.value as string)}
                                                        label="New Status"
                                                    >
                                                        {statusOrder.slice(currentStatusIndex + 1).map((status) => (
                                                            <MenuItem key={status} value={status}>
                                                                {statusLabels[status]}
                                                            </MenuItem>
                                                        ))}
                                                    </StyledSelect>
                                                </FormControl>
                                                <Button
                                                    onClick={() => setCancelModalOpen(true)}
                                                    variant="contained"
                                                    color="error"
                                                    sx={{ mt: 1 }}
                                                    fullWidth
                                                >
                                                    Cancel order
                                                </Button>
                                            </Box>
                                        </Box>
                                    )}
                                </>
                            )}
                        </InfoColumn>
                        <HistoryColumn>
                            <Typography variant="h6" gutterBottom>Order History</Typography>
                            {sortedStatusHistory.map(([status, date]) => (
                                <HistoryItem key={status}>
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">
                                            {statusMessages[status]}
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                                            {formatDate(date)}
                                        </Typography>
                                    </Box>
                                </HistoryItem>
                            ))}
                        </HistoryColumn>
                    </ContentWrapper>
                </DialogContent>
            </StyledDialog>
            {!readOnly && (
                <CancelOrderModal
                    open={cancelModalOpen}
                    onClose={() => setCancelModalOpen(false)}
                    onConfirm={handleCancelOrder}
                />
            )}
        </>
    );
};

export default EditOrderModal;