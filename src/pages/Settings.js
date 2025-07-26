import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const Settings = () => {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            sms: false,
            push: true,
        },
        system: {
            autoBackup: true,
            dataRetention: 30,
            maintenanceMode: false,
        },
        alerts: {
            temperature: true,
            humidity: true,
            feed: true,
            water: true,
            disease: true,
        },
        display: {
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
        },
    });

    const [saved, setSaved] = useState(false);

    const handleSettingChange = (category, setting, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: value,
            },
        }));
    };

    const handleSave = () => {
        // In a real app, this would save to the backend
        console.log('Saving settings:', settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                System Settings
            </Typography>

            {saved && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Settings saved successfully!
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Notifications Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Notifications
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.notifications.email}
                                        onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                                    />
                                }
                                label="Email Notifications"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.notifications.sms}
                                        onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                                    />
                                }
                                label="SMS Notifications"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.notifications.push}
                                        onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                                    />
                                }
                                label="Push Notifications"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* System Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                System
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.system.autoBackup}
                                        onChange={(e) => handleSettingChange('system', 'autoBackup', e.target.checked)}
                                    />
                                }
                                label="Auto Backup"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.system.maintenanceMode}
                                        onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                                    />
                                }
                                label="Maintenance Mode"
                            />
                            <TextField
                                fullWidth
                                label="Data Retention (days)"
                                type="number"
                                value={settings.system.dataRetention}
                                onChange={(e) => handleSettingChange('system', 'dataRetention', parseInt(e.target.value))}
                                sx={{ mt: 2 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Alert Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Alert Settings
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.alerts.temperature}
                                        onChange={(e) => handleSettingChange('alerts', 'temperature', e.target.checked)}
                                    />
                                }
                                label="Temperature Alerts"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.alerts.humidity}
                                        onChange={(e) => handleSettingChange('alerts', 'humidity', e.target.checked)}
                                    />
                                }
                                label="Humidity Alerts"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.alerts.feed}
                                        onChange={(e) => handleSettingChange('alerts', 'feed', e.target.checked)}
                                    />
                                }
                                label="Feed Alerts"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.alerts.water}
                                        onChange={(e) => handleSettingChange('alerts', 'water', e.target.checked)}
                                    />
                                }
                                label="Water Alerts"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.alerts.disease}
                                        onChange={(e) => handleSettingChange('alerts', 'disease', e.target.checked)}
                                    />
                                }
                                label="Disease Alerts"
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Display Settings */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Display Settings
                            </Typography>
                            <TextField
                                fullWidth
                                select
                                label="Theme"
                                value={settings.display.theme}
                                onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                                sx={{ mb: 2 }}
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto</option>
                            </TextField>
                            <TextField
                                fullWidth
                                select
                                label="Language"
                                value={settings.display.language}
                                onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                                sx={{ mb: 2 }}
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                            </TextField>
                            <TextField
                                fullWidth
                                select
                                label="Timezone"
                                value={settings.display.timezone}
                                onChange={(e) => handleSettingChange('display', 'timezone', e.target.value)}
                            >
                                <option value="UTC">UTC</option>
                                <option value="EST">Eastern Time</option>
                                <option value="PST">Pacific Time</option>
                            </TextField>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Save Button */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            size="large"
                        >
                            Save Settings
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings; 