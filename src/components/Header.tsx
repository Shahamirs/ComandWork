import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {useAuthStore} from '../store/useAuthStore.ts';
import {Link, useNavigate} from 'react-router';
import {Button} from '@mui/material';


export default function Header() {
  const navigate = useNavigate();
  const {clearTokens} = useAuthStore();
  const token = localStorage.getItem('accessToken');

  const logOut = async () => {
    clearTokens();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>

        <Typography variant="h6" component="div" sx={{flexGrow: 1}} style={{cursor: 'pointer'}} onClick={() => navigate('/')}>
          Blog rest api
        </Typography>
        {token && (
          <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
            <Link to={'/create-post'} style={{color: 'white', textDecoration: 'none'}}>Create Post</Link>
            <Button onClick={logOut} style={{color: 'white'}}>Log Out</Button>
          </div>
        )}
        {
          !token &&
          <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
            <Link to={'/login'} style={{color: 'white', textDecoration: 'none'}}>Login</Link>
            <Link to={'/register'} style={{color: 'white', textDecoration: 'none'}}>Register</Link>
          </div>
        }
      </Toolbar>
    </AppBar>
  );
}
