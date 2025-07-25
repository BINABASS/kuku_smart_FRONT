import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Tooltip
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  Paid as PaidIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const FinancialReport = ({ title, data, type, loading }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Handle loading state
  if (loading) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography>Loading {title.toLowerCase()} data...</Typography>
      </Paper>
    );
  }

  // Handle empty data
  if (!data) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography>No {title.toLowerCase()} data available</Typography>
      </Paper>
    );
  }

  const getPeriodOptions = () => {
    switch (type) {
      case 'income':
        return [
          { label: 'Monthly', value: 'monthly' },
          { label: 'Quarterly', value: 'quarterly' },
          { label: 'Yearly', value: 'yearly' }
        ];
      case 'expense':
        return [
          { label: 'Monthly', value: 'monthly' },
          { label: 'Quarterly', value: 'quarterly' },
          { label: 'Yearly', value: 'yearly' }
        ];
      case 'summary':
        return [
          { label: 'Current Month', value: 'current_month' },
          { label: 'Current Quarter', value: 'current_quarter' },
          { label: 'Current Year', value: 'current_year' }
        ];
      default:
        return [];
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateNetIncome = () => {
    const income = data.income || 0;
    const expenses = data.expenses || 0;
    return income - expenses;
  };

  const getTrendColor = (percentage) => {
    return percentage > 0 ? '#4CAF50' : '#F44336';
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Time Range</InputLabel>
          <Select
            label="Time Range"
            value={selectedPeriod}
            onChange={(e) => {
              const newPeriod = e.target.value;
              setSelectedPeriod(newPeriod);
            }}
          >
            {getPeriodOptions().map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {type === 'summary' ? (
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Total Income">
                  <Chip
                    icon={<AttachMoneyIcon sx={{ color: '#4CAF50' }} />}
                    label={formatCurrency(data.income || 0)}
                    color="success"
                    variant="outlined"
                  />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Total Expenses">
                  <Chip
                    icon={<ReceiptIcon sx={{ color: '#F44336' }} />}
                    label={formatCurrency(data.expenses || 0)}
                    color="error"
                    variant="outlined"
                  />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Net Income">
                  <Chip
                    icon={<PaidIcon sx={{ color: getTrendColor(calculateNetIncome()) }} />}
                    label={formatCurrency(calculateNetIncome())}
                    color={calculateNetIncome() > 0 ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items && data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">
                    <span style={{ color: type === 'income' ? '#4CAF50' : '#F44336' }}>
                      {formatCurrency(item.amount)}
                    </span>
                  </TableCell>
                  <TableCell align="right">{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={item.category}
                      color={type === 'income' ? 'success' : 'error'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default FinancialReport;
