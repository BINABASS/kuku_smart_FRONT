import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const BatchList = ({ batches, onEdit, onDelete, useSample }) => {
    if (!batches || batches.length === 0) {
        return <div>No batches found.</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Farm</TableCell>
                        <TableCell>Breed</TableCell>
                        <TableCell>Arrival Date</TableCell>
                        <TableCell>Initial Age</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {batches.map((batch) => (
                        <TableRow key={batch.batchID}>
                            <TableCell>{batch.farm_name}</TableCell>
                            <TableCell>{batch.breed_name}</TableCell>
                            <TableCell>{batch.arrive_date}</TableCell>
                            <TableCell>{batch.init_age}</TableCell>
                            <TableCell>{batch.quantity}</TableCell>
                            <TableCell>{batch.batch_status ? 'Active' : 'Inactive'}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(batch)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(batch.batchID)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BatchList;
