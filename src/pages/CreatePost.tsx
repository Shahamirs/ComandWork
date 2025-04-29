import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../axiosApi';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from '@mui/material';

interface Category {
  id: number;
  name: string;
}

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверка авторизации
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
    }

    // Получение категорий
    axiosApi
      .get('/categories/')
      .then((res) => setCategories(res.data))
      .catch((error) => console.error('Ошибка получения категорий:', error));
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosApi.post('/posts/', { title, content, category_id: category });
      navigate('/');
    } catch (error) {
      console.error('Ошибка при создании поста:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      }
    }
  };

  return (
    <Box maxWidth="sm" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        Создать пост
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
          Сохранить
        </Button>
      </form>
    </Box>
  );
}