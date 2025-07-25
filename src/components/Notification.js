import React, { useState, useEffect } from 'react';
import {
    Snackbar,
    Alert,
    IconButton,
    Stack,
    Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const Notification = ({ message, severity = 'info', autoHideDuration = 6000 }) => {
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
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
        const timer = setTimeout(() => {
            if (notifications.length > 0) {
                removeNotification(notifications[0].id);
            }
        }, notifications[0]?.duration || 6000);

        return () => clearTimeout(timer);
    }, [notifications]);

    return (
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
    );
};

export { Notification, NotificationProvider, addNotification };
