import { useState, useEffect } from 'react';
import { Paper, Box, Typography, CircularProgress, Alert } from '@mui/material';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import api from '../api/client';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/users/${userId}/`);
      setUsers(users.filter((user) => user.id !== userId));
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const handleCreate = async (newUser) => {
    try {
      const response = await api.post('/users/', newUser);
      setUsers([...users, response.data]);
      setSuccessMessage('User created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  const handleUpdate = async (updatedUser) => {
    try {
      const response = await api.put(`/users/${updatedUser.id}/`, updatedUser);
      setUsers(users.map((user) => 
        user.id === updatedUser.id ? response.data : user
      ));
      setEditOpen(false);
      setSuccessMessage('User updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
    }
  };

  const handleSuccess = () => {
    fetchUsers();
    setSuccessMessage('Operation completed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <UserList
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
          onSuccess={handleSuccess}
        />
      </Paper>
      
      <UserForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={editUser}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default Users; 