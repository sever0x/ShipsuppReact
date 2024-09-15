import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    styled,
    useMediaQuery,
    useTheme,
} from '@mui/material';

interface CancelOrderModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        width: '500px',
        maxWidth: '95vw',
        backgroundColor: 'white',
    },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    width: '100%',
    backgroundColor: 'white',
    '& .MuiMenuItem-root': {
        whiteSpace: 'normal',
        wordBreak: 'break-word',
    },
}));

const StyledMenuItem = styled(MenuItem)({
    whiteSpace: 'normal',
    wordBreak: 'break-word',
});

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleReasonChange = (event: SelectChangeEvent<unknown>) => {
        setReason(event.target.value as string);
    };

    const handleConfirm = () => {
        onConfirm(reason);
        onClose();
    };

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="cancel-reason-label">Cancellation Reason</InputLabel>
                    <StyledSelect
                        labelId="cancel-reason-label"
                        value={reason}
                        onChange={handleReasonChange}
                        label="Cancellation Reason"
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: isMobile ? '50vh' : '70vh',
                                    width: '95%',
                                    backgroundColor: 'white',
                                },
                            },
                        }}
                    >
                        {cancelReasons.map((option) => (
                            <StyledMenuItem key={option.value} value={option.value}>
                                {option.label}
                            </StyledMenuItem>
                        ))}
                    </StyledSelect>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{color: 'customRed.main'}}>Cancel</Button>
                <Button onClick={handleConfirm} sx={{color: 'success.main'}} disabled={!reason}>
                    Confirm Cancellation
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export default CancelOrderModal;