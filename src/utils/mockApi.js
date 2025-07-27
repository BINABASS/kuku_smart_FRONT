const mockSensors = [
  {
    id: 'sensor1',
    name: 'Temperature Sensor 1',
    type: 'temperature',
    unit: '°C',
    currentValue: 25.5,
    thresholds: {
      warning: { min: 20, max: 30 },
      critical: { min: 18, max: 32 },
    }
  },
  {
    id: 'sensor2',
    name: 'Humidity Sensor 1',
    type: 'humidity',
    unit: '%',
    currentValue: 65,
    thresholds: {
      warning: { min: 40, max: 70 },
      critical: { min: 30, max: 80 },
    }
  },
  {
    id: 'sensor3',
    name: 'Feed Level Sensor',
    type: 'feed',
    unit: 'kg',
    currentValue: 150,
    thresholds: {
      warning: { min: 100, max: 200 },
      critical: { min: 50, max: 250 },
    }
  }
];

// Mock subscription data
const mockSubscriptions = [
  {
    id: 'sub1',
    managerName: 'John Smith',
    farmName: 'Smith Poultry Farm',
    plan: 'Premium',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    status: 'active',
    devices: 10,
    sensors: 20,
    price: 999.99,
    paymentStatus: 'paid',
    renewalDate: '2025-01-15',
    features: [
      'Real-time monitoring',
      'AI analytics',
      'Advanced alerts',
      '24/7 support'
    ],
    address: '123 Poultry Lane, Farmville',
    contact: '+1 555-0123',
    email: 'john@smithpoultry.com',
    notes: 'Premium customer with multiple locations'
  },
  {
    id: 'sub2',
    managerName: 'Sarah Johnson',
    farmName: 'Johnson Family Farm',
    plan: 'Standard',
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    status: 'active',
    devices: 5,
    sensors: 10,
    price: 499.99,
    paymentStatus: 'pending',
    renewalDate: '2025-02-01',
    features: [
      'Basic monitoring',
      'Alerts',
      'Email support'
    ],
    address: '456 Chicken Road, Rural Town',
    contact: '+1 555-0124',
    email: 'sarah@johnsonfarm.com',
    notes: 'New customer, needs training'
  },
  {
    id: 'sub3',
    managerName: 'Michael Brown',
    farmName: 'Brown Poultry',
    plan: 'Enterprise',
    startDate: '2024-03-01',
    endDate: '2026-03-01',
    status: 'active',
    devices: 20,
    sensors: 40,
    price: 1999.99,
    paymentStatus: 'paid',
    renewalDate: '2026-03-01',
    features: [
      'All premium features',
      'Custom analytics',
      'Priority support',
      'API access'
    ],
    address: '789 Farm Street, Agricultural City',
    contact: '+1 555-0125',
    email: 'michael@brownpoultry.com',
    notes: 'Enterprise customer with custom solution'
  },
  {
    id: 'sub4',
    managerName: 'Emily Wilson',
    farmName: 'Wilson Farms',
    plan: 'Basic',
    startDate: '2024-04-01',
    endDate: '2025-04-01',
    status: 'cancelled',
    devices: 2,
    sensors: 5,
    price: 199.99,
    paymentStatus: 'paid',
    renewalDate: '2025-04-01',
    features: [
      'Basic monitoring',
      'Alerts',
      'Email support'
    ],
    address: '101 Chicken Coop Lane, Farm Town',
    contact: '+1 555-0126',
    email: 'emily@wilsonfarms.com',
    notes: 'Cancelled subscription'
  },
  {
    id: 'sub5',
    managerName: 'Robert Davis',
    farmName: 'Davis Poultry',
    plan: 'Premium',
    startDate: '2024-05-01',
    endDate: '2025-05-01',
    status: 'active',
    devices: 10,
    sensors: 20,
    price: 999.99,
    paymentStatus: 'paid',
    renewalDate: '2025-05-01',
    features: [
      'Real-time monitoring',
      'AI analytics',
      'Advanced alerts',
      '24/7 support'
    ],
    address: '202 Poultry Drive, Farming Village',
    contact: '+1 555-0127',
    email: 'robert@davispoultry.com',
    notes: 'Premium customer with multiple flocks'
  }
];

// Mock subscription plans
// Mock user roles
const userRoles = [
  { id: 'admin', name: 'Administrator', permissions: ['all'] },
  { id: 'manager', name: 'Manager', permissions: ['users', 'subscriptions', 'analytics'] }
];

// Mock user data
const mockUsers = [
  {
    id: 'user1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-07-25T13:00:00+03:00',
    farms: ['farm1', 'farm2'],
    devices: 10,
    sensors: 20,
    subscription: 'Premium',
    planStartDate: '2024-01-15',
    planEndDate: '2025-01-15',
    paymentStatus: 'paid',
    permissions: ['all']
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2024-07-24T09:30:00+03:00',
    farms: ['farm3'],
    devices: 5,
    sensors: 10,
    subscription: 'Standard',
    planStartDate: '2024-02-01',
    planEndDate: '2025-02-01',
    paymentStatus: 'pending',
    permissions: ['users', 'subscriptions', 'analytics']
  }
];

