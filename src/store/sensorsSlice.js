import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchSensors = createAsyncThunk(
  'sensors/fetchSensors',
  async () => {
    const response = await api.get('/sensors');
    return response.data;
  }
);

export const fetchSensorData = createAsyncThunk(
  'sensors/fetchSensorData',
  async (sensorId) => {
    const response = await api.get(`/sensors/${sensorId}/data`);
    return response.data;
  }
);

export const updateSensorThresholds = createAsyncThunk(
  'sensors/updateThresholds',
  async ({ sensorId, thresholds }) => {
    const response = await api.put(`/sensors/${sensorId}/thresholds`, thresholds);
    return response.data;
  }
);

const sensorsSlice = createSlice({
  name: 'sensors',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    selectedSensor: null,
    historicalData: {},
  },
  reducers: {
    setSelectedSensor: (state, action) => {
      state.selectedSensor = action.payload;
    },
    setHistoricalData: (state, action) => {
      state.historicalData[action.payload.sensorId] = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSensors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSensors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSensors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSensorData.fulfilled, (state, action) => {
        state.historicalData[action.meta.arg] = action.payload;
      })
      .addCase(updateSensorThresholds.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { setSelectedSensor, setHistoricalData } = sensorsSlice.actions;
export default sensorsSlice.reducer;
