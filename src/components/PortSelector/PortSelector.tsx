import React, { useState } from 'react';
import { ListItemText, ListItemIcon, Collapse, Checkbox } from '@mui/material';
import { ExpandMore, ChevronRight, LocationOn } from '@mui/icons-material';
import MenuItem from 'components/MenuItem';
import Menu from 'components/Menu';
import Box from 'components/Box';
import Typography from 'components/Typography';

interface Port {
    id: string;
    title: string;
    city: {
        country: {
            id: string;
            title: string;
        };
        title: string;
    };
}

interface PortSelectorProps {
    ports: { [key: string]: Port };
    selectedPorts: string[];
    onPortSelect: (portId: string) => void;
}

const PortSelector: React.FC<PortSelectorProps> = ({ ports, selectedPorts, onPortSelect }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openCountries, setOpenCountries] = useState<{ [key: string]: boolean }>({});

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCountryClick = (countryId: string) => {
        setOpenCountries(prev => ({ ...prev, [countryId]: !prev[countryId] }));
    };

    const groupedPorts = Object.values(ports).reduce((acc, port) => {
        const countryId = port.city.country.id;
        if (!acc[countryId]) {
            acc[countryId] = {
                id: countryId,
                title: port.city.country.title,
                ports: []
            };
        }
        acc[countryId].ports.push(port);
        return acc;
    }, {} as { [key: string]: { id: string; title: string; ports: Port[] } });

    const renderPorts = () => {
        return Object.values(groupedPorts).map((country) => {
            const hasSubports = country.ports.length > 0;

            const items = [
                <MenuItem
                    key={country.id}
                    onClick={() => handleCountryClick(country.id)}
                >
                    <ListItemIcon>
                        <img
                            src={`https://flagcdn.com/w20/${country.id.toLowerCase()}.png`}
                            alt={`${country.title} flag`}
                            style={{ width: '20px', marginRight: '8px' }}
                        />
                    </ListItemIcon>
                    <ListItemText primary={country.title} />
                    {hasSubports && (
                        <ListItemIcon>
                            {openCountries[country.id] ? <ExpandMore /> : <ChevronRight />}
                        </ListItemIcon>
                    )}
                </MenuItem>
            ];

            if (hasSubports) {
                items.push(
                    <Collapse key={`collapse-${country.id}`} in={openCountries[country.id]} timeout="auto" unmountOnExit>
                        {country.ports.map((port) => (
                            <MenuItem
                                key={port.id}
                                onClick={() => onPortSelect(port.id)}
                                sx={{
                                    paddingLeft: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <Checkbox
                                    checked={selectedPorts.includes(port.id)}
                                    sx={{ padding: '4px' }}
                                />
                                {/*<LocationOn sx={{ marginRight: '8px', color: 'primary.main' }} />*/}
                                <ListItemText
                                    primary={`${port.city.title} - ${port.title}`}
                                    primaryTypographyProps={{
                                        variant: 'body2',
                                        style: {
                                            fontWeight: selectedPorts.includes(port.id) ? 'bold' : 'normal',
                                            color: selectedPorts.includes(port.id) ? 'primary.main' : 'inherit'
                                        }
                                    }}
                                />
                            </MenuItem>
                        ))}
                    </Collapse>
                );
            }

            return items;
        });
    };

    return (
        <>
            <Box
                onClick={handleClick}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '8px 12px',
                }}
                justifyContent='space-between'
            >
                <Typography>
                    {selectedPorts.length > 0
                        ? `${selectedPorts.length} port${selectedPorts.length > 1 ? 's' : ''} selected`
                        : 'Select ports'}
                </Typography>
                <ExpandMore sx={{ ml: 1 }} />
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            width: '24%',
                            maxHeight: '400px',
                        },
                    }
                }}
            >
                {renderPorts()}
            </Menu>
        </>
    );
};

export default PortSelector;