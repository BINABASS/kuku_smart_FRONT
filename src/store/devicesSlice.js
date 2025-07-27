import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deviceService } from '../services/apiService';

export const fetchDevices = createAsyncThunk(
  'devices/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deviceService.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch devices');
    }
  }
);

export const addDevice = createAsyncThunk(
  'devices/addDevice',
  async (deviceData, { rejectWithValue }) => {
    try {
      const response = await deviceService.create(deviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add device');
    }
  }
);

export const updateDevice = createAsyncThunk(
  'devices/updateDevice',
  async ({ id, deviceData }, { rejectWithValue }) => {
    try {
      const response = await deviceService.update(id, deviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update device');
    }
  }
);

export const removeDevice = createAsyncThunk(
  'devices/removeDevice',
  async (id, { rejectWithValue }) => {
    try {
      await deviceService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete device');
    }
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
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
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

export const { setDeviceStatus, setSelectedDevice, clearError } = devicesSlice.actions;
export default devicesSlice.reducer;
