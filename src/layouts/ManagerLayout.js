import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import ManagerMenu from '../components/navigation/ManagerMenu';
import { useManagerGuard } from '../utils/rbacMiddleware';

const ManagerLayout = ({ children }) => {
    const navigate = useNavigate();
    const isManager = useManagerGuard();
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    if (!isManager) {
        navigate('/login');
        return null;
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile menu button */}
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={toggleDrawer(true)}
                sx={{ ml: 2, display: { sm: 'none' } }}
            >
                <MenuIcon />
            </IconButton>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
                open
            >
                <ManagerMenu />
            </Drawer>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{ display: { sm: 'none' } }}
            >
                <ManagerMenu />
            </Drawer>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - 240px)` },
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default ManagerLayout;
