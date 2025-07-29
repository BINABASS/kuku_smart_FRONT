import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ActivityList = ({ activities, onEdit, onDelete, useSample }) => {
    if (!activities || activities.length === 0) {
        return <div>No activities found.</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Batch</TableCell>
                        <TableCell>Activity Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Day</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activities.map((activity) => (
                        <TableRow key={activity.activityID}>
                            <TableCell>{activity.batch?.farm?.name || 'N/A'}</TableCell>
                            <TableCell>{activity.activityName}</TableCell>
                            <TableCell>{activity.activityDescription}</TableCell>
                            <TableCell>{activity.activityDay}</TableCell>
                            <TableCell>
                                {activity.activity_status ? 'Active' : 'Inactive'}
                            </TableCell>
                            <TableCell>{activity.activity_frequency}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(activity)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(activity.activityID)} color="error">
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

export default ActivityList;