// Mock subscription plans
const mockSubscriptionPlans = [
  {
    id: 'plan1',
    name: 'Basic',
    price: 199.99,
    devicesLimit: 2,
    sensorsLimit: 5,
    features: [
      'Basic monitoring',
      'Alerts',
      'Email support'
    ]
  },
  {
    id: 'plan2',
    name: 'Standard',
    price: 499.99,
    devicesLimit: 5,
    sensorsLimit: 10,
    features: [
      'Real-time monitoring',
      'Alerts',
      'Email support'
    ]
  },
  {
    id: 'plan3',
    name: 'Premium',
    price: 999.99,
    devicesLimit: 10,
    sensorsLimit: 20,
    features: [
      'Real-time monitoring',
      'AI analytics',
      'Advanced alerts',
      '24/7 support'
    ]
  },
  {
    id: 'plan4',
    name: 'Enterprise',
    price: 1999.99,
    devicesLimit: 20,
    sensorsLimit: 40,
    features: [
      'All premium features',
      'Custom analytics',
      'Priority support',
      'API access'
    ]
  }
];

// Mock analytics data
const mockAnalytics = {
  dailyActivity: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Active Users',
        data: [120, 150, 130, 180, 200, 190, 220],
        borderColor: '#4CAF50',
        tension: 0.1
      },
      {
        label: 'New Users',
        data: [20, 30, 25, 40, 50, 45, 60],
        borderColor: '#2196F3',
        tension: 0.1
      }
    ]
  },
  farmPerformance: {
    totalFarms: 150,
    activeFarms: 135,
    inactiveFarms: 15,
    averagePoultryCount: 1000,
    topPerformingFarms: [
      { name: 'Smith Poultry', score: 95 },
      { name: 'Johnson Farms', score: 92 },
      { name: 'Brown Poultry', score: 89 }
    ]
  },
  sensorHealth: {
    totalSensors: 500,
    onlineSensors: 480,
    offlineSensors: 20,
    warningSensors: 15,
    criticalSensors: 5
  },
  userEngagement: {
    totalUsers: 200,
    activeUsers: 180,
    inactiveUsers: 20,
    avgSessionDuration: '25 mins',
    topActivities: [
      { activity: 'Monitoring', count: 1200 },
      { activity: 'Alerts', count: 800 },
      { activity: 'Reports', count: 600 }
    ]
  }
};

// Mock financial data
const mockFinancialData = {
  income: [
    {
      id: 1,
      description: 'Subscription Fee - Premium Plan',
      amount: 999.99,
      date: '2024-07-01',
      category: 'Subscription'
    },
    {
      id: 2,
      description: 'Support Package - Advanced',
      amount: 299.99,
      date: '2024-07-05',
      category: 'Support'
    },
    {
      id: 3,
      description: 'Custom Development',
      amount: 1999.99,
      date: '2024-07-15',
      category: 'Development'
    }
  ],
  expenses: [
    {
      id: 1,
      description: 'Server Hosting',
      amount: 199.99,
      date: '2024-07-01',
      category: 'Infrastructure'
    },
    {
      id: 2,
      description: 'Support Staff Salary',
      amount: 2500.00,
      date: '2024-07-15',
      category: 'Personnel'
    },
    {
      id: 3,
      description: 'Marketing Campaign',
      amount: 500.00,
      date: '2024-07-20',
      category: 'Marketing'
    }
  ],
  summary: {
    income: 3299.97,
    expenses: 3199.99,
    ytdIncome: 25000.00,
    ytdExpenses: 22000.00,
    ytdNetIncome: 3000.00,
    monthlyIncome: {
      'July': 3299.97,
      'June': 3500.00,
      'May': 3300.00
    },
    monthlyExpenses: {
      'July': 3199.99,
      'June': 3000.00,
      'May': 2800.00
    },
    monthlyNetIncome: {
      'July': 100.00,
      'June': 500.00,
      'May': 500.00
    },
    expenseCategories: {
      Infrastructure: 199.99,
      Personnel: 2500.00,
      Marketing: 500.00
    }
  }
};

// Export functions for API access
export const getMockSensors = () => mockSensors;
export const getMockDevices = () => mockDevices;
export const getMockSubscriptions = () => mockSubscriptions;
export const getMockSubscriptionPlans = () => mockSubscriptionPlans;
export const getMockFinancialData = () => mockFinancialData;

