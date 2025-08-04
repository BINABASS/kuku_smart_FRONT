import React, { useState, useEffect, createContext, useContext } from 'react';
import {
    Snackbar,
    Alert,
    IconButton,
    Stack,
    Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// Create context for notifications
const NotificationContext = createContext();

// Custom hook to use notifications
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

const Notification = ({ message, severity = 'info', autoHideDuration = 6000, onClose }) => {
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
        onClose && onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                severity={severity}
                action={
                    <IconButton
                        size="small"
                        color="inherit"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, severity = 'info', duration = 6000) => {
        const id = Date.now();
        setNotifications(prev => [
            ...prev,
            { id, message, severity, duration },
        ]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    useEffect(() => {
        if (notifications.length > 0) {
            const timer = setTimeout(() => {
                removeNotification(notifications[0].id);
            }, notifications[0]?.duration || 6000);

            return () => clearTimeout(timer);
        }
    }, [notifications]);

    const contextValue = {
        addNotification,
        removeNotification,
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            <Box>
                {children}
                <Stack spacing={2} sx={{ position: 'fixed', top: 80, right: 20, zIndex: 1000 }}>
                    {notifications.map(notification => (
                        <Notification
                            key={notification.id}
                            message={notification.message}
                            severity={notification.severity}
                            autoHideDuration={notification.duration}
                            onClose={() => removeNotification(notification.id)}
                        />
                    ))}
                </Stack>
            </Box>
        </NotificationContext.Provider>
    );
};

// Legacy function for backward compatibility
export const addNotification = (message, severity = 'info', duration = 6000) => {
    console.warn('addNotification is deprecated. Use useNotification hook instead.');
    // This will be handled by the context when the provider is available
};

export { Notification, NotificationProvider };
