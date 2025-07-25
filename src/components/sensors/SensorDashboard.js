import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSensors, fetchSensorData } from '../../store/sensorsSlice';

const SensorDashboard = () => {
  const dispatch = useDispatch();
  const { items, status, error, selectedSensor, historicalData } = useSelector((state) => state.sensors);

  React.useEffect(() => {
    dispatch(fetchSensors());
  }, [dispatch]);

  const handleSensorClick = (sensor) => {
    dispatch({ type: 'sensors/setSelectedSensor', payload: sensor });
    if (sensor.id) {
      dispatch(fetchSensorData(sensor.id));
    }
  };

  const getAlertStatus = (value, thresholds) => {
    if (!thresholds) return null;
    if (value < thresholds.warning.min || value > thresholds.warning.max) {
      return 'warning';
    }
    if (value < thresholds.critical.min || value > thresholds.critical.max) {
      return 'error';
    }
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Sensors Dashboard</Typography>

      {status === 'loading' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Error loading sensors: {error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {items.map((sensor) => (
            <Grid item xs={12} md={6} lg={4} key={sensor.id}>
              <Card
                onClick={() => handleSensorClick(sensor)}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {sensor.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {sensor.type}
                  </Typography>

                  {selectedSensor?.id === sensor.id && historicalData[sensor.id] ? (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h4" align="center">
                        {historicalData[sensor.id].currentValue}
                        {sensor.unit}
                      </Typography>
                      
                      <LinearProgress
                        variant="determinate"
                        value={
                          (historicalData[sensor.id].currentValue / 
                          (sensor.thresholds?.critical?.max || 100)) * 100
                        }
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          mt: 2,
                        }}
                      />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {sensor.thresholds?.warning?.min}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {sensor.thresholds?.warning?.max}
                        </Typography>
                      </Box>

                      <Alert
                        severity={getAlertStatus(
                          historicalData[sensor.id].currentValue,
                          sensor.thresholds
                        )}
                        sx={{ mt: 2 }}
                      >
                        {getAlertStatus(historicalData[sensor.id].currentValue, sensor.thresholds) === 'error'
                          ? 'Critical threshold exceeded'
                          : getAlertStatus(historicalData[sensor.id].currentValue, sensor.thresholds) === 'warning'
                          ? 'Warning threshold exceeded'
                          : 'Normal range'}
                      </Alert>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6">Click to view details</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SensorDashboard;
