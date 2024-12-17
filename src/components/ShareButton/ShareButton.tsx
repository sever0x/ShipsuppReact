import React from 'react';
import { Tooltip } from '@mui/material';
import { Share as ShareIcon } from '@mui/icons-material';
import IconButton from "../IconButton";
import { useShareableLink } from 'misc/hooks/useShareableLink';

interface ShareButtonProps {
    type: 'product' | 'order';
    id: string;
    orderNumber?: string;
    className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ type, id, orderNumber, className }) => {
    const { getProductLink, getOrderLink, copyLink, loading } = useShareableLink();

    const handleShare = async () => {
        const link = type === 'product'
            ? getProductLink(id)
            : getOrderLink(id, orderNumber);
        await copyLink(link);
    };

    return (
        <Tooltip title="Share link">
            <IconButton
                onClick={handleShare}
                disabled={loading}
                className={className}
                size="small"
            >
                <ShareIcon fontSize="inherit" />
            </IconButton>
        </Tooltip>
    );
};

export default ShareButton;