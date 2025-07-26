import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    ListItem,
    ListItemText,
    Divider,
    List,
    Button,
} from '@mui/material';
import {
    Pets as PetsIcon,
    Assessment as AssessmentIcon,
    Storage as StorageIcon,
    Receipt as ReceiptIcon,
    Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useManagerGuard } from '../utils/rbacMiddleware';

const ManagerDashboard = () => {
    const isManager = useManagerGuard();

    if (!isManager) {
        return <div>You do not have permission to access this page</div>;
    }

    // Manager-specific stats
    const stats = {
        farmName: 'Green Pastures',
        farmSize: 'Medium',
        totalBatches: 10,
        activeBatches: 8,
        totalBirds: 5000,
        mortalityRate: '2.5%',
        recentAlerts: 5,
        alerts: [
            { id: 1, type: 'Environment', message: 'High temperature alert', timestamp: '2025-07-25' },
            { id: 2, type: 'Feed', message: 'Low feed stock alert', timestamp: '2025-07-25' },
            { id: 3, type: 'Water', message: 'Water level low', timestamp: '2025-07-25' }
        ],
        upcomingTasks: [
            { id: 1, task: 'Vaccination', dueDate: '2025-07-28', status: 'Pending' },
            { id: 2, task: 'Clean water lines', dueDate: '2025-07-26', status: 'Pending' },
            { id: 3, task: 'Check feeders', dueDate: '2025-07-27', status: 'Pending' }
        ]
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Overview Cards */}
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <PetsIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Farm Overview
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                {stats.farmName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Farm Size: {stats.farmSize}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <PetsIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Batches
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                {stats.totalBatches}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active: {stats.activeBatches}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <PetsIcon />
                                </Avatar>
                                <Typography variant="h6">
                                    Birds
                                </Typography>
                            </Box>
                            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                                {stats.totalBirds}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Mortality Rate: {stats.mortalityRate}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Alerts Section */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 3 }}>
                                Recent Alerts
                            </Typography>
                            <List>
                                {stats.alerts.map((alert) => (
                                    <React.Fragment key={alert.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={alert.message}
                                                secondary={alert.timestamp}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Upcoming Tasks Section */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 3 }}>
                                Upcoming Tasks
                            </Typography>
                            <List>
                                {stats.upcomingTasks.map((task) => (
                                    <React.Fragment key={task.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={task.task}
                                                secondary={`Due Date: ${task.dueDate}, Status: ${task.status}`}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 3 }}>
                                Quick Actions
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<PetsIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        Add New Batch
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<AnalyticsIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        Generate Report
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<ReceiptIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        Financial Overview
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<AssessmentIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        View Breeds
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<StorageIcon />}
                                        sx={{ mb: 2 }}
                                    >
                                        Add New Breed
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ManagerDashboard;
