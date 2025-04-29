import { useState } from 'react';
import {Container, TextField, Button, Box, Typography, Paper, Alert} from '@mui/material';
import axiosApi from '../axiosApi.ts';
import { useAuthStore } from '../store/useAuthStore.ts';
import { useNavigate } from 'react-router';
import { IAuth } from '../types.ts';

export const Login = () => {
  const { setTokens } = useAuthStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const requestData: IAuth = { username, password };
      const { data } = await axiosApi.post('/token/', requestData);
      console.log(data);
      setTokens(data.access, data?.refresh);
      navigate('/');
    } catch (error) {
      console.error(error);
      setError('Login failed! Try one more time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>Login</Typography>

        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error &&
            <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, borderRadius: 2 }}
          >
            Login
          </Button>

        </Box>
      </Paper>
    </Container>
  );
};

