import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const UserList = ({ users, roles, onEdit, onDelete, onCreate }) => {
  const [open, setOpen] = React.useState(false);
  const [newUser, setNewUser] = React.useState({
    name: '',
    email: '',
    role: 'farmer'
  });

  const handleCreateOpen = () => {
    setOpen(true);
  };

  const handleCreateClose = () => {
    setOpen(false);
    setNewUser({ name: '', email: '', role: 'farmer' });
  };

  const handleCreateSubmit = () => {
    onCreate(newUser);
    handleCreateClose();
  };

  const getStatusColor = (status) => {
    return status === 'active' ? '#4CAF50' : '#F44336';
  };

  const getStatusIcon = (status) => {
    return status === 'active' ? <CheckCircleIcon /> : <ErrorIcon />;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOpen}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: getStatusColor(user.status) }} />
                    {user.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon sx={{ fontSize: 16 }} />
                    {user.email}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={user.role}
                    color={user.role === 'admin' ? 'primary' : user.role === 'manager' ? 'secondary' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={user.status}
                    color={user.status === 'active' ? 'success' : 'error'}
                    icon={getStatusIcon(user.status)}
                  />
                </TableCell>
                <TableCell>
                  {new Date(user.lastLogin).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={user.subscription}
                    color={user.paymentStatus === 'paid' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => onEdit(user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => onDelete(user.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={open} onClose={handleCreateClose}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Cancel</Button>
          <Button onClick={handleCreateSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
