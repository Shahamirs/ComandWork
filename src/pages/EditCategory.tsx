import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosApi from '../axiosApi';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function EditCategory() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axiosApi.get(`/categories/${id}/`).then((res) => {
      setName(res.data.name);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axiosApi.put(`/categories/${id}/`, { name });
    navigate('/');
  };

  return (
    <Box maxWidth="sm" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        Редактировать категорию
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Название категории"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Обновить
        </Button>
      </form>
    </Box>
  );
}
