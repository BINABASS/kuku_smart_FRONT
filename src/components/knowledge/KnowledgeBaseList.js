import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const KnowledgeBaseList = ({ onEdit }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/knowledge-base/');
            setArticles(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/knowledge-base/${id}/`);
            fetchArticles();
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {articles.map((article) => (
                        <TableRow key={article.articleID}>
                            <TableCell>{article.title}</TableCell>
                            <TableCell>{article.category}</TableCell>
                            <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(article.updated_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => onEdit(article)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(article.articleID)}>
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

export default KnowledgeBaseList;
