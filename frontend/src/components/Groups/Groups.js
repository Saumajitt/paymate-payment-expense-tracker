import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Avatar,
  AvatarGroup,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Add,
  Group,
  Person,
  Receipt,
  Settings
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateGroupDialog = ({ open, onClose, onSuccess }) => {
  const [groupData, setGroupData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // API call would go here
      toast.success('Group created successfully!');
      onSuccess();
      onClose();
      setGroupData({ name: '', description: '' });
    } catch (error) {
      toast.error('Failed to create group');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Group</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Group Name"
              value={groupData.name}
              onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={groupData.description}
              onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !groupData.name}
        >
          {loading ? 'Creating...' : 'Create Group'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      // Simulate group data
      setGroups([
        {
          id: 1,
          name: 'Roommates',
          description: 'House expenses and utilities',
          memberCount: 4,
          totalExpenses: 1250.75,
          pendingExpenses: 3,
          members: [
            { id: 1, name: 'You', avatar: 'Y' },
            { id: 2, name: 'John', avatar: 'J' },
            { id: 3, name: 'Jane', avatar: 'Ja' },
            { id: 4, name: 'Bob', avatar: 'B' }
          ],
          recentExpenses: [
            { id: 1, title: 'Electricity Bill', amount: 120.50, date: '2024-01-15' },
            { id: 2, title: 'Groceries', amount: 85.30, date: '2024-01-14' }
          ]
        },
        {
          id: 2,
          name: 'Trip to Europe',
          description: 'Summer vacation expenses',
          memberCount: 6,
          totalExpenses: 3200.00,
          pendingExpenses: 1,
          members: [
            { id: 1, name: 'You', avatar: 'Y' },
            { id: 2, name: 'Sarah', avatar: 'S' },
            { id: 3, name: 'Mike', avatar: 'M' },
            { id: 4, name: 'Lisa', avatar: 'L' },
            { id: 5, name: 'Tom', avatar: 'T' },
            { id: 6, name: 'Amy', avatar: 'A' }
          ],
          recentExpenses: [
            { id: 1, title: 'Hotel Booking', amount: 800.00, date: '2024-01-10' },
            { id: 2, title: 'Flight Tickets', amount: 1200.00, date: '2024-01-08' }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Groups</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Create Group
        </Button>
      </Box>

      <Grid container spacing={3}>
        {groups.map((group) => (
          <Grid item xs={12} md={6} key={group.id}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {group.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {group.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${group.pendingExpenses} pending`}
                    color={group.pendingExpenses > 0 ? 'warning' : 'success'}
                    size="small"
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <AvatarGroup max={4}>
                    {group.members.map((member) => (
                      <Avatar key={member.id} sx={{ width: 32, height: 32 }}>
                        {member.avatar}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                  <Typography variant="body2" color="textSecondary">
                    {group.memberCount} members
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Box textAlign="center">
                    <Typography variant="h6" color="primary">
                      ${group.totalExpenses.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Expenses
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h6" color="warning.main">
                      {group.pendingExpenses}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Pending
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Recent Expenses
                </Typography>
                <List dense>
                  {group.recentExpenses.slice(0, 2).map((expense) => (
                    <ListItem key={expense.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                          <Receipt sx={{ fontSize: 16 }} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={expense.title}
                        secondary={expense.date}
                        primaryTypographyProps={{ variant: 'body2' }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        ${expense.amount.toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Receipt />}>
                  View Expenses
                </Button>
                <Button size="small" startIcon={<Settings />}>
                  Manage
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Group Details Dialog */}
      {selectedGroup && (
        <Dialog open={!!selectedGroup} onClose={() => setSelectedGroup(null)} maxWidth="md" fullWidth>
          <DialogTitle>{selectedGroup.name}</DialogTitle>
          <DialogContent>
            {/* Group details would go here */}
          </DialogContent>
        </Dialog>
      )}

      <CreateGroupDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={fetchGroups}
      />
    </Box>
  );
};

export default Groups;
