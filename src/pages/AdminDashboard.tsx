import { 
  Heading, 
  Box, 
  Text, 
  Grid, 
  GridItem, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  StatArrow, 
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
  Divider
} from '@chakra-ui/react';
import { 
  ViewIcon, 
  SettingsIcon, 
  WarningIcon,
  CheckCircleIcon
} from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  // Real data (optional). If a fetch fails, keep undefined to render empty.
  const [totalUsers, setTotalUsers] = useState<number | undefined>(undefined);
  const [totalFarmers, setTotalFarmers] = useState<number | undefined>(undefined);
  const [activeFarms, setActiveFarms] = useState<number | undefined>(undefined);
  const [totalDevices, setTotalDevices] = useState<number | undefined>(undefined);
  const [activeSubscriptions, setActiveSubscriptions] = useState<number | undefined>(undefined);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [users, farmers, farms, devices, subs] = await Promise.all([
          api.get('users/').catch(() => ({ data: { results: [] } })),
          api.get('farmers/').catch(() => ({ data: { results: [] } })),
          api.get('farms/').catch(() => ({ data: { results: [] } })),
          api.get('devices/').catch(() => ({ data: { results: [] } })),
          api.get('farmer-subscriptions/').catch(() => ({ data: { results: [] } })),
        ]);
        const usersArr = users.data.results || users.data || [];
        const farmersArr = farmers.data.results || farmers.data || [];
        const farmsArr = farms.data.results || farms.data || [];
        const devicesArr = devices.data.results || devices.data || [];
        const subsArr = subs.data.results || subs.data || [];
        setTotalUsers(Array.isArray(usersArr) ? usersArr.length : undefined);
        setTotalFarmers(Array.isArray(farmersArr) ? farmersArr.length : undefined);
        setActiveFarms(Array.isArray(farmsArr) ? farmsArr.length : undefined);
        setTotalDevices(Array.isArray(devicesArr) ? devicesArr.length : undefined);
        setActiveSubscriptions(Array.isArray(subsArr) ? subsArr.length : undefined);
      } catch (_) {
        // leave undefined to show blanks
      }
      try {
        // Optional revenue: sum of payments if available
        const payments = await api.get('payments/');
        const payArr = payments.data.results || payments.data || [];
        if (Array.isArray(payArr)) {
          const total = payArr.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
          setMonthlyRevenue(total);
        }
      } catch (_) {
        setMonthlyRevenue(undefined);
      }
    };
    fetchCounts();
  }, []);

  const quickActions = [
    { label: 'Manage Users', href: '/admin/users', icon: ViewIcon, color: 'blue' },
    { label: 'View Subscriptions', href: '/admin/subscriptions', icon: ViewIcon, color: 'green' },
    { label: 'System Settings', href: '/admin/settings', icon: SettingsIcon, color: 'purple' },
    { label: 'Django Admin', href: '/admin/django-admin', icon: ViewIcon, color: 'orange' },
  ];

  const recentActivities = [
    { action: 'New farmer registered', time: '2 minutes ago', status: 'success' },
    { action: 'Payment processed', time: '15 minutes ago', status: 'success' },
    { action: 'Device offline alert', time: '1 hour ago', status: 'warning' },
    { action: 'Subscription renewed', time: '2 hours ago', status: 'success' },
  ];

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading as="h1" size="xl" mb={2}>Admin Dashboard</Heading>
          <Text color={textColor}>Welcome back! Here's what's happening with your Smart Kuku system.</Text>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Users</StatLabel>
                <StatNumber>{totalUsers ?? ''}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  12% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Farms</StatLabel>
                <StatNumber>{activeFarms ?? ''}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  8% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Monthly Revenue</StatLabel>
                <StatNumber>{monthlyRevenue !== undefined ? `$${monthlyRevenue.toLocaleString()}` : ''}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  15% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>System Health</StatLabel>
                <StatNumber>{/* keep empty if unknown */}</StatNumber>
                <StatHelpText>
                  <Icon as={CheckCircleIcon} color="green.500" />
                  All systems operational
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Quick Actions */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Quick Actions</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  as={Link}
                  to={action.href}
                  leftIcon={<Icon as={action.icon} />}
                  colorScheme={action.color}
                  variant="outline"
                  size="lg"
                  h="auto"
                  py={6}
                  flexDirection="column"
                  gap={2}
                >
                  {action.label}
                </Button>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Recent Activity & System Overview */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Recent Activity</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {recentActivities.map((activity, index) => (
                  <Box key={index}>
                    <HStack justify="space-between">
                      <Text fontSize="sm">{activity.action}</Text>
                      <Badge 
                        colorScheme={activity.status === 'success' ? 'green' : 'orange'}
                        variant="subtle"
                        size="sm"
                      >
                        {activity.status === 'success' ? 'Success' : 'Warning'}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color={textColor}>{activity.time}</Text>
                    {index < recentActivities.length - 1 && <Divider mt={2} />}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">System Overview</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Total Farmers</Text>
                    <Text fontWeight="bold">{totalFarmers ?? ''}</Text>
                  </HStack>
                </Box>
                <Divider />
                <Box>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Active Devices</Text>
                    <Text fontWeight="bold">{totalDevices ?? ''}</Text>
                  </HStack>
                </Box>
                <Divider />
                <Box>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Active Subscriptions</Text>
                    <Text fontWeight="bold">{activeSubscriptions ?? ''}</Text>
                  </HStack>
                </Box>
                <Divider />
                <Box>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Pending Tasks</Text>
                    <Badge colorScheme="orange" variant="subtle">
                      {/* left blank intentionally */}
                    </Badge>
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
