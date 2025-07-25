import React from 'react';
import {
    Box,
    CircularProgress,
    Typography,
    Paper,
    Skeleton,
} from '@mui/material';

const Loading = ({ children, variant = 'skeleton', ...props }) => {
    if (variant === 'skeleton') {
        return (
            <Box sx={{ width: '100%', ...props }}>
                {children.map((child, index) => (
                    <Skeleton
                        key={index}
                        variant={child.variant || 'rectangular'}
                        width={child.width || '100%'}
                        height={child.height || 40}
                        sx={{ mb: 2 }}
                    />
                ))}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                ...props,
            }}
        >
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2 }}>
                Loading...
            </Typography>
        </Box>
    );
};

export default Loading;
