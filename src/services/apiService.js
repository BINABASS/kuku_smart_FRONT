import api from '../utils/api';

// Authentication Services
export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
};

// Device Services
export const deviceService = {
  getAll: () => api.get('/devices/'),
  getById: (id) => api.get(`/devices/${id}/`),
  create: (deviceData) => api.post('/devices/', deviceData),
  update: (id, deviceData) => api.put(`/devices/${id}/`, deviceData),
  delete: (id) => api.delete(`/devices/${id}/`),
  getLogs: () => api.get('/device-logs/'),
};

// Sensor Services
export const sensorService = {
  getAll: () => api.get('/sensors/'),
  getById: (id) => api.get(`/sensors/${id}/`),
  create: (sensorData) => api.post('/sensors/', sensorData),
  update: (id, sensorData) => api.put(`/sensors/${id}/`, sensorData),
  delete: (id) => api.delete(`/sensors/${id}/`),
  getReadings: () => api.get('/sensor-readings/'),
};

// Subscription Services
export const subscriptionService = {
  getAll: () => api.get('/subscriptions/'),
  getById: (id) => api.get(`/subscriptions/${id}/`),
  create: (subscriptionData) => api.post('/subscriptions/', subscriptionData),
  update: (id, subscriptionData) => api.put(`/subscriptions/${id}/`, subscriptionData),
  delete: (id) => api.delete(`/subscriptions/${id}/`),
  getPlans: () => api.get('/subscription-plans/'),
  getPlanById: (id) => api.get(`/subscription-plans/${id}/`),
  createPlan: (planData) => api.post('/subscription-plans/', planData),
  updatePlan: (id, planData) => api.put(`/subscription-plans/${id}/`, planData),
  deletePlan: (id) => api.delete(`/subscription-plans/${id}/`),
};

// Payment Services
export const paymentService = {
  getAll: () => api.get('/payments/'),
  getById: (id) => api.get(`/payments/${id}/`),
  create: (paymentData) => api.post('/payments/', paymentData),
  update: (id, paymentData) => api.put(`/payments/${id}/`, paymentData),
  delete: (id) => api.delete(`/payments/${id}/`),
};

// Inventory Services
export const inventoryService = {
  getItems: () => api.get('/inventory/items/'),
  getItemById: (id) => api.get(`/inventory/items/${id}/`),
  createItem: (itemData) => api.post('/inventory/items/', itemData),
  updateItem: (id, itemData) => api.put(`/inventory/items/${id}/`, itemData),
  deleteItem: (id) => api.delete(`/inventory/items/${id}/`),
  getCategories: () => api.get('/inventory/categories/'),
  getCategoryById: (id) => api.get(`/inventory/categories/${id}/`),
  createCategory: (categoryData) => api.post('/inventory/categories/', categoryData),
  updateCategory: (id, categoryData) => api.put(`/inventory/categories/${id}/`, categoryData),
  deleteCategory: (id) => api.delete(`/inventory/categories/${id}/`),
  getTransactions: () => api.get('/inventory/transactions/'),
  createTransaction: (transactionData) => api.post('/inventory/transactions/', transactionData),
};

// Knowledge Base Services
export const knowledgeService = {
  getArticles: () => api.get('/knowledge/articles/'),
  getArticleById: (id) => api.get(`/knowledge/articles/${id}/`),
  createArticle: (articleData) => api.post('/knowledge/articles/', articleData),
  updateArticle: (id, articleData) => api.put(`/knowledge/articles/${id}/`, articleData),
  deleteArticle: (id) => api.delete(`/knowledge/articles/${id}/`),
  getFAQs: () => api.get('/knowledge/faqs/'),
  getFAQById: (id) => api.get(`/knowledge/faqs/${id}/`),
  createFAQ: (faqData) => api.post('/knowledge/faqs/', faqData),
  updateFAQ: (id, faqData) => api.put(`/knowledge/faqs/${id}/`, faqData),
  deleteFAQ: (id) => api.delete(`/knowledge/faqs/${id}/`),
  getCategories: () => api.get('/knowledge/categories/'),
  getCategoryById: (id) => api.get(`/knowledge/categories/${id}/`),
  createCategory: (categoryData) => api.post('/knowledge/categories/', categoryData),
  updateCategory: (id, categoryData) => api.put(`/knowledge/categories/${id}/`, categoryData),
  deleteCategory: (id) => api.delete(`/knowledge/categories/${id}/`),
};

