import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    CardMedia,
    Paper,
    useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
    LockOutlined,
    PersonAdd,
    ProductionQuantityLimits,
    Analytics,
    Settings
} from '@mui/icons-material';

const Welcome = () => {
    const theme = useTheme();
    const features = [
        {
            title: 'Smart Farm Management',
            description: 'Efficiently manage your poultry farm with real-time monitoring and analytics',
            icon: <ProductionQuantityLimits sx={{ fontSize: 40 }} />,
            image: 'https://via.placeholder.com/400x300/007bff/ffffff?text=Farm+Management'
        },
        {
            title: 'Data Analytics',
            description: 'Get insights into your farm\'s performance with comprehensive analytics',
            icon: <Analytics sx={{ fontSize: 40 }} />,
            image: 'https://via.placeholder.com/400x300/28a745/ffffff?text=Data+Analytics'
        },
        {
            title: 'User Management',
            description: 'Manage multiple users with different access levels',
            icon: <Settings sx={{ fontSize: 40 }} />,
            image: 'https://via.placeholder.com/400x300/17a2b8/ffffff?text=User+Management'
        }
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            pt: 8,
            pb: 4
        }}>
            <Box sx={{
                bgcolor: 'white',
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: 800,
                mx: 'auto',
                mb: 8,
                textAlign: 'center'
            }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Welcome to Smart Poultry Farm Management
                </Typography>
                <Typography variant="h6" color="text.secondary" mb={4}>
                    Modern poultry farm management system with real-time monitoring and analytics
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<LockOutlined />}
                        component={RouterLink}
                        to="/login"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5
                        }}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<PersonAdd />}
                        component={RouterLink}
                        to="/register"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5
                        }}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
            <Container maxWidth="lg">
                <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
                    Key Features
                </Typography>
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 2,
                                    borderRadius: 2,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={feature.image}
                                    alt={feature.title}
                                    sx={{ borderRadius: '8px', mb: 2 }}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    {feature.icon}
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        sx={{
                                            ml: 2,
                                            fontWeight: 'bold',
                                            color: theme.palette.primary.main
                                        }}
                                    >
                                        {feature.title}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        fontSize: '1rem',
                                        lineHeight: 1.6
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Welcome;
