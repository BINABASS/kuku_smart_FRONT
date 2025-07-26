import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

// Mock users (replace with actual API calls in production)
const mockUsers = {
    'admin@poultryfarm.com': {
        email: 'admin@poultryfarm.com',
        password: 'admin123',
        role: 'admin',
        name: 'Farm Administrator',
        subscription: 'premium',
        permissions: {
            canViewAllFarms: true,
            canManageAllFarms: true,
            canManageFarmers: true,
            canManageDevices: true,
            canManageBatches: true,
            canManageBreeds: true,
            canManageInventory: true,
            canManageReports: true,
            canManageFinancials: true,
            canManageSettings: true,
            canCreateFarmerAccount: true,
            canManageFarmerAccounts: true
        }
    },
    'manager@poultryfarm.com': {
        email: 'manager@poultryfarm.com',
        password: 'manager123',
        role: 'manager',
        name: 'Farm Manager',
        farmName: 'Green Pastures',
        farmLocation: 'Rural Area',
        farmSize: '100 acres',
        subscription: 'premium',
        permissions: {
            canViewAllFarms: false,
            canManageAllFarms: false,
            canManageOwnFarm: true,
            managedFarm: 'Green Pastures',
            canManageDevices: true,
            canManageBatches: true,
            canManageBreeds: true,
            canManageInventory: true,
            canManageReports: true,
            canManageFinancials: true,
            canManageSettings: false,
            canCreateFarmerAccount: false,
            canManageFarmerAccounts: false
        }
    },
    'farmer1@poultryfarm.com': {
        email: 'farmer1@poultryfarm.com',
        password: 'farmer123',
        role: 'farmer',
        name: 'John Smith',
        farmName: 'Smith Farms',
        farmLocation: 'Western Region',
        farmSize: '50 acres',
        subscription: 'basic',
        permissions: {
            canViewAllFarms: false,
            canManageAllFarms: false,
            canManageOwnFarm: true,
            managedFarm: 'Smith Farms',
            canManageDevices: true,
            canManageBatches: true,
            canManageBreeds: true,
            canManageInventory: true,
            canManageReports: true,
            canManageFinancials: true,
            canManageSettings: false
        }
    }
};

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
            // In production, replace this with actual API call
            const user = mockUsers[credentials.email];
            if (!user || user.password !== credentials.password) {
                throw new Error('Invalid credentials');
            }
            
            // Simulate token (in production, this would come from the API)
            const token = `token_${Math.random().toString(36).substr(2, 9)}`;
            
            return {
                ...user,
                token
            };
        } catch (error) {
            return rejectWithValue(error.message);
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
                case 'farmer':
                    if (!userData.farmName || !userData.farmSize) {
                        errorMessage = 'Farm name and farm size are required for farmer registration';
                    }
                    break;
                default:
                    throw new Error('Invalid role');
            }

            if (errorMessage) {
                throw new Error(errorMessage);
            }

            // In production, this would be an API call to register the user
            const token = `token_${Math.random().toString(36).substr(2, 9)}`;
            
            return {
                ...userData,
                token,
                id: Date.now(), // Simulated ID
                created_at: new Date().toISOString(),
                subscription: 'basic' // Default subscription for new users
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export default authSlice.reducer;
