import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@mui/material';
import { Close, Delete, Public } from '@mui/icons-material';
import { Port } from 'misc/types/Port';

interface SelectedPortsModalProps {
    open: boolean;
    onClose: () => void;
    selectedPorts: Port[];
    onRemove: (portId: string) => void;
}

const SelectedPortsModal: React.FC<SelectedPortsModalProps> = ({ open, onClose, selectedPorts, onRemove }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Selected Ports
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
                    {selectedPorts.map((port) => (
                        <ListItem key={port.id}>
                            <img
                                src={`https://flagcdn.com/w20/${port.city.country.id.toLowerCase()}.png`}
                                alt={`${port.city.country.title} flag`}
                                style={{ marginRight: '8px', width: '20px' }}
                            />
                            <ListItemText
                                primary={`${port.city.title} - ${port.title}`}
                                secondary={port.city.country.title}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => onRemove(port.id)}>
                                    <Delete />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
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