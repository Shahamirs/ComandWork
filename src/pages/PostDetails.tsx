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
} from '@mui/material';

interface Post {
  id: number;
  title: string;
  content: string;
  category: { id: number; name: string };
}

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    axiosApi
      .get(`/posts/${id}/`)
      .then((res) => setPost(res.data))
      .catch(() => setPost(null));
  }, [id]);

  const handleDelete = async () => {
    try {
      await axiosApi.delete(`/posts/${id}/`);
      navigate('/');
    } catch (e) {
      alert('Ошибка при удалении поста');
    }
  };

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
            Категория: {post.category.name}
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
