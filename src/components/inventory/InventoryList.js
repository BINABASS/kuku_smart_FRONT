import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const getStatusColor = (quantity, minThreshold, maxThreshold) => {
  if (quantity <= minThreshold) return 'error';
  if (quantity >= maxThreshold) return 'success';
  return 'warning';
};

const InventoryList = ({
  inventory,
  onEdit,
  onDelete,
  showLowStockOnly = false,
  showExpiringOnly = false
}) => {
  const filteredInventory = inventory.filter(item => {
    if (showLowStockOnly) return item.quantity <= item.minThreshold;
    if (showExpiringOnly) return new Date(item.expiration) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return true;
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Expiration</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInventory.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Chip
                  label={item.type}
                  size="small"
                  color={getStatusColor(item.quantity, item.minThreshold, item.maxThreshold)}
                />
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography>{item.quantity}</Typography>
                  <Typography variant="caption">{item.unit}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={item.quantity <= item.minThreshold ? 'Low Stock' : 'In Stock'}
                  color={getStatusColor(item.quantity, item.minThreshold, item.maxThreshold)}
                  size="small"
                />
              </TableCell>
              <TableCell>{item.supplier}</TableCell>
              <TableCell>
                {new Date(item.expiration).toLocaleDateString()}
                {new Date(item.expiration) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                  <Tooltip title="Expiring soon">
                    <WarningIcon color="warning" fontSize="small" />
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <IconButton size="small" onClick={() => onEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => onDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryList;
