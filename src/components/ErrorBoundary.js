import React, { Component } from 'react';
import {
    Paper,
    Typography,
    Button,
    Box,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught:', error, errorInfo);
    }

    render() {
        const { hasError, error } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        An error occurred while loading this component.
                    </Alert>
                    <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                        {error?.message || 'Unknown error'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => this.setState({ hasError: false })}
                        >
                            Try Again
                        </Button>
                    </Box>
                </Paper>
            );
        }

        return children;
    }
}

export default ErrorBoundary;
