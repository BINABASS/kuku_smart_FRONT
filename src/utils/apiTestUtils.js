import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export function setupAuthMocks() {
    const mock = new MockAdapter(axios);
    
    // Mock login endpoint
    mock.onPost('http://localhost:8000/api/auth/login/').reply((config) => {
        const { username, password } = JSON.parse(config.data);
        if (username === 'test' && password === 'test') {
            return [200, {
                token: 'test-token',
                user: {
                    id: 1,
                    username: 'test',
                    email: 'test@example.com'
                }
            }];
        }
        return [401, { detail: 'Invalid credentials' }];
    });

    // Mock register endpoint
    mock.onPost('http://localhost:8000/api/auth/register/').reply(201, {
        token: 'test-token',
        user: {
            id: 1,
            username: 'test',
            email: 'test@example.com'
        }
    });

    // Mock profile endpoint
    mock.onGet('http://localhost:8000/api/auth/profile/').reply(200, {
        id: 1,
        username: 'test',
        email: 'test@example.com'
    });

    return mock;
}
