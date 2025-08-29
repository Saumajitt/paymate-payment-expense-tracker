import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  Payment,
  Receipt,
  Group,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return '/dashboard';
    if (path.includes('/payments')) return '/payments';
    if (path.includes('/expenses')) return '/expenses';
    if (path.includes('/groups')) return '/groups';
    return '/dashboard';
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PayMate
        </Typography>
        
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Tabs
            value={getCurrentTab()}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab
              icon={<Dashboard />}
              label="Dashboard"
              value="/dashboard"
              sx={{ color: 'white', minWidth: 120 }}
            />
            <Tab
              icon={<Payment />}
              label="Payments"
              value="/payments"
              sx={{ color: 'white', minWidth: 120 }}
            />
            <Tab
              icon={<Receipt />}
              label="Expenses"
              value="/expenses"
              sx={{ color: 'white', minWidth: 120 }}
            />
            <Tab
              icon={<Group />}
              label="Groups"
              value="/groups"
              sx={{ color: 'white', minWidth: 120 }}
            />
          </Tabs>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
