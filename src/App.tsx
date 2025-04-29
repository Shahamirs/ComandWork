import { CssBaseline } from '@mui/material';
import { Routes, Route } from 'react-router';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import Home from './pages/Home.tsx';
import CreatePost from './pages/CreatePost.tsx';
import EditPost from './pages/EditPost.tsx';
import PostDetails from './pages/PostDetails.tsx';
import CreateCategory from './pages/CreateCategory.tsx';
import EditCategory from './pages/EditCategory.tsx';
import Header from './components/Header.tsx';

function App() {
  return (
    <>
      <CssBaseline />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
        <Route path="/categories/create" element={<CreateCategory />} />
        <Route path="/categories/:id/edit" element={<EditCategory />} />
      </Routes>
    </>
  );
}

export default App;
