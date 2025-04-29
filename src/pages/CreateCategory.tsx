import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../axiosApi';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function CreateCategory() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axiosApi.post('/categories/', { name });
    navigate('/');
  };

  return (
    <Box maxWidth="sm" mx="auto" mt={4}>
      <Typography variant="h4" gutterBottom>
        Создать категорию
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
          Сохранить
        </Button>
      </form>
    </Box>
  );
}
