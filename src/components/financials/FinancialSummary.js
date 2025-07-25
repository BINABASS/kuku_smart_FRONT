import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Avatar
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  Paid as PaidIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const FinancialSummary = ({ data }) => {
  const getTrendIcon = (percentage) => {
    if (percentage > 0) {
      return <TrendingUpIcon sx={{ color: '#4CAF50' }} />;
    }
    return <TrendingDownIcon sx={{ color: '#F44336' }} />;
  };

  const getTrendColor = (percentage) => {
    return percentage > 0 ? '#4CAF50' : '#F44336';
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Financial Summary
      </Typography>
      
      <Grid container spacing={3}>
        {/* Income Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: '#4CAF50' }}>
                  <AttachMoneyIcon />
                </Avatar>
              }
              title="Income"
              subheader={`YTD: ${formatCurrency(data.ytdIncome)}`}
            />
            <Divider />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Breakdown
              </Typography>
              {Object.entries(data.monthlyIncome).map(([month, amount]) => (
                <Box key={month} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{month}</Typography>
                  <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                    {formatCurrency(amount)}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Expenses Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: '#F44336' }}>
                  <ReceiptIcon />
                </Avatar>
              }
              title="Expenses"
              subheader={`YTD: ${formatCurrency(data.ytdExpenses)}`}
            />
            <Divider />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Expense Categories
              </Typography>
              {Object.entries(data.expenseCategories).map(([category, amount]) => (
                <Box key={category} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{category}</Typography>
                  <Typography variant="body2" sx={{ color: '#F44336' }}>
                    {formatCurrency(amount)}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Net Income Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: getTrendColor(data.netIncome) }}>
                  <PaidIcon />
                </Avatar>
              }
              title="Net Income"
              subheader={`YTD: ${formatCurrency(data.ytdNetIncome)}`}
            />
            <Divider />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Trends
              </Typography>
              {Object.entries(data.monthlyNetIncome).map(([month, amount]) => (
                <Box key={month} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                  <Typography variant="body2">{month}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: getTrendColor(amount) }}>
                      {formatCurrency(amount)}
                    </Typography>
                    {getTrendIcon(amount)}
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FinancialSummary;