// Financial Services
export const financialService = {
  getIncome: () => api.get('/financials/income/'),
  getIncomeById: (id) => api.get(`/financials/income/${id}/`),
  createIncome: (incomeData) => api.post('/financials/income/', incomeData),
  updateIncome: (id, incomeData) => api.put(`/financials/income/${id}/`, incomeData),
  deleteIncome: (id) => api.delete(`/financials/income/${id}/`),
  getExpenses: () => api.get('/financials/expenses/'),
  getExpenseById: (id) => api.get(`/financials/expenses/${id}/`),
  createExpense: (expenseData) => api.post('/financials/expenses/', expenseData),
  updateExpense: (id, expenseData) => api.put(`/financials/expenses/${id}/`, expenseData),
  deleteExpense: (id) => api.delete(`/financials/expenses/${id}/`),
  getBudgets: () => api.get('/financials/budgets/'),
  getBudgetById: (id) => api.get(`/financials/budgets/${id}/`),
  createBudget: (budgetData) => api.post('/financials/budgets/', budgetData),
  updateBudget: (id, budgetData) => api.put(`/financials/budgets/${id}/`, budgetData),
  deleteBudget: (id) => api.delete(`/financials/budgets/${id}/`),
};

// Analytics Services
export const analyticsService = {
  getData: () => api.get('/analytics/data/'),
  getDataById: (id) => api.get(`/analytics/data/${id}/`),
  createData: (data) => api.post('/analytics/data/', data),
  updateData: (id, data) => api.put(`/analytics/data/${id}/`, data),
  deleteData: (id) => api.delete(`/analytics/data/${id}/`),
  getDashboards: () => api.get('/analytics/dashboards/'),
  getDashboardById: (id) => api.get(`/analytics/dashboards/${id}/`),
  createDashboard: (dashboardData) => api.post('/analytics/dashboards/', dashboardData),
  updateDashboard: (id, dashboardData) => api.put(`/analytics/dashboards/${id}/`, dashboardData),
  deleteDashboard: (id) => api.delete(`/analytics/dashboards/${id}/`),
  getReports: () => api.get('/analytics/reports/'),
  getReportById: (id) => api.get(`/analytics/reports/${id}/`),
  createReport: (reportData) => api.post('/analytics/reports/', reportData),
  updateReport: (id, reportData) => api.put(`/analytics/reports/${id}/`, reportData),
  deleteReport: (id) => api.delete(`/analytics/reports/${id}/`),
  getAlerts: () => api.get('/analytics/alerts/'),
  getAlertById: (id) => api.get(`/analytics/alerts/${id}/`),
  createAlert: (alertData) => api.post('/analytics/alerts/', alertData),
  updateAlert: (id, alertData) => api.put(`/analytics/alerts/${id}/`, alertData),
  deleteAlert: (id) => api.delete(`/analytics/alerts/${id}/`),
};

// Existing Services (Batches, Breeds, etc.)
export const batchService = {
  getAll: () => api.get('/batches/'),
  getById: (id) => api.get(`/batches/${id}/`),
  create: (batchData) => api.post('/batches/', batchData),
  update: (id, batchData) => api.put(`/batches/${id}/`, batchData),
  delete: (id) => api.delete(`/batches/${id}/`),
};

export const breedService = {
  getAll: () => api.get('/breeds/'),
  getById: (id) => api.get(`/breeds/${id}/`),
  create: (breedData) => api.post('/breeds/', breedData),
  update: (id, breedData) => api.put(`/breeds/${id}/`, breedData),
  delete: (id) => api.delete(`/breeds/${id}/`),
};

export const userService = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}/`),
  create: (userData) => api.post('/users/', userData),
  update: (id, userData) => api.put(`/users/${id}/`, userData),
  delete: (id) => api.delete(`/users/${id}/`),
}; 