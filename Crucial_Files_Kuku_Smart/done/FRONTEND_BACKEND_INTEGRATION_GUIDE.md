# 🚀 Frontend-Backend Integration Guide

## 📋 Overview
This guide provides step-by-step instructions for integrating the Kuku Smart frontend with the backend API.

## 🔧 Prerequisites

### Backend Requirements
- ✅ Django server running on `http://localhost:8000`
- ✅ PostgreSQL database configured
- ✅ All migrations applied
- ✅ Test data created
- ✅ CORS configured for frontend

### Frontend Requirements
- ✅ React development server running on `http://localhost:3000`
- ✅ All dependencies installed
- ✅ API configuration updated

## 🚀 Integration Steps

### Step 1: Backend Setup
```bash
# Navigate to backend directory
cd backend

# Start the Django server
python manage.py runserver 8000
```

### Step 2: Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Start the React development server
npm start
```

### Step 3: Test Authentication
1. Open your browser to `http://localhost:3000`
2. Navigate to the login page
3. Use the test credentials:
   - **Admin:** `admin@poultryfarm.com` / `admin123`
   - **Manager:** `manager@poultryfarm.com` / `manager123`

## 🔐 Authentication Flow

### Expected Backend Response
```json
{
  "token": "your_token_here",
  "user": {
    "id": 1,
    "email": "admin@poultryfarm.com",
    "role": "admin",
    "name": "Farm Administrator",
    "permissions": {
      "canManageUsers": true,
      "canManageBatches": true,
      "canManageDevices": true,
      "canViewAnalytics": true,
      "canManageSubscriptions": true,
      "canManageInventory": true,
      "canManageKnowledgeBase": true,
      "canManageFinancials": true,
      "canCreateManagerAccount": true,
      "canManageManagerAccounts": true
    }
  }
}
```

### Frontend Token Storage
- Token is stored in `localStorage` as `token`
- User data is stored in `localStorage` as `user`
- Token is automatically included in API requests

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login/
POST /api/auth/register/
```

### Devices
```
GET    /api/devices/
POST   /api/devices/
GET    /api/devices/{id}/
PUT    /api/devices/{id}/
DELETE /api/devices/{id}/
```

### Sensors
```
GET    /api/sensors/
POST   /api/sensors/
GET    /api/sensors/{id}/
PUT    /api/sensors/{id}/
DELETE /api/sensors/{id}/
```

### Subscriptions
```
GET    /api/subscriptions/
POST   /api/subscriptions/
GET    /api/subscription-plans/
POST   /api/subscription-plans/
```

### Inventory
```
GET    /api/inventory/items/
POST   /api/inventory/items/
GET    /api/inventory/categories/
POST   /api/inventory/categories/
```

### Financials
```
GET    /api/financials/income/
POST   /api/financials/income/
GET    /api/financials/expenses/
POST   /api/financials/expenses/
```

### Analytics
```
GET    /api/analytics/data/
POST   /api/analytics/data/
GET    /api/analytics/dashboards/
POST   /api/analytics/dashboards/
```

## 🔧 Configuration Files

### Frontend API Configuration (`frontend/src/utils/api.js`)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Backend CORS Configuration (`backend/kuku_smart/settings.py`)
```python
CORS_ALLOW_ALL_ORIGINS = True  # For development
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
```

## 🧪 Testing Integration

### Manual Testing
1. **Login Test:**
   - Navigate to login page
   - Use test credentials
   - Verify successful login and token storage

2. **Device Management Test:**
   - Navigate to devices page
   - Verify devices are loaded from backend
   - Test device creation, editing, deletion

3. **Subscription Management Test:**
   - Navigate to subscriptions page
   - Verify subscriptions are loaded
   - Test subscription operations

### Automated Testing
```javascript
// Run in browser console
import { testBackendIntegration } from './utils/testIntegration';
testBackendIntegration();
```

## 🔍 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Symptoms:** Browser console shows CORS errors
**Solution:** Ensure backend CORS is properly configured

#### 2. Authentication Errors
**Symptoms:** 401 Unauthorized errors
**Solution:** Check token format and storage

#### 3. API Endpoint Not Found
**Symptoms:** 404 errors for API calls
**Solution:** Verify backend server is running and endpoints are correct

#### 4. Field Mapping Issues
**Symptoms:** Data not displaying correctly
**Solution:** Check field names match between frontend and backend

### Debug Commands

#### Backend Debug
```bash
# Check server status
curl http://localhost:8000/api/auth/login/

# Test authentication
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@poultryfarm.com", "password": "admin123"}'
```

#### Frontend Debug
```javascript
// Check localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));

// Test API call
fetch('http://localhost:8000/api/devices/', {
  headers: {
    'Authorization': `Token ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log);
```

## 📊 Data Flow

### 1. Authentication Flow
```
Frontend Login Form → Backend Auth API → Token Response → Store in localStorage
```

### 2. Data Fetching Flow
```
Frontend Component → Redux Action → API Service → Backend API → Response → Update State
```

### 3. Data Creation Flow
```
Frontend Form → Redux Action → API Service → Backend API → Success Response → Update State
```

## 🎯 Success Criteria

### ✅ Integration Complete When:
- [ ] Login works with test credentials
- [ ] Devices page loads data from backend
- [ ] Subscriptions page loads data from backend
- [ ] Inventory page loads data from backend
- [ ] CRUD operations work for all modules
- [ ] Error handling works properly
- [ ] Token authentication works for all protected routes

## 🚀 Next Steps

### Phase 1: Basic Integration ✅
- Authentication working
- Basic data loading
- Error handling

### Phase 2: Advanced Features
- Real-time updates
- File uploads
- Advanced filtering
- Export functionality

### Phase 3: Production Ready
- Environment configuration
- Security hardening
- Performance optimization
- Monitoring and logging

## 📞 Support

If you encounter issues during integration:

1. **Check the logs:** Both frontend and backend console logs
2. **Verify endpoints:** Use curl or Postman to test API directly
3. **Check CORS:** Ensure backend allows frontend origin
4. **Verify authentication:** Check token format and storage

**Your frontend-backend integration is now ready for testing!** 🎉 