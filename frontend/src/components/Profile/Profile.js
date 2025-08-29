import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  CreditCard,
  Delete,
  Add,
  Security,
  Notifications
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242', isDefault: true },
    { id: 2, type: 'MasterCard', last4: '5555', isDefault: false }
  ]);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    expenseReminders: true,
    twoFactorAuth: false
  });

  const handleSave = async () => {
    try {
      // API call to update profile would go here
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || ''
    });
    setEditing(false);
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Personal Information</Typography>
              {!editing ? (
                <Button
                  startIcon={<Edit />}
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <Box>
                  <Button
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{ mr: 1 }}
                    variant="contained"
                  >
                    Save
                  </Button>
                  <Button
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                  disabled={!editing}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Payment Methods */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Payment Methods</Typography>
              <Button startIcon={<Add />} variant="outlined">
                Add Card
              </Button>
            </Box>
            <List>
              {paymentMethods.map((method) => (
                <ListItem key={method.id}>
                  <CreditCard sx={{ mr: 2 }} />
                  <ListItemText
                    primary={`${method.type} ending in ${method.last4}`}
                    secondary={method.isDefault ? 'Default payment method' : ''}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Profile Picture & Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Member since January 2024
            </Typography>
            <Button variant="outlined" size="small" sx={{ mt: 2 }}>
              Change Photo
            </Button>
          </Paper>

          {/* Account Settings */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <List>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={handleSettingChange('emailNotifications')}
                    />
                  }
                  label="Email Notifications"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={handleSettingChange('pushNotifications')}
                    />
                  }
                  label="Push Notifications"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.expenseReminders}
                      onChange={handleSettingChange('expenseReminders')}
                    />
                  }
                  label="Expense Reminders"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.twoFactorAuth}
                      onChange={handleSettingChange('twoFactorAuth')}
                    />
                  }
                  label="Two-Factor Authentication"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
