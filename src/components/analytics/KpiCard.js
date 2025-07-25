import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

const KpiCard = ({ title, value, change, isPositive, icon, tooltip }) => {
  const changeColor = isPositive ? '#4CAF50' : '#F44336';
  const changeIcon = isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />;

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip} arrow>
            <IconButton size="small">
              {icon}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="h4" component="span">
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {changeIcon}
          <Typography variant="body2" sx={{ color: changeColor }}>
            {Math.abs(change)}%
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default KpiCard;
