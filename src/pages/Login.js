import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    Container,
    Avatar,
    CssBaseline,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Link
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LockOutlined } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const result = await dispatch(login(formData));
            if (login.fulfilled.match(result)) {
                dispatch({
                    type: 'auth/setUser',
                    payload: result.payload
                });
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{
            height: 'fit-content',
            minHeight: 'auto'
        }}>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                    p: 4,
                    width: '100%',
                    maxWidth: 600,
                }}
            >
                <Avatar
                    sx={{
                        m: 1,
                        bgcolor: 'primary.main',
                        width: 64,
                        height: 64,
                        boxShadow: 3,
                    }}
                >
                    <LockOutlined />
                </Avatar>
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        mt: 2,
                        mb: 1,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: 'primary.main',
                    }}
                >
                    Sign in
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        mb: 3,
                        textAlign: 'center',
                        color: 'text.secondary',
                    }}
                >
                    Welcome back! Please enter your credentials
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    <FormControl margin="normal" fullWidth>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            value={formData.role}
                            label="Role"
                            onChange={handleChange}
                            name="role"
                        >
                            <MenuItem value="admin">Farm Administrator</MenuItem>
                            <MenuItem value="manager">Farm Manager</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Don't have an account?{' '}
                        <Link component={RouterLink} to="/register" sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 'medium',
                            '&:hover': {
                                textDecoration: 'underline',
                                color: 'primary.dark'
                            }
                        }}>
                            Register
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
