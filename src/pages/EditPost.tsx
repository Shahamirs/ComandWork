import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosApi from '../axiosApi';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    Promise.all([
      axiosApi.get(`/posts/${id}/`),
      axiosApi.get('/categories/')
    ])
      .then(([postRes, categoriesRes]) => {
        console.log('Загруженный пост:', postRes.data);
        console.log('Загруженные категории:', categoriesRes.data);
        setTitle(postRes.data.title);
        setContent(postRes.data.content);
        setCategory(postRes.data.category_id);
        setCategories(categoriesRes.data);
      })
      .catch((error) => {
        console.error('Ошибка загрузки данных:', error.response?.data || error.message);
        setError('Не удалось загрузить данные поста или категории. Попробуйте позже.');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      alert('Пожалуйста, выберите категорию.');
      return;
    }

    const payload = { title, content, category_id: Number(category) };
    console.log('Отправляемые данные:', payload);

    try {
      const response = await axiosApi.put(`/posts/${id}/`, payload);
      console.log('Ответ сервера:', response.data);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Ошибка при обновлении поста:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert('Ошибка авторизации. Пожалуйста, войдите снова.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('У вас нет прав для редактирования этого поста.');
      } else {
        const errorMessage = error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message;
        alert('Ошибка при обновлении поста: ' + errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth="sm" mx="auto" mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
          required
        />
        <TextField
          fullWidth
          label="Контент"
          value={content}
          multiline
          rows={4}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          select
          label="Категория"
          value={category ?? ''}
          onChange={(e) => setCategory(Number(e.target.value))}
          margin="normal"
          required
        >
          {categories.length === 0 ? (
            <MenuItem disabled>Категории не найдены</MenuItem>
          ) : (
            categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))
          )}
        </TextField>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Обновить пост
        </Button>
      </form>
    </Box>
  );
}