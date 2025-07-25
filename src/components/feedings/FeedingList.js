import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const FeedingList = ({ feedings, onEdit, onDelete, useSample }) => {
    if (!feedings || feedings.length === 0) {
        return <div>No feedings found.</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Batch</TableCell>
                        <TableCell>Feeding Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {feedings.map((feeding) => (
                        <TableRow key={feeding.batchFeedingID}>
                            <TableCell>
                                {feeding.batch?.farm?.name || 'N/A'} -
                                {feeding.batch?.breed?.name || 'N/A'}
                            </TableCell>
                            <TableCell>{feeding.feeding_date}</TableCell>
                            <TableCell>{feeding.feeding_amount}</TableCell>
                            <TableCell>
                                {feeding.status ? 'Completed' : 'Pending'}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(feeding)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(feeding.batchFeedingID)} color="error">
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

export default FeedingList;
