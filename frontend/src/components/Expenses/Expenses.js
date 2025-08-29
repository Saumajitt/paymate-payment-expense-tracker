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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
  IconButton
} from '@mui/material';
import {
  Add,
  Receipt,
  Group,
  Person,
  Edit,
  Delete,
  Check
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateExpenseDialog = ({ open, onClose, onSuccess }) => {
  const [expenseData, setExpenseData] = useState({
    title: '',
    description: '',
    totalAmount: '',
    splitType: 'EQUAL',
    participantIds: [],
    groupId: null
  });
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (open) {
      // Fetch users for participant selection
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
      ]);
    }
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('/api/expenses', {
        ...expenseData,
        totalAmount: parseFloat(expenseData.totalAmount)
      });
      toast.success('Expense created successfully!');
      onSuccess();
      onClose();
      setExpenseData({
        title: '',
        description: '',
        totalAmount: '',
        splitType: 'EQUAL',
        participantIds: [],
        groupId: null
      });
    } catch (error) {
      toast.error('Failed to create expense: ' + error.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Expense</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Expense Title"
              value={expenseData.title}
              onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={expenseData.description}
              onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Total Amount"
              type="number"
              value={expenseData.totalAmount}
              onChange={(e) => setExpenseData({ ...expenseData, totalAmount: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Split Type</InputLabel>
              <Select
                value={expenseData.splitType}
                label="Split Type"
                onChange={(e) => setExpenseData({ ...expenseData, splitType: e.target.value })}
              >
                <MenuItem value="EQUAL">Equal Split</MenuItem>
                <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                <MenuItem value="EXACT_AMOUNT">Exact Amount</MenuItem>
                <MenuItem value="SHARES">Shares</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              value={users.filter(user => expenseData.participantIds.includes(user.id))}
              onChange={(event, newValue) => {
                setExpenseData({
                  ...expenseData,
                  participantIds: newValue.map(user => user.id)
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Participants"
                  placeholder="Choose people to split with"
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !expenseData.title || !expenseData.totalAmount || expenseData.participantIds.length === 0}
        >
          {loading ? 'Creating...' : 'Create Expense'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      // Simulate expense data
      setExpenses([
        {
          id: 1,
          title: 'Dinner at Italian Restaurant',
          description: 'Team dinner after project completion',
          totalAmount: 120.50,
          paidByName: 'You',
          splitType: 'EQUAL',
          status: 'PENDING',
          createdAt: '2024-01-15T19:30:00',
          participants: 4
        },
        {
          id: 2,
          title: 'Movie Tickets',
          description: 'Weekend movie night',
          totalAmount: 45.00,
          paidByName: 'John Doe',
          splitType: 'EQUAL',
          status: 'PARTIALLY_SETTLED',
          createdAt: '2024-01-14T20:00:00',
          participants: 3
        },
        {
          id: 3,
          title: 'Grocery Shopping',
          description: 'Weekly groceries for the house',
          totalAmount: 85.75,
          paidByName: 'Jane Smith',
          splitType: 'PERCENTAGE',
          status: 'SETTLED',
          createdAt: '2024-01-13T15:30:00',
          participants: 2
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  const handleSettleExpense = async (expenseId) => {
    try {
      await axios.post(`/api/expenses/${expenseId}/settle`);
      toast.success('Expense settled successfully!');
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to settle expense: ' + error.response?.data?.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SETTLED': return 'success';
      case 'PARTIALLY_SETTLED': return 'warning';
      case 'PENDING': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Expenses</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Add Expense
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Receipt sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Total Expenses
            </Typography>
            <Typography variant="h4" color="primary">
              ${expenses.reduce((sum, exp) => sum + exp.totalAmount, 0).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Group sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Pending Settlement
            </Typography>
            <Typography variant="h4" color="warning.main">
              {expenses.filter(exp => exp.status === 'PENDING').length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Check sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Settled Expenses
            </Typography>
            <Typography variant="h4" color="success.main">
              {expenses.filter(exp => exp.status === 'SETTLED').length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Expenses List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Expenses
        </Typography>
        {loading ? (
          <Typography>Loading expenses...</Typography>
        ) : (
          <List>
            {expenses.map((expense, index) => (
              <React.Fragment key={expense.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Receipt />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {expense.title}
                        </Typography>
                        <Chip
                          label={expense.status.replace('_', ' ')}
                          color={getStatusColor(expense.status)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {expense.description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Paid by {expense.paidByName} • {expense.participants} participants • {formatDate(expense.createdAt)}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box textAlign="right" display="flex" alignItems="center" gap={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        ${expense.totalAmount.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {expense.splitType.toLowerCase()} split
                      </Typography>
                    </Box>
                    {expense.status !== 'SETTLED' && expense.paidByName !== 'You' && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleSettleExpense(expense.id)}
                      >
                        Settle
                      </Button>
                    )}
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < expenses.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <CreateExpenseDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={fetchExpenses}
      />
    </Box>
  );
};

export default Expenses;
