import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import FinancialReport from '../components/financials/FinancialReport';
import FinancialSummary from '../components/financials/FinancialSummary';
import api from '../utils/api';

const FinancialsPage = () => {
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState({
    income: [],
    expenses: [],
    summary: {
      income: 0,
      expenses: 0,
      ytdIncome: 0,
      ytdExpenses: 0,
      ytdNetIncome: 0,
      monthlyIncome: {},
      monthlyExpenses: {},
      monthlyNetIncome: {},
      expenseCategories: {}
    }
  });

  const fetchFinancialData = async () => {
    try {
      const [income, expenses, summary] = await Promise.all([
        api.get('/financials/income'),
        api.get('/financials/expenses'),
        api.get('/financials/summary')
      ]);

      // Process income data
      const incomeData = income.data.map(item => ({
        ...item,
        date: new Date(item.date)
      }));

      // Process expenses data
      const expensesData = expenses.data.map(item => ({
        ...item,
        date: new Date(item.date)
      }));

      // Update state with processed data
      setFinancialData({
        income: incomeData,
        expenses: expensesData,
        summary: summary.data
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading financial data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Financial Summary */}
        <Grid item xs={12}>
          <FinancialSummary data={financialData.summary} />
        </Grid>

        {/* Income Report */}
        <Grid item xs={12} md={6}>
          <FinancialReport
            title="Income Report"
            data={financialData.income}
            type="income"
            loading={loading}
          />
        </Grid>

        {/* Expenses Report */}
        <Grid item xs={12} md={6}>
          <FinancialReport
            title="Expenses Report"
            data={financialData.expenses}
            type="expense"
            loading={loading}
          />
        </Grid>

        {/* Monthly Summary */}
        <Grid item xs={12}>
          <FinancialReport
            title="Monthly Financial Summary"
            data={financialData.summary}
            type="summary"
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialsPage; 