import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Collapse,
  useDisclosure,
  Button,
  Divider,
  Badge,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SettingsIcon,
  ViewIcon,
  EditIcon,
  DeleteIcon,
  AddIcon,
  InfoIcon,
  WarningIcon,
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface SidebarItemProps {
  icon: any;
  label: string;
  href?: string;
  children?: SidebarItemProps[];
  badge?: string | number;
  isActive?: boolean;
}

const SidebarItem = ({ icon, label, href, children, badge, isActive }: SidebarItemProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const hasChildren = children && children.length > 0;
  const location = useLocation();
  
  const bg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const activeTextColor = useColorModeValue('blue.600', 'blue.200');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const isCurrentActive = href ? location.pathname === href : false;

  if (hasChildren) {
    return (
      <Box>
        <Button
          variant="ghost"
          justifyContent="flex-start"
          leftIcon={<Icon as={icon} />}
          rightIcon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
          onClick={onToggle}
          w="full"
          h="auto"
          py={3}
          px={4}
          textAlign="left"
          fontWeight="normal"
          color={textColor}
          _hover={{ bg: hoverBg }}
          _active={{ bg: hoverBg }}
        >
          <HStack justify="space-between" w="full">
            <Text>{label}</Text>
            {badge && (
              <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                {badge}
              </Badge>
            )}
          </HStack>
        </Button>
        <Collapse in={isOpen} animateOpacity>
          <VStack spacing={0} align="stretch" pl={6}>
            {children.map((child, index) => (
              <SidebarItem key={index} {...child} />
            ))}
          </VStack>
        </Collapse>
      </Box>
    );
  }

  return (
    <Button
      as={Link}
      to={href || '#'}
      variant="ghost"
      justifyContent="flex-start"
      leftIcon={<Icon as={icon} />}
      w="full"
      h="auto"
      py={3}
      px={4}
      textAlign="left"
      fontWeight="normal"
      color={isCurrentActive ? activeTextColor : textColor}
      bg={isCurrentActive ? activeBg : 'transparent'}
      _hover={{ bg: isCurrentActive ? activeBg : hoverBg }}
      _active={{ bg: isCurrentActive ? activeBg : hoverBg }}
      borderLeft={isCurrentActive ? '3px solid' : '3px solid transparent'}
      borderLeftColor={isCurrentActive ? 'blue.500' : 'transparent'}
    >
      <HStack justify="space-between" w="full">
        <Text>{label}</Text>
        {badge && (
          <Badge colorScheme="blue" variant="subtle" fontSize="xs">
            {badge}
          </Badge>
        )}
      </HStack>
    </Button>
  );
};

const AdminSidebar = () => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const sidebarItems: SidebarItemProps[] = [
    {
      icon: ViewIcon,
      label: 'Dashboard',
      href: '/admin',
    },
    {
      icon: SettingsIcon,
      label: 'System Management',
      children: [
        {
          icon: ViewIcon,
          label: 'Users',
          href: '/admin/users',
          badge: 'All',
        },
        {
          icon: ViewIcon,
          label: 'Farmers',
          href: '/admin/farmers',
          badge: 'All',
        },
        {
          icon: ViewIcon,
          label: 'Farms',
          href: '/admin/farms',
          badge: 'All',
        },
        {
          icon: ViewIcon,
          label: 'Devices',
          href: '/admin/devices',
          badge: 'All',
        },
      ],
    },
    {
      icon: SettingsIcon,
      label: 'Master Data',
      children: [
        {
          icon: ViewIcon,
          label: 'Breed Types',
          href: '/admin/breed-types',
        },
        {
          icon: ViewIcon,
          label: 'Breeds',
          href: '/admin/breeds',
        },
        {
          icon: ViewIcon,
          label: 'Activity Types',
          href: '/admin/activity-types',
        },
        {
          icon: ViewIcon,
          label: 'Condition Types',
          href: '/admin/condition-types',
        },
        {
          icon: ViewIcon,
          label: 'Food Types',
          href: '/admin/food-types',
        },
        {
          icon: ViewIcon,
          label: 'Sensor Types',
          href: '/admin/sensor-types',
        },
      ],
    },
    {
      icon: SettingsIcon,
      label: 'Farm Operations',
      children: [
        {
          icon: ViewIcon,
          label: 'Batches',
          href: '/admin/batches',
          badge: 'All',
        },
        {
          icon: ViewIcon,
          label: 'Activities',
          href: '/admin/activities',
          badge: 'All',
        },
        {
          icon: ViewIcon,
          label: 'Readings',
          href: '/admin/readings',
          badge: 'All',
        },
      ],
    },
    {
      icon: SettingsIcon,
      label: 'Subscriptions & Billing',
      children: [
        {
          icon: ViewIcon,
          label: 'All Subscriptions',
          href: '/admin/subscriptions',
          badge: 'All',
        },
        {
          icon: ViewIcon,
          label: 'Subscription Types',
          href: '/admin/subscription-types',
        },
        {
          icon: ViewIcon,
          label: 'Resources',
          href: '/admin/resources',
        },
        {
          icon: ViewIcon,
          label: 'Payments',
          href: '/admin/payments',
          badge: 'All',
        },
      ],
    },
    {
      icon: SettingsIcon,
      label: 'Knowledge Base',
      children: [
        {
          icon: ViewIcon,
          label: 'Health Conditions',
          href: '/admin/health-conditions',
        },
        {
          icon: ViewIcon,
          label: 'Recommendations',
          href: '/admin/recommendations',
        },
        {
          icon: ViewIcon,
          label: 'Disease Exceptions',
          href: '/admin/disease-exceptions',
        },
        {
          icon: ViewIcon,
          label: 'Anomalies',
          href: '/admin/anomalies',
        },
        {
          icon: ViewIcon,
          label: 'Medications',
          href: '/admin/medications',
        },
      ],
    },
    {
      icon: ExternalLinkIcon,
      label: 'Django Admin',
      href: '/admin/django-admin',
    },
  ];

  return (
    <Box
      w="280px"
      h="100vh"
      bg={bg}
      borderRightWidth="1px"
      borderRightColor={borderColor}
      position="fixed"
      left={0}
      top={0}
      overflowY="auto"
      zIndex={20}
    >
      <VStack spacing={0} align="stretch" p={4}>
        <Box mb={6}>
          <Text fontSize="lg" fontWeight="bold" color={textColor} mb={2}>
            Admin Panel
          </Text>
          <Divider />
        </Box>
        
        <VStack spacing={1} align="stretch">
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default AdminSidebar;
