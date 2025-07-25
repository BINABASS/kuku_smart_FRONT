import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    Avatar,
    Stack,
    Tooltip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Pets as PetsIcon,
    Business as BusinessIcon,
    Settings as SettingsIcon,
    Devices as DevicesIcon,
    SensorOccupied as SensorIcon,
    Receipt as ReceiptIcon,
    AccountBalance as AccountIcon,
    Money as MoneyIcon,
    AccountCircle as AccountCircleIcon,
    Star as StarIcon,
    BarChart as BarChartIcon,
    Assignment as AssignmentIcon,
    Feed as FeedIcon,
    Notifications as NotificationsIcon,
    Inventory as InventoryIcon,
    SmartToy as SmartToyIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const sidebarSections = [
    {
        header: 'Overview',
        items: [
            { text: 'Dashboard', icon: <DashboardIcon />, path: '', tooltip: 'Dashboard overview' },
        ],
    },
    {
        header: 'Management',
        items: [
            { text: 'Farmers', icon: <PeopleIcon />, path: 'farmers', tooltip: 'Manage farmers' },
            { text: 'Batches', icon: <BusinessIcon />, path: 'batches', tooltip: 'Manage batches' },
            { text: 'Breeds', icon: <PetsIcon />, path: 'breeds', tooltip: 'Manage breeds' },
            { text: 'Activities', icon: <AssignmentIcon />, path: 'activities', tooltip: 'Schedule and track activities' },
            { text: 'Feeding', icon: <FeedIcon />, path: 'feeding', tooltip: 'Feeding schedules' },
        ],
    },
    {
        header: 'Devices & Sensors',
        items: [
            { text: 'Devices', icon: <DevicesIcon />, path: 'devices', tooltip: 'Manage devices' },
            { text: 'Sensors', icon: <SensorIcon />, path: 'sensors', tooltip: 'View sensor data' },
        ],
    },
    {
        header: 'Subscriptions',
        items: [
            { text: 'Subscription', icon: <ReceiptIcon />, path: 'subscription', tooltip: 'Manage subscriptions', premium: true },
            { text: 'Payments', icon: <MoneyIcon />, path: 'payments', tooltip: 'Payments and billing', premium: true },
        ],
    },
    {
        header: 'Analytics & Reports',
        items: [
            { text: 'Analytics', icon: <BarChartIcon />, path: 'analytics', tooltip: 'Farm analytics', premium: true },
            { text: 'Financials', icon: <AccountIcon />, path: 'financials', tooltip: 'Financial reports', premium: true },
        ],
    },
    {
        header: 'User & Inventory',
        items: [
            { text: 'Users', icon: <PeopleIcon />, path: 'users', tooltip: 'Manage users', adminOnly: true },
            { text: 'Inventory', icon: <InventoryIcon />, path: 'inventory', tooltip: 'Manage inventory/resources' },
        ],
    },
    {
        header: 'Notifications & AI',
        items: [
            { text: 'Notifications', icon: <NotificationsIcon />, path: 'notifications', tooltip: 'View alerts and notifications' },
            { text: 'AI Insights', icon: <SmartToyIcon />, path: 'ai-insights', tooltip: 'AI-driven analytics and predictions', premium: true },
        ],
    },
    {
        header: 'Reports',
        items: [
            { text: 'Reports', icon: <AssessmentIcon />, path: 'reports', tooltip: 'Download or view reports', premium: true },
        ],
    },
    {
        header: 'Settings',
        items: [
            { text: 'System Settings', icon: <SettingsIcon />, path: 'settings', tooltip: 'System configuration' },
        ],
    },
];

const Sidebar = ({ open, onClose = () => {}, variant = 'permanent' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(state => state.auth.user);
    const userRole = user?.role || 'guest';
    const isPremium = userRole === 'admin' || userRole === 'premium';

    const isActive = (path) => {
        return location.pathname === `/dashboard${path ? `/${path}` : ''}`;
    };

    const handleNavigation = (path) => {
        navigate(`/dashboard${path ? `/${path}` : ''}`);
        onClose();
    };

    return (
        <Drawer
            variant={variant}
            anchor="left"
            open={variant === 'temporary' ? open : true}
            onClose={onClose}
            sx={{
                display: { xs: variant === 'temporary' ? 'block' : 'none', sm: 'block' },
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: 270,
                    height: '100vh',
                    background: 'linear-gradient(135deg, #283e51 0%, #485563 100%)',
                    color: 'white',
                    borderBottomRightRadius: 24,
                    boxShadow: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
                {/* Logo/Branding */}
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 2, pb: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 'bold', fontSize: 22 }}>K</Avatar>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}>
                        Kuku Smart
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 1, background: 'rgba(255,255,255,0.15)' }} />
                <Box sx={{ flex: '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
                    {sidebarSections.map((section, idx) => (
                        <Box key={section.header} sx={{ mb: 0.5 }}>
                            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', pl: 2, fontWeight: 700, letterSpacing: 1, fontSize: 12 }}>
                                {section.header}
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                                {section.items
                                    .filter(item => {
                                        if (item.adminOnly && userRole !== 'admin') return false;
                                        if (item.premium && !isPremium) return false;
                                        return true;
                                    })
                                    .map((item) => (
                                        <Tooltip title={item.tooltip} placement="right" arrow key={item.text}>
                                            <ListItem
                                                button
                                                onClick={() => handleNavigation(item.path)}
                                                sx={{
                                                    my: 0.25,
                                                    mx: 0.5,
                                                    borderRadius: 2,
                                                    minHeight: 36,
                                                    transition: 'background 0.2s',
                                                    '&.Mui-selected, &:hover': {
                                                        background: item.premium
                                                            ? 'linear-gradient(90deg, #FFD700 0%, #FFB300 100%)'
                                                            : 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                                                        color: 'white',
                                                        boxShadow: 2,
                                                    },
                                                    '&.Mui-selected .MuiListItemIcon-root, &:hover .MuiListItemIcon-root': {
                                                        color: 'white',
                                                    },
                                                }}
                                                selected={isActive(item.path)}
                                            >
                                                <ListItemIcon sx={{ color: item.premium ? '#FFD700' : 'rgba(255,255,255,0.8)', minWidth: 32 }}>
                                                    {item.icon}
                                                    {item.premium && <StarIcon fontSize="small" sx={{ ml: 0.5 }} />}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.text}
                                                    primaryTypographyProps={{
                                                        fontWeight: isActive(item.path) ? 700 : 500,
                                                        fontSize: 15,
                                                    }}
                                                />
                                            </ListItem>
                                        </Tooltip>
                                    ))}
                            </List>
                            {idx < sidebarSections.length - 1 && <Divider sx={{ mb: 0.5, background: 'rgba(255,255,255,0.08)' }} />}
                        </Box>
                    ))}
                </Box>
            </Box>
            {/* User Profile Section */}
            <Box sx={{ p: 2, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                        <AccountCircleIcon fontSize="medium" />
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, fontSize: 15 }}>
                            {user?.name || 'User'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                            {user?.email || 'user@kuku.com'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
