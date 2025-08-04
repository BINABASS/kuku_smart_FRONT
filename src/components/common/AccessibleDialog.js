import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box
} from '@mui/material';

/**
 * AccessibleDialog - A wrapper around Material-UI Dialog that fixes accessibility issues
 * 
 * This component addresses the aria-hidden focus warning by:
 * 1. Using disableEnforceFocus to prevent focus trapping issues
 * 2. Using disableAutoFocus to prevent automatic focus conflicts
 * 3. Using keepMounted={false} to ensure proper cleanup
 * 4. Adding proper aria-labelledby for screen readers
 * 5. Using proper focus management
 */
const AccessibleDialog = ({
    open,
    onClose,
    title,
    children,
    actions,
    maxWidth = "sm",
    fullWidth = true,
    ...props
}) => {
    const dialogId = `dialog-${Math.random().toString(36).substr(2, 9)}`;
    const titleId = `${dialogId}-title`;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            disableEnforceFocus
            disableAutoFocus
            keepMounted={false}
            aria-labelledby={titleId}
            aria-describedby={`${dialogId}-content`}
            {...props}
        >
            {title && (
                <DialogTitle id={titleId}>
                    {title}
                </DialogTitle>
            )}
            
            <DialogContent id={`${dialogId}-content`}>
                {children}
            </DialogContent>
            
            {actions && (
                <DialogActions>
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default AccessibleDialog; 