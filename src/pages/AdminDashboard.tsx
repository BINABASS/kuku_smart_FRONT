import { Heading, Box, Text } from '@chakra-ui/react';

export default function AdminDashboard() {
  return (
    <Box p={6}>
      <Box display="flex" flexDirection="column" gap={6} w="100%">
        <Heading as="h1" size="xl">Admin Dashboard</Heading>
        <Text>Welcome to the Admin Dashboard. Here you can manage all aspects of the application.</Text>
        
        {/* Admin-specific content */}
        <Box 
          p={6} 
          borderWidth="1px" 
          borderRadius="lg"
          boxShadow="md"
          bg="white"
          _dark={{ bg: 'gray.700' }}
        >
          <Heading size="md" mb={4}>System Overview</Heading>
          <Text>Manage users, view system metrics, and configure application settings.</Text>
        </Box>
      </Box>
    </Box>
  );
}
