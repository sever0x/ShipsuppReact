import { useState } from 'react';
import { useSnackbar } from 'notistack';

interface ShareableLinkHookReturn {
    getProductLink: (productId: string) => string;
    getOrderLink: (orderId: string, orderNumber?: string) => string;
    copyLink: (link: string) => Promise<boolean>;
    loading: boolean;
}

export const useShareableLink = (): ShareableLinkHookReturn => {
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const getProductLink = (productId: string): string => {
        return `${window.location.origin}/products?product=${productId}`;
    };

    const getOrderLink = (orderId: string, orderNumber?: string): string => {
        if (orderNumber) {
            return `${window.location.origin}/orders?orderNumber=${orderNumber}`;
        }
        return `${window.location.origin}/orders?order=${orderId}`;
    };

    const copyLink = async (link: string): Promise<boolean> => {
        setLoading(true);
        try {
            await navigator.clipboard.writeText(link);
            enqueueSnackbar('Link copied to clipboard', { variant: 'success' });
            return true;
        } catch (error) {
            console.error('Failed to copy link:', error);
            enqueueSnackbar('Failed to copy link', { variant: 'error' });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        getProductLink,
        getOrderLink,
        copyLink,
        loading
    };
};