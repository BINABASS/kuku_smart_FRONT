import { useSelector } from 'react-redux';

export const useRoleGuard = (requiredRole, requiredSubscription = null, farmName = null) => {
    const user = useSelector(state => state.auth.user);
    
    // Check if user is authenticated
    if (!user) {
        return false;
    }

    // Define role permissions
    const rolePermissions = {
        'admin': {
            canManageAll: true,
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
        },
        'manager': {
            canManageAll: false,
            canManageFarmers: false,
            canManageDevices: true,
            canManageBatches: true,
            canManageBreeds: true,
            canManageInventory: true,
            canManageReports: true,
            canManageFinancials: true,
            canManageSettings: false,
            canCreateFarmerAccount: false,
            canManageFarmerAccounts: false
        },
        'farmer': {
            canManageAll: false,
            canManageFarmers: false,
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
    };

    // Check if user has a valid role
    if (!rolePermissions[user.role]) {
        return false;
    }

    // Check if user has the required permission
    if (requiredRole && !rolePermissions[user.role][`can${requiredRole}`]) {
        return false;
    }

    // Check if user has access to the specific farm
    if (farmName) {
        if (user.role === 'admin') {
            // Admin can access all farms
            return true;
        }
        
        // Manager and farmer can only access their own farm
        if (user.role === 'manager' || user.role === 'farmer') {
            return user.permissions?.managedFarm === farmName;
        }
    }

    // Check subscription level if required
    if (requiredSubscription) {
        const subscriptionHierarchy = {
            'premium': 2,
            'basic': 1
        };

        if (subscriptionHierarchy[user.subscription] < subscriptionHierarchy[requiredSubscription]) {
            return false;
        }
    }

    return true;
};

// Custom hook to check if user can access a specific farm
export const useCanAccessFarm = (farmName) => {
    const user = useSelector(state => state.auth.user);
    
    if (!user) return false;
    
    if (user.role === 'admin') {
        return true;
    }
    
    return user.permissions?.managedFarm === farmName;
};

// Export helper functions for common roles
export const useAdminGuard = () => {
    const user = useSelector(state => state.auth.user);
    return user && user.role === 'admin';
};

export const useManagerGuard = () => {
    const user = useSelector(state => state.auth.user);
    return user && (user.role === 'admin' || user.role === 'manager');
};

export const useFarmerGuard = () => {
    const user = useSelector(state => state.auth.user);
    return user && (user.role === 'admin' || user.role === 'manager' || user.role === 'farmer');
};

// Export helper functions for subscription levels
export const usePremiumGuard = () => useRoleGuard(null, 'premium');
export const useBasicGuard = () => useRoleGuard(null, 'basic');
