import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Switch,
    Tooltip
} from '@mui/material';
import {Close, Delete} from '@mui/icons-material';
import {Port} from 'misc/types/Port';
import {useSelector} from 'react-redux';
import {RootState} from 'app/reducers';
import {getStatusStr, isStatusActive, PortSubscription} from 'pages/profile/types/PortSubscription';
import {updateSubscriptionStatus} from "pages/profile/actions/profileActions";
import {useAppDispatch} from "../../misc/hooks/useAppDispatch";

interface SelectedPortsModalProps {
    open: boolean;
    onClose: () => void;
    selectedPorts: Port[];
    onRemove: (portId: string) => void;
}

const SelectedPortsModal: React.FC<SelectedPortsModalProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   selectedPorts,
                                                                   onRemove
                                                               }) => {
    const dispatch = useAppDispatch();
    const subscriptions = useSelector((state: RootState) => state.portSubscriptions.data);
    const { user } = useSelector((state: RootState) => state.userAuth);

    const handleStatusToggle = async (subscription: PortSubscription) => {
        if (!user?.uid) return;

        try {
            await dispatch(updateSubscriptionStatus(
                user.uid,
                subscription.id,
                isStatusActive(subscription) ? 'disable' : 'activate'
            ));
        } catch (error) {
            console.error('Failed to update subscription status:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Port management
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <List>
                    {selectedPorts.map((port) => {
                        const subscription = subscriptions[port.id];
                        const status = subscription ? getStatusStr(subscription) : 'unknown';
                        const isActive = subscription ? isStatusActive(subscription) : false;

                        return (
                            <ListItem key={port.id}>
                                <img
                                    src={`https://flagcdn.com/w20/${port.city.country.id.toLowerCase()}.png`}
                                    alt={`${port.city.country.title} flag`}
                                    style={{ marginRight: '8px', width: '20px' }}
                                />
                                <ListItemText
                                    primary={`${port.city.title} - ${port.title}`}
                                    secondary={`${port.city.country.title} • Status: ${status}`}
                                />
                                <ListItemSecondaryAction>
                                    {subscription && (
                                        <Tooltip title={isActive ? 'Disable' : 'Activate'}>
                                            <Switch
                                                edge="end"
                                                checked={isActive}
                                                onChange={() => handleStatusToggle(subscription)}
                                            />
                                        </Tooltip>
                                    )}
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => onRemove(port.id)}
                                        sx={{ ml: 1 }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectedPortsModal;