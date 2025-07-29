# 📊 Data Flow Guide - CRUD Operations

This guide explains how data flows through your Kuku Smart application for Create, Read, Update, and Delete (CRUD) operations.

## 🔄 **Data Flow Architecture**

```
Frontend (React) → API Service → Redux Store → Backend (Django) → Database (PostgreSQL)
```

---

## 📋 **1. AUTHENTICATION FLOW**

### **Login Process**
```
Frontend → Backend → Database → Response
```

**Files Involved:**
- **Frontend**: `frontend/src/pages/Login.js`
- **API Client**: `frontend/src/utils/api.js`
- **Redux**: `frontend/src/store/authSlice.js`
- **Backend**: `backend/users/auth_views.py`
- **Database**: `backend/users/models.py`

**Flow:**
1. User enters credentials in `Login.js`
2. `authSlice.js` calls `api.post('/auth/login/', credentials)`
3. `api.js` sends request to `http://localhost:8000/api/auth/login/`
4. `auth_views.py` authenticates user and returns token + user data
5. `authSlice.js` stores token in localStorage and user in Redux state
6. User is redirected to dashboard

---

## 📱 **2. DEVICES MODULE**

### **Create Device**
```
DeviceForm → Redux Action → API Service → Backend → Database
```

**Files Involved:**
- **Frontend Form**: `frontend/src/components/devices/DeviceForm.js`
- **Redux Action**: `frontend/src/store/devicesSlice.js`
- **API Service**: `frontend/src/services/apiService.js`
- **Backend View**: `backend/devices/views.py`
- **Backend Model**: `backend/devices/models.py`
- **Backend Serializer**: `backend/devices/serializers.py`

**Flow:**
1. User fills form in `DeviceForm.js`
2. `handleSubmit` calls `dispatch(addDevice(formData))`
3. `devicesSlice.js` calls `deviceService.create(deviceData)`
4. `apiService.js` calls `api.post('/devices/', deviceData)`
5. `devices/views.py` receives POST request
6. `DeviceSerializer` validates data
7. `Device` model saves to database
8. Response returns to frontend
9. Redux state updates with new device

### **Read Devices**
```
DeviceList → Redux Action → API Service → Backend → Database
```

**Files Involved:**
- **Frontend List**: `frontend/src/components/devices/DeviceList.js`
- **Redux Action**: `frontend/src/store/devicesSlice.js`
- **API Service**: `frontend/src/services/apiService.js`
- **Backend View**: `backend/devices/views.py`

**Flow:**
1. `DeviceList.js` calls `dispatch(fetchDevices())` on component mount
2. `devicesSlice.js` calls `deviceService.getAll()`
3. `apiService.js` calls `api.get('/devices/')`
4. `devices/views.py` queries database
5. Response returns list of devices
6. Redux state updates with devices
7. `DeviceList.js` renders devices from Redux state

### **Update Device**
```
DeviceForm → Redux Action → API Service → Backend → Database
```

**Flow:**
1. User edits device in `DeviceForm.js`
2. `handleSubmit` calls `dispatch(updateDevice({ id, deviceData }))`
3. `devicesSlice.js` calls `deviceService.update(id, deviceData)`
4. `apiService.js` calls `api.put('/devices/${id}/', deviceData)`
5. `devices/views.py` updates database record
6. Response returns updated device
7. Redux state updates with modified device

### **Delete Device**
```
DeviceList → Redux Action → API Service → Backend → Database
```

**Flow:**
1. User clicks delete in `DeviceList.js`
2. `handleDelete` calls `dispatch(removeDevice(id))`
3. `devicesSlice.js` calls `deviceService.delete(id)`
4. `apiService.js` calls `api.delete('/devices/${id}/')`
5. `devices/views.py` deletes database record
6. Redux state removes device from list

---

## 🏭 **3. INVENTORY MODULE**

### **Create/Update Inventory Item**
```
InventoryForm → Direct API Call → Backend → Database
```

**Files Involved:**
- **Frontend Form**: `frontend/src/components/inventory/InventoryForm.js`
- **Frontend Page**: `frontend/src/pages/Inventory.js`
- **Backend View**: `backend/inventory/views.py`
- **Backend Model**: `backend/inventory/models.py`

**Flow:**
1. User fills form in `InventoryForm.js`
2. `handleSubmit` calls `axios.post('/inventory/', data)` or `axios.put()`
3. `inventory/views.py` receives request
4. `Item` model saves to database
5. Response returns to frontend
6. `Inventory.js` updates local state

### **Read Inventory**
```
InventoryList → Direct API Call → Backend → Database
```

**Flow:**
1. `Inventory.js` calls `api.get('/inventory')` on mount
2. `inventory/views.py` queries database
3. Response returns list of items
4. `Inventory.js` updates local state
5. `InventoryList.js` renders items

