import React from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Box, Chip, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {Port} from 'misc/types/Port';

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
}

const StyledPortsAccordion: React.FC<StyledPortsAccordionProps> = ({ groupedPorts }) => {
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
                            {ports.map((port) => (
                                <Chip
                                    key={port.id}
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
                            ))}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default StyledPortsAccordion;