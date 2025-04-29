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
} from '@mui/material';

interface Post {
  id: number;
  title: string;
  content: string;
  category: { id: number; name: string };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axiosApi.get('/posts/').then((res) => setPosts(res.data));
  }, []);

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
                <Typography variant="h5" component={Link} to={`/posts/${post.id}`} style={{ textDecoration: 'none' }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.content.slice(0, 100)}...
                </Typography>
                <Typography variant="caption" display="block">
                  Категория: {post.category.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
