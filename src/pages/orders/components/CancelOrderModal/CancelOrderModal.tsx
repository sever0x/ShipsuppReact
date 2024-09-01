import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    styled, SelectChangeEvent,
} from '@mui/material';

interface CancelOrderModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '500px',
        maxWidth: '90vw',
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    width: '100%',
}));

const cancelReasons = [
    { value: 'Out of stock', label: 'Out of stock: Item unavailable, canceling order.' },
    { value: 'Pricing error', label: 'Pricing error: Listing price error, canceling order.' },
    { value: 'Shipping restrictions', label: 'Shipping restrictions: Cannot ship to your location, canceling order.' },
    { value: 'Fraud suspicion', label: 'Fraud suspicion: Suspected fraud, canceling order.' },
    { value: 'Unforeseen circumstances', label: 'Unforeseen circumstances: Unable to fulfill due to unforeseen circumstances, canceling order.' },
    { value: 'Quality issue', label: 'Quality issue: Quality problem, canceling order.' },
    { value: 'Product discontinued', label: 'Product discontinued: Item discontinued, canceling order.' },
    { value: 'Seller error', label: 'Seller error: Listing or inventory error, canceling order.' },
    { value: 'Regulatory compliance', label: 'Regulatory compliance: Regulatory issue, canceling order.' },
    { value: 'Customer request', label: 'Customer request: Canceling per customer request' },
];

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ open, onClose, onConfirm }) => {
    const [reason, setReason] = useState<string>('');

    const handleReasonChange = (event: SelectChangeEvent<unknown>) => {
        setReason(event.target.value as string);
    };

    const handleConfirm = () => {
        onConfirm(reason);
        onClose();
    };

    return (
        <StyledDialog open={open} onClose={onClose}>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="cancel-reason-label">Cancellation Reason</InputLabel>
                    <StyledSelect
                        labelId="cancel-reason-label"
                        value={reason}
                        onChange={handleReasonChange}
                        label="Cancellation Reason"
                    >
                        {cancelReasons.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </StyledSelect>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleConfirm} color="primary" disabled={!reason}>
                    Confirm Cancellation
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default CancelOrderModal;
