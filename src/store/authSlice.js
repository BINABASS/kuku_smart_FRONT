import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api'; // Added missing import

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

// Note: Authentication now uses real API calls instead of mock data

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('token');
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, setUser, setError } = authSlice.actions;

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login/', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            // Validate role-specific requirements
            const role = userData.role;
            let errorMessage;
            
            switch (role) {
                case 'admin':
                    if (!userData.farmName || !userData.position) {
                        errorMessage = 'Farm name and position are required for admin registration';
                    }
                    break;
                case 'manager':
                    if (!userData.farmName || !userData.department) {
                        errorMessage = 'Farm name and department are required for manager registration';
                    }
                    break;
                default:
                    throw new Error('Invalid role');
            }

            if (errorMessage) {
                throw new Error(errorMessage);
            }

            // In production, this would be an API call to register the user
            const response = await api.post('/auth/register/', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export default authSlice.reducer;