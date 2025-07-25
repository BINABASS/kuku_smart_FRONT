import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tab,
    Tabs,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Chip,
} from '@mui/material';
import axios from 'axios';

const KnowledgeBaseForm = ({ open, onClose, article = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        tags: [],
    });

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title,
                category: article.category,
                content: article.content,
                tags: article.tags || [],
            });
        }
    }, [article]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleTagAdd = (tag) => {
        setFormData({
            ...formData,
            tags: [...formData.tags, tag],
        });
    };

    const handleTagDelete = (tagToDelete) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(tag => tag !== tagToDelete),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                tags: formData.tags.join(','),
            };

            if (article) {
                await axios.put(`http://localhost:8000/api/knowledge-base/${article.articleID}/`, data);
            } else {
                await axios.post('http://localhost:8000/api/knowledge-base/', data);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting article:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>{article ? 'Edit Article' : 'Add New Article'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="Health">Health</MenuItem>
                                <MenuItem value="Nutrition">Nutrition</MenuItem>
                                <MenuItem value="Breeding">Breeding</MenuItem>
                                <MenuItem value="Management">Management</MenuItem>
                                <MenuItem value="Diseases">Diseases</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Tags"
                            name="tags"
                            value={formData.tags.join(', ')}
                            onChange={(e) => handleTagAdd(e.target.value)}
                            fullWidth
                            helperText="Press Enter to add a tag"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    handleTagAdd(e.target.value.trim());
                                    e.target.value = '';
                                }
                            }}
                        />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {formData.tags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleTagDelete(tag)}
                                    size="small"
                                />
                            ))}
                        </Box>
                        <TextField
                            label="Content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={10}
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {article ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default KnowledgeBaseForm;
