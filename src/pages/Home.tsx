import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosApi from '../axiosApi';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

interface Post {
  id: number;
  title: string;
  content: string;
  category_id: number | null;
}

interface Category {
  id: number;
  name: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categoryNames, setCategoryNames] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError(null);

    axiosApi
      .get('/posts/')
      .then(async (postsRes) => {
        console.log('Загруженные посты:', postsRes.data);
        setPosts(postsRes.data);

        // Собираем уникальные category_id из постов
        const uniqueCategoryIds = [...new Set(
          postsRes.data
            .map((post: Post) => post.category_id)
            .filter((id: number | null): id is number => id !== null)
        )];

        // Запрашиваем название каждой категории
        const categoryPromises = uniqueCategoryIds.map((id) =>
          axiosApi
            .get(`/categories/${id}/`)
            .then((res) => {
              console.log(`Категория ${id}:`, res.data);
              return { id, name: res.data.name };
            })
            .catch((err) => {
              console.error(`Ошибка загрузки категории ${id}:`, err.response?.data || err.message);
              return { id, name: `Ошибка (ID: ${id})` };
            })
        );

        const categoryResults = await Promise.all(categoryPromises);
        const newCategoryNames = categoryResults.reduce(
          (acc, { id, name }) => ({ ...acc, [id]: name }),
          {}
        );
        console.log('Имена категорий:', newCategoryNames);
        setCategoryNames(newCategoryNames);
      })
      .catch((error) => {
        console.error('Ошибка загрузки постов:', error.response?.data || error.message);
        setError('Не удалось загрузить посты. Попробуй снова.');
      })
      .finally(() => setLoading(false));
  }, []);

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return 'Без категории';
    return categoryNames[categoryId] || 'Загрузка...';
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

  return (
    <Box maxWidth="md" mx="auto" mt={4}>
      <Typography variant="h3" gutterBottom>
        Все посты
      </Typography>

      <Box mb={3}>
        <Button component={Link} to="/create-post" variant="contained" sx={{ mr: 2 }}>
          Создать пост
        </Button>
        <Button component={Link} to="/categories/create" variant="outlined">
          Создать категорию
        </Button>
      </Box>

      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="h5"
                  component={Link}
                  to={`/posts/${post.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content.slice(0, 100)}...
                </Typography>
                <Typography variant="caption" display="block">
                  Категория: {getCategoryName(post.category_id)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}