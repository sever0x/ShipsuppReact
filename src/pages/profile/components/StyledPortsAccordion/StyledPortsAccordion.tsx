import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Typography,
    Tooltip,
    IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Port } from 'misc/types/Port';
import {getStatusStr, isStatusActive, PortSubscription} from 'pages/profile/types/PortSubscription';

interface Country {
    id: string;
    title: string;
}

interface GroupedPorts {
    [countryId: string]: {
        country: Country;
        ports: Port[];
    };
}

interface StyledPortsAccordionProps {
    groupedPorts: GroupedPorts;
    subscriptions?: { [key: string]: PortSubscription };
    onStatusChange?: (portId: string, action: 'disable' | 'activate') => void;
}

const StyledPortsAccordion: React.FC<StyledPortsAccordionProps> = ({
                                                                       groupedPorts,
                                                                       subscriptions = {},
                                                                       onStatusChange
                                                                   }) => {
    const getPortStatusColor = (portId: string): string => {
        const subscription = subscriptions[portId];
        if (!subscription) return 'default';
        return isStatusActive(subscription) ? 'success' : 'error';
    };

    const getPortStatusLabel = (portId: string): string => {
        const subscription = subscriptions[portId];
        if (!subscription) return 'Unknown';
        return getStatusStr(subscription);
    };

    return (
        <Box sx={{ mt: 2 }}>
            {Object.entries(groupedPorts).map(([countryId, { country, ports }]) => (
                <Accordion
                    key={countryId}
                    sx={{
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        '&:before': { display: 'none' },
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                        sx={{
                            padding: '8px 0',
                            '& .MuiAccordionSummary-content': {
                                margin: '4px 0',
                                '&.Mui-expanded': { margin: '4px 0' },
                            },
                            '& .MuiAccordionSummary-expandIconWrapper': {
                                marginLeft: 2,
                            },
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            width="100%"
                            justifyContent="space-between"
                        >
                            <Box display="flex" alignItems="center">
                                <img
                                    src={`https://flagcdn.com/w20/${country.id.toLowerCase()}.png`}
                                    alt={`${country.title} flag`}
                                    style={{ marginRight: '8px', width: '20px' }}
                                />
                                <Typography variant="body1" color="text.primary">
                                    {country.title}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                {ports.length} {ports.length === 1 ? 'port' : 'ports'}
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: '0 0 16px 28px' }}>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {ports.map((port) => {
                                const subscription = subscriptions[port.id];
                                const isActive = subscription ? isStatusActive(subscription) : false;
                                const statusColor = getPortStatusColor(port.id);
                                const statusLabel = getPortStatusLabel(port.id);

                                return (
                                    <Box
                                        key={port.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}
                                    >
                                        <Chip
                                            icon={<LocationOnIcon sx={{ fontSize: '0.9rem' }} />}
                                            label={`${port.title}, ${port.city.title}`}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'background.paper',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                '& .MuiChip-label': {
                                                    fontSize: '0.75rem',
                                                },
                                            }}
                                        />
                                        {subscription && onStatusChange && (
                                            <Tooltip title={`Status: ${statusLabel}`}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        onStatusChange(
                                                            subscription.id,
                                                            isActive ? 'disable' : 'activate'
                                                        )
                                                    }
                                                >
                                                    {isActive ? (
                                                        <CheckCircleIcon color="success" fontSize="small" />
                                                    ) : (
                                                        <CancelIcon color="error" fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default StyledPortsAccordion;