import { useState, useEffect } from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';
import { api as mockApi } from '../utils/mockApi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await mockApi.get('/users');
        const rolesResponse = await mockApi.get('/roles');
        setUsers(usersResponse.data);
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      // In a real app, this would make an API call to delete the user
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCreate = async (newUser) => {
    try {
      // In a real app, this would make an API call to create a new user
      const newUserWithId = { ...newUser, id: `user${Date.now()}` };
      setUsers([...users, newUserWithId]);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdate = async (updatedUser) => {
    try {
      // In a real app, this would make an API call to update the user
      setUsers(users.map((user) => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
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
      <Paper sx={{ p: 3 }}>
        <UserList
          users={users}
          roles={roles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      </Paper>
      <UserForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={editUser}
        roles={roles}
        onSubmit={handleUpdate}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default Users; 