import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosApi from '../axiosApi';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';

interface Category {
  id: number;
  name: string;
}

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axiosApi.get(`/posts/${id}/`).then((res) => {
      setTitle(res.data.title);
      setContent(res.data.content);
      setCategory(res.data.category.id);
    });

    axiosApi.get('/categories/').then((res) => setCategories(res.data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axiosApi.put(`/posts/${id}/`, { title, content, category });
    navigate(`/posts/${id}`);
  };

  return (
    <Box maxWidth="sm" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        Редактировать пост
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Контент"
          value={content}
          multiline
          rows={4}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          select
          label="Категория"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          margin="normal"
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Обновить пост
        </Button>
      </form>
    </Box>
  );
}
