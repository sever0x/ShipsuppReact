import React, { useState } from 'react';
import { Box, Typography, Collapse, Alert, Switch, FormControlLabel } from '@mui/material';
import PortSelector from 'components/PortSelector';
import { Port } from 'misc/types/Port';

interface AddPortSectionProps {
    ports: { [key: string]: Port };
    existingPorts: Port[];
    onAddPort: (portId: string, portIdToCopy?: string) => Promise<void>;
}

const AddPortSection: React.FC<AddPortSectionProps> = ({
                                                           ports,
                                                           existingPorts,
                                                           onAddPort
                                                       }) => {
    const [selectedPortId, setSelectedPortId] = useState<string>('');
    const [enableCatalogCopy, setEnableCatalogCopy] = useState(false);
    const [copyFromPortId, setCopyFromPortId] = useState<string>('');

    const handlePortSelect = async (portId: string) => {
        if (enableCatalogCopy && copyFromPortId) {
            await onAddPort(portId, copyFromPortId);
        } else {
            await onAddPort(portId);
        }
        setSelectedPortId('');
        setCopyFromPortId('');
        setEnableCatalogCopy(false);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Add New Port</Typography>

            {existingPorts.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={enableCatalogCopy}
                                onChange={(e) => setEnableCatalogCopy(e.target.checked)}
                            />
                        }
                        label="Copy catalog from existing port"
                    />

                    <Collapse in={enableCatalogCopy}>
                        <Box sx={{ mt: 1 }}>
                            <Alert severity="info" sx={{ mb: 1 }}>
                                Copying a catalog will transfer all products from the selected port to your new port
                            </Alert>
                            <PortSelector
                                ports={existingPorts.reduce((acc, port) => ({ ...acc, [port.id]: port }), {})}
                                selectedPorts={copyFromPortId ? [copyFromPortId] : []}
                                onPortSelect={setCopyFromPortId}
                                multiSelect={false}
                                label="Select port to copy from"
                                containerSx={{ marginBottom: 2 }}
                                showSubscriptionStatus={false}
                            />
                        </Box>
                    </Collapse>
                </Box>
            )}

            <PortSelector
                ports={ports}
                selectedPorts={selectedPortId ? [selectedPortId] : []}
                onPortSelect={handlePortSelect}
                multiSelect={false}
                label="Select port to add"
                containerSx={{ marginBottom: 1 }}
                showSubscriptionStatus={false}
            />
        </Box>
    );
};

export default AddPortSection;