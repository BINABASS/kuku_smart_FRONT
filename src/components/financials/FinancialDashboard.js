import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  AttachMoney,
  Receipt,
  Add,
  Refresh,
  Visibility,
  Edit,
  Delete,
} from '@mui/icons-material';
import api from '../../api/client';
import BudgetForm from './BudgetForm';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';

const FinancialDashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [budgetFormOpen, setBudgetFormOpen] = useState(false);
  const [expenseFormOpen, setExpenseFormOpen] = useState(false);
  const [incomeFormOpen, setIncomeFormOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedIncome, setSelectedIncome] = useState(null);

  // Fetch financial data
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [budgetsResponse, expensesResponse, incomeResponse] = await Promise.all([
        api.get('/financials/budgets/'),
        api.get('/financials/expenses/'),
        api.get('/financials/income/')
      ]);
      
      setBudgets(budgetsResponse.data);
      setExpenses(expensesResponse.data);
      setIncome(incomeResponse.data);
    } catch (err) {
      setError('Failed to fetch financial data');
      console.error('Error fetching financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  // Calculate financial summaries
  const calculateSummaries = () => {
    const totalBudget = budgets.reduce((sum, budget) => sum + parseFloat(budget.allocated_amount || 0), 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + parseFloat(budget.spent_amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    const totalIncome = income.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);
    const netProfit = totalIncome - totalExpenses;
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      totalExpenses,
      totalIncome,
      netProfit,
      budgetUtilization,
      remainingBudget: totalBudget - totalSpent
    };
  };

  const summaries = calculateSummaries();

  const handleBudgetEdit = (budget) => {
    setSelectedBudget(budget);
    setBudgetFormOpen(true);
  };

  const handleExpenseEdit = (expense) => {
    setSelectedExpense(expense);
    setExpenseFormOpen(true);
  };

  const handleIncomeEdit = (income) => {
    setSelectedIncome(income);
    setIncomeFormOpen(true);
  };

  const handleFormClose = () => {
    setBudgetFormOpen(false);
    setExpenseFormOpen(false);
    setIncomeFormOpen(false);
    setSelectedBudget(null);
    setSelectedExpense(null);
    setSelectedIncome(null);
  };

  const handleFormSuccess = () => {
    fetchFinancialData();
  };

  const getStatusColor = (utilization) => {
    if (utilization >= 90) return 'error';
    if (utilization >= 75) return 'warning';
    return 'success';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Financial Dashboard
        </Typography>
        <Box display="flex" gap={1}>
          <IconButton onClick={fetchFinancialData} disabled={loading}>
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setBudgetFormOpen(true)}
          >
            Add Budget
          </Button>
        </Box>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AccountBalance color="primary" />
                <Typography variant="h6">Total Budget</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {formatCurrency(summaries.totalBudget)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Allocated funds
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Receipt color="warning" />
                <Typography variant="h6">Total Spent</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {formatCurrency(summaries.totalSpent)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {summaries.budgetUtilization.toFixed(1)}% utilized
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUp color="success" />
                <Typography variant="h6">Total Income</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {formatCurrency(summaries.totalIncome)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenue generated
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AttachMoney color={summaries.netProfit >= 0 ? 'success' : 'error'} />
                <Typography variant="h6">Net Profit</Typography>
              </Box>
              <Typography 
                variant="h4" 
                color={summaries.netProfit >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(summaries.netProfit)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {summaries.netProfit >= 0 ? 'Profit' : 'Loss'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Budget vs Actual */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Budget Overview</Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => setBudgetFormOpen(true)}
                >
                  Add Budget
                </Button>
              </Box>
              <List>
                {budgets.slice(0, 5).map((budget) => (
                  <ListItem key={budget.id} divider>
                    <ListItemIcon>
                      <AccountBalance color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={budget.category}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            Allocated: {formatCurrency(budget.allocated_amount)} | 
                            Spent: {formatCurrency(budget.spent_amount)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {budget.type} • {budget.farm_name}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box display="flex" gap={1}>
                      <IconButton size="small" onClick={() => handleBudgetEdit(budget)}>
                        <Edit />
                      </IconButton>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Recent Transactions</Typography>
                <Box display="flex" gap={1}>
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={() => setExpenseFormOpen(true)}
                  >
                    Add Expense
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Add />}
                    onClick={() => setIncomeFormOpen(true)}
                  >
                    Add Income
                  </Button>
                </Box>
              </Box>
              <List>
                {[...expenses, ...income]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((transaction) => (
                    <ListItem key={`${transaction.type}-${transaction.id}`} divider>
                      <ListItemIcon>
                        {transaction.type === 'expense' ? (
                          <Receipt color="warning" />
                        ) : (
                          <TrendingUp color="success" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={transaction.description}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {formatCurrency(transaction.amount)} • {transaction.type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(transaction.date).toLocaleDateString()} • {transaction.farm_name}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box display="flex" gap={1}>
                        <IconButton 
                          size="small" 
                          onClick={() => 
                            transaction.type === 'expense' 
                              ? handleExpenseEdit(transaction)
                              : handleIncomeEdit(transaction)
                          }
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Budget Utilization Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Budget Utilization
          </Typography>
          <Grid container spacing={2}>
            {budgets.map((budget) => {
              const utilization = budget.allocated_amount > 0 
                ? (budget.spent_amount / budget.allocated_amount) * 100 
                : 0;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={budget.id}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {budget.category}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">
                        {formatCurrency(budget.spent_amount)} / {formatCurrency(budget.allocated_amount)}
                      </Typography>
                      <Chip
                        label={`${utilization.toFixed(1)}%`}
                        color={getStatusColor(utilization)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                      <Box
                        sx={{
                          width: `${Math.min(utilization, 100)}%`,
                          bgcolor: getStatusColor(utilization) === 'error' ? 'error.main' : 
                                   getStatusColor(utilization) === 'warning' ? 'warning.main' : 'success.main',
                          height: '100%',
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Forms */}
      <BudgetForm
        open={budgetFormOpen}
        onClose={handleFormClose}
        budget={selectedBudget}
        onSuccess={handleFormSuccess}
      />
      
      <ExpenseForm
        open={expenseFormOpen}
        onClose={handleFormClose}
        expense={selectedExpense}
        onSuccess={handleFormSuccess}
      />
      
      <IncomeForm
        open={incomeFormOpen}
        onClose={handleFormClose}
        income={selectedIncome}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
};

export default FinancialDashboard; 