import React from 'react';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Storage as StorageIcon,
    Receipt as ReceiptIcon,
    Assessment as AssessmentIcon,
    AccountBalance as AccountBalanceIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

const AdminMenu = ({ onNavigate }) => {
    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/admin/dashboard'
        },
        {
            text: 'User Management',
            icon: <PeopleIcon />,
            path: '/admin/users',
            subItems: [
                { text: 'Managers', path: '/admin/managers' },
                { text: 'Managers', path: '/admin/managers' }
            ]
        },
        {
            text: 'Farm Management',
            icon: <StorageIcon />,
            path: '/admin/farms',
            subItems: [
                { text: 'Batches', path: '/admin/batches' },
                { text: 'Breeds', path: '/admin/breeds' },
                { text: 'Inventory', path: '/admin/inventory' }
            ]
        },
        {
            text: 'Analytics',
            icon: <AssessmentIcon />,
            path: '/admin/analytics',
            subItems: [
                { text: 'Reports', path: '/admin/reports' },
                { text: 'Financials', path: '/admin/financials' }
            ]
        },
        {
            text: 'System',
            icon: <SettingsIcon />,
            path: '/admin/system',
            subItems: [
                { text: 'Settings', path: '/admin/settings' },
                { text: 'Audit Logs', path: '/admin/audit-logs' }
            ]
        }
    ];

    return (
        <Box sx={{ width: 250 }}>
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => onNavigate(item.path)}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default AdminMenu;
