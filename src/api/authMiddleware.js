// Note: addNotification is now handled through the NotificationProvider context
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const token = localStorage.getItem('token');

        // Check if token exists and is valid
        if (!token) {
            console.warn('Please login to continue');
            navigate('/login');
            return null;
        }

        // Check token expiration
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = decodedToken.exp * 1000;
            const currentTime = Date.now();

            if (currentTime > expirationTime) {
                dispatch(logout());
                console.warn('Session expired. Please login again.');
                navigate('/login');
                return null;
            }
        } catch (error) {
            dispatch(logout());
            console.error('Invalid token. Please login again.');
            navigate('/login');
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
