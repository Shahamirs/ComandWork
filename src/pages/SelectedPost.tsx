import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosApi from '../axiosApi';

interface Post {
  id: number;
  title: string;
  content: string;
  category: { id: number; name: string };
}

export default function SelectedPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    axiosApi.get(`/posts/${id}/`)
      .then(res => setPost(res.data))
      .catch(console.error);
  }, [id]);

  const handleDelete = () => {
    axiosApi.delete(`/posts/${id}/`)
      .then(() => navigate('/'))
      .catch(console.error);
  };

  if (!post) return <p>Загрузка...</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>Категория: {post.category.name}</p>
      <div>{post.content}</div>
      <button onClick={handleDelete}>Удалить пост</button>
      <Link to={`/posts/${id}/edit`}>Редактировать</Link>
      <br />
      <Link to="/">← Все посты</Link>
    </div>
  );
}
