import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosApi from '../axiosApi';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';

interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number | null;
}

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
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

    axiosApi
      .get(`/posts/${id}/`)
      .then((postRes) => {
        console.log('Загруженный пост:', postRes.data);
        setPost(postRes.data);

        if (postRes.data.category_id) {
          axiosApi
            .get(`/categories/${postRes.data.category_id}/`)
            .then((categoryRes) => {
              console.log('Категория:', categoryRes.data);
              setCategoryName(categoryRes.data.name);
            })
            .catch((err) => {
              console.error('Ошибка загрузки категории:', err.response?.data || err.message);
              setCategoryName(`Ошибка (ID: ${postRes.data.category_id})`);
            });
        } else {
          setCategoryName('Без категории');
        }
      })
      .catch((error) => {
        console.error('Ошибка загрузки поста:', error.response?.data || error.message);
        setError('Не удалось загрузить пост. Попробуй снова.');
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Попытка удаления поста:', { postId: id, accessTokenExists: !!accessToken });

    if (!accessToken) {
      alert('Ты не авторизован, зайди в аккаунт!');
      navigate('/login');
      return;
    }

    try {
      await axiosApi.delete(`/posts/${id}/`);
      console.log('Пост удален:', id);
      navigate('/');
    } catch (error) {
      console.error('Ошибка удаления поста:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert('Ошибка авторизации. Зайди заново.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert('У тебя нет прав удалять этот пост.');
      } else {
        alert('Ошибка удаления поста: ' + (error.response?.data?.detail || error.message));
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
      <Box maxWidth="md" mx="auto" mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!post) return <Typography variant="h6">Пост не найден</Typography>;

  return (
    <Box maxWidth="600px" mx="auto" mt={4}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Категория: {categoryName || 'Загрузка...'}
          </Typography>

          <Stack direction="row" spacing={2} mt={3}>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Удалить
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to={`/posts/${post.id}/edit`}
            >
              Редактировать
            </Button>
            <Button
              variant="text"
              component={Link}
              to="/"
            >
              Назад
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}