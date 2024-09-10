import React from 'react';
import {Box, Chip, ChipProps, Tooltip} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

interface ExtendedChipProps extends Omit<ChipProps, 'color'> {
    color?: ChipProps['color'] | 'customRed';
}

interface OrderStatusProps extends Omit<ExtendedChipProps, 'color'> {
    status: string;
    showIcon?: boolean;
}

const statusConfig: Record<string, { label: string; icon: React.ReactElement; color: ExtendedChipProps['color'] }> = {
    'APPROVE_BY_BUYER': { label: 'Order Created', icon: <PendingIcon fontSize="small" />, color: 'info' },
    'APPROVE_BY_SELLER': { label: 'Order Approved', icon: <CheckCircleOutlineIcon fontSize="small" />, color: 'primary' },
    'SENT': { label: 'Sent', icon: <LocalShippingIcon fontSize="small" />, color: 'secondary' },
    'ARRIVED': { label: 'Delivered', icon: <InventoryIcon fontSize="small" />, color: 'warning' },
    'COMPLETED': { label: 'Completed', icon: <CheckCircleOutlineIcon fontSize="small" />, color: 'success' },
    'CANCEL_BY_SELLER': { label: 'Cancelled', icon: <CancelIcon fontSize="small" />, color: 'customRed' },
};

const OrderStatus: React.FC<OrderStatusProps> = ({ status, showIcon = true, ...props }) => {
    const config = statusConfig[status] || { label: 'Unknown', icon: <PendingIcon fontSize="small" />, color: 'default' };

    return (
        <Tooltip title={`Status: ${config.label}`}>
            <Chip
                icon={showIcon ? <Box component="span" sx={{ display: 'flex', alignItems: 'center', mr: 0.5 }}>{config.icon}</Box> : undefined}
                label={config.label}
                color={config.color}
                size="small"
                {...props}
            />
        </Tooltip>
    );
};

declare module '@mui/material/Chip' {
    interface ChipPropsColorOverrides {
        customRed: true;
    }
}

export default OrderStatus;