---

## 👥 **4. USERS MODULE**

### **Create User**
```
UserForm → Direct API Call → Backend → Database
```

**Files Involved:**
- **Frontend Form**: `frontend/src/components/users/UserForm.js`
- **Frontend Page**: `frontend/src/pages/Users.js`
- **Backend View**: `backend/users/views.py`
- **Backend Model**: `backend/users/models.py`

**Flow:**
1. User fills form in `UserForm.js`
2. `handleCreate` calls `axios.post('/users/', userData)`
3. `users/views.py` creates new user
4. `CustomUser` model saves to database
5. Response returns new user
6. `Users.js` updates local state

---

## 💰 **5. FINANCIAL MODULE**

### **Read Financial Data**
```
FinancialsPage → API Service → Backend → Database
```

**Files Involved:**
- **Frontend Page**: `frontend/src/pages/Financials.js`
- **API Client**: `frontend/src/utils/api.js`
- **Backend Views**: `backend/financials/views.py`
- **Backend Models**: `backend/financials/models.py`

**Flow:**
1. `FinancialsPage.js` calls multiple API endpoints on mount:
   - `api.get('/financials/income')`
   - `api.get('/financials/expenses')`
   - `api.get('/financials/summary')`
2. `financials/views.py` queries database
3. Response returns financial data
4. `FinancialsPage.js` processes and displays data

---

## 📚 **6. KNOWLEDGE BASE MODULE**

### **Create/Update Article**
```
KnowledgeBaseForm → Direct API Call → Backend → Database
```

**Files Involved:**
- **Frontend Form**: `frontend/src/components/knowledge/KnowledgeBaseForm.js`
- **Backend View**: `backend/knowledge_base/views.py`
- **Backend Model**: `backend/knowledge_base/models.py`

**Flow:**
1. User fills form in `KnowledgeBaseForm.js`
2. `handleSubmit` calls `axios.post('/knowledge-base/', data)` or `axios.put()`
3. `knowledge_base/views.py` receives request
4. `Article` model saves to database
5. Response returns article
6. Form closes and list refreshes

### **Read Articles**
```
KnowledgeBaseList → Direct API Call → Backend → Database
```

**Flow:**
1. `KnowledgeBaseList.js` calls `axios.get('/knowledge-base/')` on mount
2. `knowledge_base/views.py` queries database
3. Response returns list of articles
4. `KnowledgeBaseList.js` renders articles

---

## 🔧 **7. API CONFIGURATION FILES**

### **Frontend API Client**
```javascript
// frontend/src/utils/api.js
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor adds token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});
```

### **Backend URL Configuration**
```python
# backend/kuku_smart/urls.py
urlpatterns = [
    path('api/', include('users.urls')),
    path('api/', include('devices.urls')),
    path('api/', include('inventory.urls')),
    # ... other apps
]
```

### **Backend ViewSet Example**
```python
# backend/devices/views.py
class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    permission_classes = [IsAuthenticated]
```

---

## 📊 **8. DATA STORAGE PATTERNS**

### **Redux Pattern (Devices, Sensors)**
```
Component → Redux Action → API Service → Backend → Database
```

### **Direct API Pattern (Inventory, Knowledge Base)**
```
Component → Direct API Call → Backend → Database
```

### **Mixed Pattern (Users, Financials)**
```
Component → API Service → Backend → Database
```

---

## 🔍 **9. ERROR HANDLING**

### **Frontend Error Handling**
```javascript
// In Redux slices
try {
  const response = await deviceService.getAll();
  return response.data;
} catch (error) {
  return rejectWithValue(error.response?.data?.error || 'Failed to fetch devices');
}

// In components
try {
  await api.post('/devices/', deviceData);
} catch (error) {
  console.error('Error saving device:', error);
  // Show error message to user
}
```

### **Backend Error Handling**
```python
# In views.py
try:
    device = Device.objects.create(**serializer.validated_data)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
except Exception as e:
    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
```

---

## 🎯 **10. SUMMARY**

**For each CRUD operation:**

1. **CREATE**: Form → API Call → Backend → Database → Response → UI Update
2. **READ**: Component Mount → API Call → Backend → Database → Response → UI Render
3. **UPDATE**: Form → API Call → Backend → Database → Response → UI Update
4. **DELETE**: Button Click → API Call → Backend → Database → Response → UI Update

**Key Files for Each Module:**
- **Frontend**: Pages, Components, Forms
- **API**: `api.js`, `apiService.js`
- **Redux**: Slices, Store
- **Backend**: Models, Views, Serializers, URLs
- **Database**: PostgreSQL tables

This architecture ensures clean separation of concerns and maintainable code! 🚀 
