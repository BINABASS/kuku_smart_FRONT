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
    Pets as PetsIcon,
    Water as WaterIcon,
    LocalDining as LocalDiningIcon,
    Warning as WarningIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { useFarmerGuard } from '../../utils/rbacMiddleware';

const FarmerMenu = () => {
    const navigate = useNavigate();
    const isFarmer = useFarmerGuard();

    if (!isFarmer) {
        return null;
    }

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <PetsIcon />,
            path: '/farmer/dashboard'
        },
        {
            text: 'Flocks',
            icon: <PetsIcon />,
            path: '/farmer/flocks'
        },
        {
            text: 'Feed Management',
            icon: <LocalDiningIcon />,
            path: '/farmer/feed'
        },
        {
            text: 'Water Management',
            icon: <WaterIcon />,
            path: '/farmer/water'
        },
        {
            text: 'Alerts',
            icon: <WarningIcon />,
            path: '/farmer/alerts'
        },
        {
            text: 'Settings',
            icon: <SettingsIcon />,
            path: '/farmer/settings'
        }
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ p: 2, mb: 2 }}>
                Farmer Menu
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

export default FarmerMenu;
