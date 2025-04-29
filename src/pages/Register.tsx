import {useState} from 'react';
import {Box, Button, Container, Paper, TextField, Typography} from '@mui/material';
import axiosApi from '../axiosApi.ts';
import {useNavigate} from 'react-router';
import {IAuth} from '../types.ts';

export const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (password !== repeatPassword) {
        setError('Passwords do not match!');
        return;
      }

      const requestData: IAuth = { username, password, password_confirm: repeatPassword };
      await axiosApi.post('/users/', requestData);

      navigate('/login');
    } catch (error) {
      setError('Registration failed. Try another username.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>Register</Typography>

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

          <TextField
            fullWidth
            label="Repeat Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />

          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, borderRadius: 2 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

