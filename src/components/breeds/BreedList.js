import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const BreedList = ({ breeds, onEdit, onDelete, useSample }) => {
    if (!breeds || breeds.length === 0) {
        return <div>No breeds found.</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Activities</TableCell>
                        <TableCell>Conditions</TableCell>
                        <TableCell>Feedings</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {breeds.map((breed) => (
                        <TableRow key={breed.breedID}>
                            <TableCell>{breed.name}</TableCell>
                            <TableCell>{breed.description}</TableCell>
                            <TableCell>
                                {breed.activities?.length || 0}
                            </TableCell>
                            <TableCell>
                                {breed.conditions?.length || 0}
                            </TableCell>
                            <TableCell>
                                {breed.feedings?.length || 0}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(breed)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => onDelete(breed.breedID)} color="error">
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

export default BreedList;
