import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Divider,
  Progress,
  Tooltip,
  Switch,
  Code,
} from '@chakra-ui/react';
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  ChevronDownIcon,
  WarningIcon,
  CheckIcon,
  CloseIcon,
  SettingsIcon,
  PhoneIcon,
} from '@chakra-ui/icons';
import api from '../../services/api';

interface Device {
  id: number;
  farm: {
    id: number;
    name: string;
    farmer: {
      user: {
        first_name: string;
        last_name: string;
      };
    };
  };
  device_type: {
    id: number;
    name: string;
    description: string;
    parameters: string[];
  };
  name: string;
  serial_number: string;
  mac_address: string;
  ip_address: string;
  status: string;
  is_online: boolean;
  last_seen: string | null;
  battery_level: number | null;
  signal_strength: number | null;
  firmware_version: string;
  created_at: string;
  updated_at: string;
  total_readings: number;
  last_reading: {
    temperature: number;
    humidity: number;
    timestamp: string;
  } | null;
  configuration: {
    sampling_interval: number;
    data_transmission_interval: number;
    alert_thresholds: {
      temperature_min: number;
      temperature_max: number;
      humidity_min: number;
      humidity_max: number;
    };
  };
}

interface DeviceFormData {
  farm: number;
  device_type: number;
  name: string;
  serial_number: string;
  mac_address: string;
  ip_address: string;
  status: string;
  firmware_version: string;
  configuration: {
    sampling_interval: number;
    data_transmission_interval: number;
    alert_thresholds: {
      temperature_min: number;
      temperature_max: number;
      humidity_min: number;
      humidity_max: number;
    };
  };
}

