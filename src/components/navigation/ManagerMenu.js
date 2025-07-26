import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import {
    People as PeopleIcon,
    Pets as PetsIcon,
    Settings as SettingsIcon,
    Analytics as AnalyticsIcon,
    Receipt as ReceiptIcon,
    Storage as StorageIcon,
    Assessment as AssessmentIcon,
    AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useManagerGuard } from '../../utils/rbacMiddleware';

const ManagerMenu = () => {
    const navigate = useNavigate();
    const isManager = useManagerGuard();

    if (!isManager) {
        return null;
    }

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <PetsIcon />,
            path: '/manager/dashboard'
        },
        {
            text: 'Batches',
            icon: <PetsIcon />,
            path: '/manager/batches'
        },
        {
            text: 'Breeds',
            icon: <StorageIcon />,
            path: '/manager/breeds'
        },
        {
            text: 'Inventory',
            icon: <ReceiptIcon />,
            path: '/manager/inventory'
        },
        {
            text: 'Reports',
            icon: <AssessmentIcon />,
            path: '/manager/reports'
        },
        {
            text: 'Financials',
            icon: <AccountBalanceIcon />,
            path: '/manager/financials'
        }
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ p: 2, mb: 2 }}>
                Manager Menu
            </Typography>
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ManagerMenu;
