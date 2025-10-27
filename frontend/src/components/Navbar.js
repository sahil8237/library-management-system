import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/books');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/books" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Online Library
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                color="default"
              />
            }
            label={
              <IconButton sx={{ color: 'inherit', p: 0 }}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            }
            sx={{ mr: 2 }}
          />
          <Button color="inherit" component={Link} to="/books">
            Books
          </Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/admin/books">
                Admin Panel
              </Button>
              <Button color="inherit" component={Link} to="/admin/analytics">
                Analytics
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/admin/login">
              Admin Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