// Mock inventory types
const inventoryTypes = [
  {
    id: 'feed',
    name: 'Feed',
    unit: 'kg',
    categories: ['Layer', 'Broiler', 'Starter', 'Grower', 'Finisher']
  },
  {
    id: 'medicine',
    name: 'Medicine',
    unit: 'ml',
    categories: ['Antibiotics', 'Vaccines', 'Vitamins', 'Dewormers']
  },
  {
    id: 'equipment',
    name: 'Equipment',
    unit: 'units',
    categories: ['Nesting Boxes', 'Feeders', 'Waterers', 'Heaters']
  },
  {
    id: 'supplies',
    name: 'Supplies',
    unit: 'units',
    categories: ['Eggs', 'Chicks', 'Cleaning Supplies', 'Bedding']
  }
];

// Mock inventory data
const mockInventory = [
  {
    id: 'inv1',
    type: 'feed',
    category: 'Layer',
    name: 'Layer Feed',
    quantity: 1500,
    unit: 'kg',
    minThreshold: 500,
    maxThreshold: 2000,
    supplier: 'Poultry Feed Co.',
    lastStocked: '2024-07-20',
    expiration: '2025-01-20',
    notes: 'High protein content for egg production'
  },
  {
    id: 'inv2',
    type: 'feed',
    category: 'Broiler',
    name: 'Broiler Feed',
    quantity: 1200,
    unit: 'kg',
    minThreshold: 400,
    maxThreshold: 1800,
    supplier: 'Poultry Feed Co.',
    lastStocked: '2024-07-22',
    expiration: '2024-12-22',
    notes: 'Growth formula for broilers'
  },
  {
    id: 'inv3',
    type: 'medicine',
    category: 'Antibiotics',
    name: 'Amoxicillin',
    quantity: 500,
    unit: 'ml',
    minThreshold: 100,
    maxThreshold: 1000,
    supplier: 'VetMed Supplies',
    lastStocked: '2024-07-15',
    expiration: '2025-01-15',
    notes: 'Broad-spectrum antibiotic'
  },
  {
    id: 'inv4',
    type: 'medicine',
    category: 'Vaccines',
    name: 'Newcastle Disease Vaccine',
    quantity: 200,
    unit: 'ml',
    minThreshold: 50,
    maxThreshold: 500,
    supplier: 'VetMed Supplies',
    lastStocked: '2024-07-18',
    expiration: '2024-12-18',
    notes: 'Live vaccine for ND protection'
  },
  {
    id: 'inv5',
    type: 'equipment',
    category: 'Nesting Boxes',
    name: 'Standard Nesting Box',
    quantity: 100,
    unit: 'units',
    minThreshold: 20,
    maxThreshold: 150,
    supplier: 'Farm Equipment Co.',
    lastStocked: '2024-07-10',
    notes: 'Durable plastic nesting boxes'
  },
  {
    id: 'inv6',
    type: 'supplies',
    category: 'Eggs',
    name: 'Fertile Eggs',
    quantity: 500,
    unit: 'units',
    minThreshold: 100,
    maxThreshold: 1000,
    supplier: 'Egg Supply Co.',
    lastStocked: '2024-07-25',
    expiration: '2024-08-01',
    notes: 'Fresh fertile eggs for hatching'
  }
];

// API endpoints
export const api = {
  get: async (endpoint) => {
    switch (endpoint) {
      case '/inventory/types':
        return { data: inventoryTypes };
      case '/inventory':
        return { data: mockInventory };
      case '/inventory/low-stock':
        return { data: mockInventory.filter(item => item.quantity <= item.minThreshold) };
      case '/inventory/expiring':
        return { data: mockInventory.filter(item => new Date(item.expiration) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) };
      case '/users':
        return { data: mockUsers };
      case '/roles':
        return { data: userRoles };
      case '/devices':
        return { data: mockDevices };
      case '/sensors':
        return { data: mockSensors };
      case '/subscriptions':
        return { data: mockSubscriptions };
      case '/analytics':
        return { data: mockAnalytics };
      case '/financials/income':
        return { data: mockFinancialData.income };
      case '/financials/expenses':
        return { data: mockFinancialData.expenses };
      case '/financials/summary':
        return { data: mockFinancialData.summary };
      default:
        throw new Error('Endpoint not implemented');
    }
  }
};

const mockDevices = [
  {
    id: 'device1',
    name: 'Temperature Controller',
    type: 'temperature',
    status: 'online',
    lastSeen: new Date().toISOString(),
    firmwareVersion: '1.0.3',
    updateInterval: 300,
    configuration: {
      thresholds: {
        min: 18,
        max: 32
      }
    }
  },
  {
    id: 'device2',
    name: 'Humidity Controller',
    type: 'humidity',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    firmwareVersion: '1.0.2',
    updateInterval: 600,
    configuration: {
      thresholds: {
        min: 40,
        max: 70
      }
    }
  },
  {
    id: 'device3',
    name: 'Feed Dispenser',
    type: 'feed',
    status: 'maintenance',
    lastSeen: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    firmwareVersion: '2.1.0',
    updateInterval: 900,
    configuration: {
      thresholds: {
        min: 100,
        max: 200
      }
    }
  }
];
