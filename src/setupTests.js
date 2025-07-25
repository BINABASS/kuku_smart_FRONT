import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }))
});

// Mock IntersectionObserver
window.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Mock notification function
jest.mock('./components/Notification', () => ({
    addNotification: jest.fn()
}));

// Mock dispatch
jest.mock('react-redux', () => ({
    useDispatch: () => jest.fn(),
    useSelector: (selector) => selector({
        auth: { token: null },
        // Add other state slices as needed
    })
}));

// Mock navigation
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
    useParams: () => ({
        id: 'test-id'
    }),
    useLocation: jest.fn()
}));

// Mock axios
jest.mock('axios', () => {
    const axios = {
        create: jest.fn(() => axios),
        interceptors: {
            request: {
                use: jest.fn(),
                eject: jest.fn()
            },
            response: {
                use: jest.fn(),
                eject: jest.fn()
            }
        },
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        defaults: {
            headers: {
                common: {}
            }
        }
    };
    return axios;
});