const DeviceManagement = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [farms, setFarms] = useState<any[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [onlineFilter, setOnlineFilter] = useState('ALL');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const [formData, setFormData] = useState<DeviceFormData>({
    farm: 0,
    device_type: 0,
    name: '',
    serial_number: '',
    mac_address: '',
    ip_address: '',
    status: 'ACTIVE',
    firmware_version: '',
    configuration: {
      sampling_interval: 300,
      data_transmission_interval: 3600,
      alert_thresholds: {
        temperature_min: 15,
        temperature_max: 35,
        humidity_min: 40,
        humidity_max: 80,
      },
    },
  });

  // Fetch devices
  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('devices/');
      setDevices(response.data.results || response.data);
      setFilteredDevices(response.data.results || response.data);
    } catch (err: any) {
      console.error('Error fetching devices:', err);
      setError('Failed to fetch devices. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to fetch devices',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch farms and device types
  const fetchRelatedData = async () => {
    try {
      const [farmsRes, typesRes] = await Promise.all([
        api.get('farms/'),
        api.get('device-types/')
      ]);
      setFarms(farmsRes.data.results || farmsRes.data);
      setDeviceTypes(typesRes.data.results || typesRes.data);
    } catch (err: any) {
      console.error('Error fetching related data:', err);
    }
  };

  // Search and filter functionality
  useEffect(() => {
    let filtered = devices.filter(device =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.mac_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.device_type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(device => device.status === statusFilter);
    }

    if (onlineFilter !== 'ALL') {
      filtered = filtered.filter(device => 
        onlineFilter === 'ONLINE' ? device.is_online : !device.is_online
      );
    }

    setFilteredDevices(filtered);
  }, [searchTerm, statusFilter, onlineFilter, devices]);

  useEffect(() => {
    fetchDevices();
    fetchRelatedData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedDevice) {
        // Update existing device
        await api.put(`devices/${selectedDevice.id}/`, formData);
        toast({
          title: 'Success',
          description: 'Device updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new device
        await api.post('devices/', formData);
        toast({
          title: 'Success',
          description: 'Device created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      onClose();
      resetForm();
      fetchDevices();
    } catch (err: any) {
      console.error('Error saving device:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to save device';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedDevice) return;

    try {
      await api.delete(`devices/${selectedDevice.id}/`);
      toast({
        title: 'Success',
        description: 'Device deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      resetForm();
      fetchDevices();
    } catch (err: any) {
      console.error('Error deleting device:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete device',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      farm: 0,
      device_type: 0,
      name: '',
      serial_number: '',
      mac_address: '',
      ip_address: '',
      status: 'ACTIVE',
      firmware_version: '',
      configuration: {
        sampling_interval: 300,
        data_transmission_interval: 3600,
        alert_thresholds: {
          temperature_min: 15,
          temperature_max: 35,
          humidity_min: 40,
          humidity_max: 80,
        },
      },
    });
    setSelectedDevice(null);
  };

  // Open form for editing
  const handleEdit = (device: Device) => {
    setSelectedDevice(device);
    setFormData({
      farm: device.farm.id,
      device_type: device.device_type.id,
      name: device.name,
      serial_number: device.serial_number,
      mac_address: device.mac_address,
      ip_address: device.ip_address,
      status: device.status,
      firmware_version: device.firmware_version,
      configuration: device.configuration,
    });
    onOpen();
  };

  // Open form for creating
  const handleCreate = () => {
    resetForm();
    onOpen();
  };

  // Open delete confirmation
  const handleDeleteClick = (device: Device) => {
    setSelectedDevice(device);
    onDeleteOpen();
  };

  // Toggle device status
  const toggleStatus = async (device: Device) => {
    const newStatus = device.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`devices/${device.id}/`, { status: newStatus });
      toast({
        title: 'Success',
        description: `Device ${newStatus.toLowerCase()} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchDevices();
    } catch (err: any) {
      console.error('Error toggling device status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update device status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      case 'MAINTENANCE':
        return 'yellow';
      case 'ERROR':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getSignalStrengthColor = (strength: number | null) => {
    if (!strength) return 'gray';
    if (strength >= 80) return 'green';
    if (strength >= 60) return 'yellow';
    return 'red';
  };

  const getBatteryColor = (level: number | null) => {
    if (!level) return 'gray';
    if (level >= 80) return 'green';
    if (level >= 20) return 'yellow';
    return 'red';
  };

  // Calculate statistics
  const stats = {
    totalDevices: devices.length,
    onlineDevices: devices.filter(d => d.is_online).length,
    offlineDevices: devices.filter(d => !d.is_online).length,
    activeDevices: devices.filter(d => d.status === 'ACTIVE').length,
    totalReadings: devices.reduce((sum, d) => sum + d.total_readings, 0),
    averageBattery: devices.reduce((sum, d) => sum + (d.battery_level || 0), 0) / devices.length || 0,
    averageSignal: devices.reduce((sum, d) => sum + (d.signal_strength || 0), 0) / devices.length || 0,
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getTimeSinceLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return 'Never';
    const now = new Date();
    const last = new Date(lastSeen);
    const diffMs = now.getTime() - last.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">Device Management</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleCreate}
          >
            Add Device
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={4}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Devices</StatLabel>
                <StatNumber>{stats.totalDevices}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Online</StatLabel>
                <StatNumber color="green.500">{stats.onlineDevices}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Offline</StatLabel>
                <StatNumber color="red.500">{stats.offlineDevices}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Active</StatLabel>
                <StatNumber color="green.500">{stats.activeDevices}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Readings</StatLabel>
                <StatNumber>{stats.totalReadings}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Avg Battery</StatLabel>
                <StatNumber color={getBatteryColor(stats.averageBattery)}>
                  {Math.round(stats.averageBattery)}%
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Avg Signal</StatLabel>
                <StatNumber color={getSignalStrengthColor(stats.averageSignal)}>
                  {Math.round(stats.averageSignal)}%
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Search and Filters */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <HStack spacing={4}>
              <InputGroup flex={1}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search devices by name, serial, MAC, IP, or farm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                w="150px"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="ERROR">Error</option>
              </Select>
              <Select
                value={onlineFilter}
                onChange={(e) => setOnlineFilter(e.target.value)}
                w="120px"
              >
                <option value="ALL">All</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </Select>
            </HStack>
          </CardBody>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Devices Table */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">
              Devices ({filteredDevices.length})
            </Text>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Device Info</Th>
                  <Th>Farm & Type</Th>
                  <Th>Network</Th>
                  <Th>Status</Th>
                  <Th>Performance</Th>
                  <Th>Last Reading</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredDevices.map((device) => (
                  <Tr key={device.id}>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{device.name}</Text>
                        <Text fontSize="sm" color={textColor}>
                          {device.device_type.name}
                        </Text>
                        <Text fontSize="xs" color={textColor}>
                          SN: {device.serial_number}
                        </Text>
                        <Text fontSize="xs" color={textColor}>
                          FW: {device.firmware_version}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{device.farm.name}</Text>
                        <Text fontSize="sm" color={textColor}>
                          {device.farm.farmer.user.first_name} {device.farm.farmer.user.last_name}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm">
                          <ViewIcon boxSize={3} mr={1} />
                          {device.ip_address}
                        </Text>
                        <Text fontSize="xs" color={textColor}>
                          MAC: {device.mac_address}
                        </Text>
                        <HStack spacing={1}>
                          <Text fontSize="xs">Signal:</Text>
                          <Badge
                            colorScheme={getSignalStrengthColor(device.signal_strength)}
                            size="sm"
                          >
                            {device.signal_strength ? `${device.signal_strength}%` : 'N/A'}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Badge colorScheme={getStatusColor(device.status)}>
                          {device.status}
                        </Badge>
                        <Badge colorScheme={device.is_online ? 'green' : 'red'}>
                          {device.is_online ? 'Online' : 'Offline'}
                        </Badge>
                        {device.battery_level && (
                          <HStack spacing={1}>
                            <Text fontSize="xs">Battery:</Text>
                            <Badge
                              colorScheme={getBatteryColor(device.battery_level)}
                              size="sm"
                            >
                              {device.battery_level}%
                            </Badge>
                          </HStack>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm">
                          Readings: {device.total_readings}
                        </Text>
                        <Text fontSize="xs" color={textColor}>
                          Last seen: {getTimeSinceLastSeen(device.last_seen)}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      {device.last_reading ? (
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm">
                            Temp: {device.last_reading.temperature}°C
                          </Text>
                          <Text fontSize="sm">
                            Humidity: {device.last_reading.humidity}%
                          </Text>
                          <Text fontSize="xs" color={textColor}>
                            {formatDate(device.last_reading.timestamp)}
                          </Text>
                        </VStack>
                      ) : (
                        <Text fontSize="sm" color={textColor}>No readings</Text>
                      )}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="View device"
                          icon={<ViewIcon />}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(device)}
                        />
                        <IconButton
                          aria-label="Edit device"
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleEdit(device)}
                        />
                        <IconButton
                          aria-label="Toggle status"
                          icon={device.status === 'ACTIVE' ? <CloseIcon /> : <CheckIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme={device.status === 'ACTIVE' ? 'red' : 'green'}
                          onClick={() => toggleStatus(device)}
                        />
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="More actions"
                            icon={<ChevronDownIcon />}
                            size="sm"
                            variant="ghost"
                          />
                          <MenuList>
                            <MenuItem
                              icon={<SettingsIcon />}
                              onClick={() => handleEdit(device)}
                            >
                              Configure
                            </MenuItem>
                            <MenuItem
                              icon={<SettingsIcon />}
                              onClick={() => {
                                // Handle device restart
                                toast({
                                  title: 'Device Restart',
                                  description: 'Restart command sent to device',
                                  status: 'info',
                                  duration: 3000,
                                  isClosable: true,
                                });
                              }}
                            >
                              Restart Device
                            </MenuItem>
                            <MenuItem
                              icon={<DeleteIcon />}
                              color="red.500"
                              onClick={() => handleDeleteClick(device)}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedDevice ? 'Edit Device' : 'Create New Device'}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Tabs>
                <TabList>
                  <Tab>Basic Info</Tab>
                  <Tab>Network</Tab>
                  <Tab>Configuration</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Farm</FormLabel>
                        <Select
                          value={formData.farm}
                          onChange={(e) => setFormData({ ...formData, farm: parseInt(e.target.value) })}
                          placeholder="Select farm"
                        >
                          {farms.map(farm => (
                            <option key={farm.id} value={farm.id}>
                              {farm.name} - {farm.farmer.user.first_name} {farm.farmer.user.last_name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Device Type</FormLabel>
                        <Select
                          value={formData.device_type}
                          onChange={(e) => setFormData({ ...formData, device_type: parseInt(e.target.value) })}
                          placeholder="Select device type"
                        >
                          {deviceTypes.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name} - {type.description}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Device Name</FormLabel>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter device name"
                        />
                      </FormControl>

                      <HStack spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel>Serial Number</FormLabel>
                          <Input
                            value={formData.serial_number}
                            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                            placeholder="Enter serial number"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Firmware Version</FormLabel>
                          <Input
                            value={formData.firmware_version}
                            onChange={(e) => setFormData({ ...formData, firmware_version: e.target.value })}
                            placeholder="Enter firmware version"
                          />
                        </FormControl>
                      </HStack>

                      <FormControl isRequired>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="MAINTENANCE">Maintenance</option>
                          <option value="ERROR">Error</option>
                        </Select>
                      </FormControl>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>IP Address</FormLabel>
                        <Input
                          value={formData.ip_address}
                          onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                          placeholder="Enter IP address"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>MAC Address</FormLabel>
                        <Input
                          value={formData.mac_address}
                          onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
                          placeholder="Enter MAC address"
                        />
                      </FormControl>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>Sampling Interval (seconds)</FormLabel>
                        <Input
                          type="number"
                          value={formData.configuration.sampling_interval}
                          onChange={(e) => setFormData({
                            ...formData,
                            configuration: {
                              ...formData.configuration,
                              sampling_interval: parseInt(e.target.value) || 300
                            }
                          })}
                          placeholder="Enter sampling interval"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Data Transmission Interval (seconds)</FormLabel>
                        <Input
                          type="number"
                          value={formData.configuration.data_transmission_interval}
                          onChange={(e) => setFormData({
                            ...formData,
                            configuration: {
                              ...formData.configuration,
                              data_transmission_interval: parseInt(e.target.value) || 3600
                            }
                          })}
                          placeholder="Enter transmission interval"
                        />
                      </FormControl>

                      <Divider />

                      <Text fontWeight="semibold">Alert Thresholds</Text>

                      <HStack spacing={4} w="full">
                        <FormControl>
                          <FormLabel>Min Temperature (°C)</FormLabel>
                          <Input
                            type="number"
                            value={formData.configuration.alert_thresholds.temperature_min}
                            onChange={(e) => setFormData({
                              ...formData,
                              configuration: {
                                ...formData.configuration,
                                alert_thresholds: {
                                  ...formData.configuration.alert_thresholds,
                                  temperature_min: parseInt(e.target.value) || 15
                                }
                              }
                            })}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Max Temperature (°C)</FormLabel>
                          <Input
                            type="number"
                            value={formData.configuration.alert_thresholds.temperature_max}
                            onChange={(e) => setFormData({
                              ...formData,
                              configuration: {
                                ...formData.configuration,
                                alert_thresholds: {
                                  ...formData.configuration.alert_thresholds,
                                  temperature_max: parseInt(e.target.value) || 35
                                }
                              }
                            })}
                          />
                        </FormControl>
                      </HStack>

                      <HStack spacing={4} w="full">
                        <FormControl>
                          <FormLabel>Min Humidity (%)</FormLabel>
                          <Input
                            type="number"
                            value={formData.configuration.alert_thresholds.humidity_min}
                            onChange={(e) => setFormData({
                              ...formData,
                              configuration: {
                                ...formData.configuration,
                                alert_thresholds: {
                                  ...formData.configuration.alert_thresholds,
                                  humidity_min: parseInt(e.target.value) || 40
                                }
                              }
                            })}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Max Humidity (%)</FormLabel>
                          <Input
                            type="number"
                            value={formData.configuration.alert_thresholds.humidity_max}
                            onChange={(e) => setFormData({
                              ...formData,
                              configuration: {
                                ...formData.configuration,
                                alert_thresholds: {
                                  ...formData.configuration.alert_thresholds,
                                  humidity_max: parseInt(e.target.value) || 80
                                }
                              }
                            })}
                          />
                        </FormControl>
                      </HStack>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>

            <Box p={6} pt={0}>
              <HStack spacing={3} justify="flex-end">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText="Saving..."
                >
                  {selectedDevice ? 'Update' : 'Create'}
                </Button>
              </HStack>
            </Box>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Device</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete device "{selectedDevice?.name}"?
              This action cannot be undone and will also delete all associated readings and data.
            </Text>
          </ModalBody>
          <Box p={6} pt={0}>
            <HStack spacing={3} justify="flex-end">
              <Button variant="ghost" onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                leftIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </HStack>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DeviceManagement;
