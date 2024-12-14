import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Checkbox, Chip, Collapse, ListItemIcon, ListItemText, useMediaQuery, useTheme} from '@mui/material';
import {ChevronRight, ExpandMore, Public} from '@mui/icons-material';
import MenuItem from 'components/MenuItem';
import Menu from 'components/Menu';
import Box from 'components/Box';
import Typography from 'components/Typography';
import {Port} from 'misc/types/Port';
import {RootState} from 'app/reducers';
import {getStatusStr, isStatusActive} from 'pages/profile/types/PortSubscription';

interface PortSelectorProps {
    ports: { [key: string]: Port };
    selectedPorts: string[];
    onPortSelect: (portId: string) => void;
    multiSelect?: boolean;
    label?: string;
    containerSx?: React.CSSProperties;
    menuSx?: React.CSSProperties;
    menuItemSx?: React.CSSProperties;
    showSubscriptionStatus?: boolean;
}

const PortSelector: React.FC<PortSelectorProps> = ({
                                                       ports,
                                                       selectedPorts,
                                                       onPortSelect,
                                                       multiSelect = true,
                                                       label = 'Select ports',
                                                       containerSx,
                                                       menuSx,
                                                       menuItemSx,
                                                       showSubscriptionStatus = true
                                                   }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openCountries, setOpenCountries] = useState<{ [key: string]: boolean }>({});
    const [displayedLabel, setDisplayedLabel] = useState(label);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const subscriptions = useSelector((state: RootState) => state.portSubscriptions.data);

    useEffect(() => {
        if (selectedPorts.length > 0) {
            if (multiSelect) {
                const activePorts = selectedPorts.filter(portId => {
                    const subscription = subscriptions[portId];
                    return !showSubscriptionStatus || (subscription && isStatusActive(subscription));
                });
                setDisplayedLabel(`${activePorts.length} port${activePorts.length !== 1 ? 's' : ''} selected`);
            } else {
                const selectedPort = Object.values(ports).find(port => port.id === selectedPorts[0]);
                if (selectedPort) {
                    const subscription = subscriptions[selectedPort.id];
                    const isActive = !showSubscriptionStatus || (subscription && isStatusActive(subscription));
                    setDisplayedLabel(`${selectedPort.city.title} - ${selectedPort.title}${!isActive ? ' (inactive)' : ''}`);
                } else {
                    setDisplayedLabel(label);
                }
            }
        } else {
            setDisplayedLabel(label);
        }
    }, [selectedPorts, ports, subscriptions, multiSelect, label, showSubscriptionStatus]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCountryClick = (countryId: string) => {
        setOpenCountries(prev => ({ ...prev, [countryId]: !prev[countryId] }));
    };

    const handlePortSelect = (portId: string) => {
        onPortSelect(portId);
        if (!multiSelect) {
            handleClose();
        }
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
                    sx={menuItemSx}
                >
                    <ListItemIcon>
                        {country.id.toLowerCase() === 'all' ? (
                            <Public style={{ width: '20px', marginRight: '8px' }} />
                        ) : (
                            <img
                                src={`https://flagcdn.com/w20/${country.id.toLowerCase()}.png`}
                                alt={`${country.title} flag`}
                                style={{ width: '20px', marginRight: '8px' }}
                            />
                        )}
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
                        {country.ports.map((port) => {
                            const subscription = subscriptions[port.id];
                            const isActive = !showSubscriptionStatus || (subscription && isStatusActive(subscription));

                            return (
                                <MenuItem
                                    key={port.id}
                                    onClick={() => handlePortSelect(port.id)}
                                    sx={{
                                        paddingLeft: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        opacity: isActive ? 1 : 0.6,
                                        ...menuItemSx
                                    }}
                                >
                                    {multiSelect && (
                                        <Checkbox
                                            checked={selectedPorts.includes(port.id)}
                                            sx={{ padding: '4px' }}
                                        />
                                    )}
                                    <ListItemText
                                        primary={`${port.city.title} - ${port.title}`}
                                        secondary={showSubscriptionStatus && subscription ? getStatusStr(subscription) : undefined}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            style: {
                                                fontWeight: selectedPorts.includes(port.id) ? 'bold' : 'normal',
                                                color: selectedPorts.includes(port.id) ? 'primary.main' : 'inherit'
                                            }
                                        }}
                                    />
                                    {showSubscriptionStatus && !isActive && (
                                        <Chip
                                            label="Inactive"
                                            size="small"
                                            color="default"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                </MenuItem>
                            );
                        })}
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
                    minHeight: '40px',
                    ...containerSx
                }}
                justifyContent='space-between'
            >
                <Typography
                    sx={{
                        fontSize: { xs: '14px', sm: '16px' },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {displayedLabel}
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
                            width: { xs: '90vw', sm: '70vw', md: '50vw', lg: '24%' },
                            maxWidth: '400px',
                            maxHeight: '80vh',
                            ...menuSx
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