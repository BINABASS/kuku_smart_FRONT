import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async () => {
    const response = await api.get('/devices');
    return response.data;
  }
);

export const addDevice = createAsyncThunk(
  'devices/addDevice',
  async (deviceData) => {
    const response = await api.post('/devices', deviceData);
    return response.data;
  }
);

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, deviceData }) => {
    const response = await api.put(`/devices/${id}`, deviceData);
    return response.data;
  }
);

export const removeDevice = createAsyncThunk(
  'devices/removeDevice',
  async (id) => {
    await api.delete(`/devices/${id}`);
    return id;
  }
);

const devicesSlice = createSlice({
  name: 'devices',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    selectedDevice: null,
  },
  reducers: {
    setDeviceStatus: (state, action) => {
      const device = state.items.find(d => d.id === action.payload.deviceId);
      if (device) {
        device.status = action.payload.status;
      }
    },
    setSelectedDevice: (state, action) => {
      state.selectedDevice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeDevice.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export const { setDeviceStatus, setSelectedDevice } = devicesSlice.actions;
export default devicesSlice.reducer;
