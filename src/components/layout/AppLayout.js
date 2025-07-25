import React from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import Farmers from '../../pages/admin/Farmers';
import BatchesPage from '../../pages/Batches';
import BreedsPage from '../../pages/Breeds';
import Sidebar from '../admin/Sidebar';
import PaymentsPage from '../../pages/Payments';
import AnalyticsPage from '../../pages/Analytics';
import FinancialsPage from '../../pages/Financials';
import DevicesPage from '../../pages/Devices';
import SensorsPage from '../../pages/Sensors';
import ActivitiesPage from '../../pages/Activities';
import FeedingsPage from '../../pages/Feedings';
import SubscriptionsPage from '../../pages/Subscriptions';
import Users from '../../pages/Users';
import Inventory from '../../pages/Inventory';
import Notifications from '../../pages/Notifications';
import AIInsights from '../../pages/AIInsights';
import Reports from '../../pages/Reports';

const drawerWidth = 240;



const AppLayout = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };



    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    // zIndex: (theme) => theme.zIndex.drawer + 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    left: { sm: `${drawerWidth}px` },
                    borderLeft: { sm: '1px solid #263238' }, // subtle border for clarity
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Kuku Smart
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                        color="inherit"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                        <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => dispatch(logout())}>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Only render the correct sidebar for the screen size */}
                {isDesktop ? (
                    <Sidebar variant="permanent" onClose={() => {}} />
                ) : (
                    <Sidebar open={mobileOpen} onClose={handleDrawerToggle} variant="temporary" />
                )}
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    bgcolor: 'background.default',
                    minHeight: '100vh',
                }}
            >
                <Toolbar />
                <Routes>
                    <Route path="" element={<Dashboard />} />
                    <Route path="farmers" element={<Farmers />} />
                    <Route path="batches" element={<BatchesPage />} />
                    <Route path="breeds" element={<BreedsPage />} />
                    <Route path="activities" element={<ActivitiesPage />} />
                    <Route path="feeding" element={<FeedingsPage />} />
                    <Route path="sensors" element={<SensorsPage />} />
                    <Route path="devices/*" element={<DevicesPage />} />
                    <Route path="subscription" element={<SubscriptionsPage />} />
                    <Route path="payments" element={<PaymentsPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="financials" element={<FinancialsPage />} />
                    <Route path="users" element={<Users />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="ai-insights" element={<AIInsights />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="*" element={<Dashboard />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default AppLayout;
