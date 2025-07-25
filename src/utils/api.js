import axios from 'axios';
import { getMockSensors, getMockDevices, getMockSubscriptions, getMockSubscriptionPlans } from './mockApi';

// Create API instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export the API instance
export default api;

// Mock data handlers
api.get = async (endpoint) => {
  if (endpoint === '/sensors') {
    return Promise.resolve({ data: getMockSensors() });
  } else if (endpoint.startsWith('/sensors/')) {
    const id = endpoint.split('/')[2];
    const sensor = getMockSensors().find(s => s.id === id);
    return Promise.resolve({ data: sensor });
  } else if (endpoint === '/devices') {
    return Promise.resolve({ data: getMockDevices() });
  } else if (endpoint.startsWith('/devices/')) {
    const id = endpoint.split('/')[2];
    const device = getMockDevices().find(d => d.id === id);
    return Promise.resolve({ data: device });
  } else if (endpoint === '/subscriptions') {
    return Promise.resolve({ data: getMockSubscriptions() });
  } else if (endpoint.startsWith('/subscriptions/')) {
    const id = endpoint.split('/')[2];
    const subscription = getMockSubscriptions().find(s => s.id === id);
    return Promise.resolve({ data: subscription });
  } else if (endpoint === '/subscription-plans') {
    return Promise.resolve({ data: getMockSubscriptionPlans() });
  } else if (endpoint.startsWith('/subscription-plans/')) {
    const id = endpoint.split('/')[2];
    const plan = getMockSubscriptionPlans().find(p => p.id === id);
    return Promise.resolve({ data: plan });
  }
  return Promise.reject(new Error('Endpoint not implemented'));
};

api.post = async (endpoint, data) => {
  if (endpoint === '/devices') {
    const newDevice = { ...data, id: 'device' + (getMockDevices().length + 1) };
    return Promise.resolve({ data: newDevice });
  } else if (endpoint === '/subscriptions') {
    const newSubscription = {
      ...data,
      id: 'sub' + (getMockSubscriptions().length + 1),
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      renewalDate: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: 'pending'
    };
    return Promise.resolve({ data: newSubscription });
  }
  return Promise.reject(new Error('Endpoint not implemented'));
};

api.put = async (endpoint, data) => {
  if (endpoint.startsWith('/devices/')) {
    const id = endpoint.split('/')[2];
    const devices = getMockDevices();
    const index = devices.findIndex(d => d.id === id);
    if (index !== -1) {
      devices[index] = { ...devices[index], ...data };
      return Promise.resolve({ data: devices[index] });
    }
  } else if (endpoint.startsWith('/subscriptions/')) {
    const id = endpoint.split('/')[2];
    const subscriptions = getMockSubscriptions();
    const index = subscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
      subscriptions[index] = { ...subscriptions[index], ...data };
      return Promise.resolve({ data: subscriptions[index] });
    }
  }
  return Promise.reject(new Error('Endpoint not implemented'));
};

api.delete = async (endpoint) => {
  if (endpoint.startsWith('/devices/')) {
    const id = endpoint.split('/')[2];
    const devices = getMockDevices();
    const index = devices.findIndex(d => d.id === id);
    if (index !== -1) {
      devices.splice(index, 1);
      return Promise.resolve({ data: { id } });
    }
  } else if (endpoint.startsWith('/subscriptions/')) {
    const id = endpoint.split('/')[2];
    const subscriptions = getMockSubscriptions();
    const index = subscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
      subscriptions.splice(index, 1);
      return Promise.resolve({ data: { id } });
    }
  }
  return Promise.reject(new Error('Endpoint not implemented'));
};

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Override API methods with mock data
api.get = async (endpoint) => {
  if (endpoint === '/sensors') {
    return Promise.resolve({ data: getMockSensors() });
  } else if (endpoint.startsWith('/sensors/')) {
    const id = endpoint.split('/')[2];
    const sensor = getMockSensors().find(s => s.id === id);
    return Promise.resolve({ data: sensor });
  } else if (endpoint === '/devices') {
    return Promise.resolve({ data: getMockDevices() });
  } else if (endpoint.startsWith('/devices/')) {
    const id = endpoint.split('/')[2];
    const device = getMockDevices().find(d => d.id === id);
    return Promise.resolve({ data: device });
  } else if (endpoint === '/subscriptions') {
    return Promise.resolve({ data: getMockSubscriptions() });
  } else if (endpoint.startsWith('/subscriptions/')) {
    const id = endpoint.split('/')[2];
    const subscription = getMockSubscriptions().find(s => s.id === id);
    return Promise.resolve({ data: subscription });
  } else if (endpoint === '/subscription-plans') {
    return Promise.resolve({ data: getMockSubscriptionPlans() });
  } else if (endpoint.startsWith('/subscription-plans/')) {
    const id = endpoint.split('/')[2];
    const plan = getMockSubscriptionPlans().find(p => p.id === id);
    return Promise.resolve({ data: plan });
  }
  return Promise.reject(new Error('Endpoint not implemented'));
};

api.post = async (endpoint, data) => {
  if (endpoint === '/devices') {
    const newDevice = { ...data, id: 'device' + (getMockDevices().length + 1) };
    return Promise.resolve({ data: newDevice });
  } else if (endpoint === '/subscriptions') {
    const newSubscription = {
      ...data,
      id: 'sub' + (getMockSubscriptions().length + 1),
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      renewalDate: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: 'pending'
    };
    return Promise.resolve({ data: newSubscription });
  }
  return Promise.reject(new Error('Endpoint not implemented'));
};

api.put = async (endpoint, data) => {
  if (endpoint.startsWith('/devices/')) {
    const id = endpoint.split('/')[2];
    const devices = getMockDevices();
    const index = devices.findIndex(d => d.id === id);
    if (index !== -1) {
      devices[index] = { ...devices[index], ...data };
      return Promise.resolve({ data: devices[index] });
    }
  } else if (endpoint.startsWith('/subscriptions/')) {
    const id = endpoint.split('/')[2];
    const subscriptions = getMockSubscriptions();
    const index = subscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
      subscriptions[index] = { ...subscriptions[index], ...data };
      return Promise.resolve({ data: subscriptions[index] });
    }
  }
  return Promise.reject(new Error('Endpoint not implemented'));
};

api.delete = async (endpoint) => {
  if (endpoint.startsWith('/devices/')) {
    const id = endpoint.split('/')[2];
    return Promise.resolve({ data: id });
  } else if (endpoint.startsWith('/subscriptions/')) {
    const id = endpoint.split('/')[2];
    return Promise.resolve({ data: id });
  }
  return Promise.reject(new Error('Endpoint not implemented'));
};
