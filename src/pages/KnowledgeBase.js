import React, { useState } from 'react';
import { Box, Button, Typography, Grid, Paper, TextField } from '@mui/material';
import KnowledgeBaseList from '../components/knowledge/KnowledgeBaseList';
import KnowledgeBaseForm from '../components/knowledge/KnowledgeBaseForm';

const KnowledgeBasePage = () => {
    const [openForm, setOpenForm] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenForm = (article = null) => {
        setSelectedArticle(article);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setSelectedArticle(null);
        setOpenForm(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Knowledge Base
                    </Typography>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    label="Search articles"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by title or tags"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleOpenForm()}
                                    fullWidth
                                >
                                    Add New Article
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <KnowledgeBaseList onEdit={handleOpenForm} />
                </Grid>
            </Grid>
            <KnowledgeBaseForm
                open={openForm}
                onClose={handleCloseForm}
                article={selectedArticle}
            />
        </Box>
    );
};

export default KnowledgeBasePage;
