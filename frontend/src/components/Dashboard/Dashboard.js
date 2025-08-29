import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Receipt,
  Payment,
  Add
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    recentTransactions: [],
    pendingExpenses: [],
    totalOwed: 0,
    totalOwing: 0
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real app, you'd have a dashboard endpoint
      // For now, we'll simulate some data
      setDashboardData({
        balance: 1250.75,
        recentTransactions: [
          { id: 1, description: 'Coffee with friends', amount: -15.50, type: 'expense' },
          { id: 2, description: 'Received from John', amount: 25.00, type: 'received' },
          { id: 3, description: 'Grocery split', amount: -42.30, type: 'expense' }
        ],
        pendingExpenses: [
          { id: 1, title: 'Dinner at Restaurant', amount: 85.00, participants: 4 },
          { id: 2, title: 'Movie tickets', amount: 45.00, participants: 3 }
        ],
        totalOwed: 125.50,
        totalOwing: 67.30
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="h2">
              ${value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.firstName}!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Balance"
            value={dashboardData.balance.toFixed(2)}
            icon={<AccountBalance />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Owed to You"
            value={dashboardData.totalOwed.toFixed(2)}
            icon={<TrendingUp />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="You Owe"
            value={dashboardData.totalOwing.toFixed(2)}
            icon={<Payment />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Expenses"
            value={dashboardData.pendingExpenses.length}
            icon={<Receipt />}
            color="info.main"
          />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<Payment />}
                onClick={() => navigate('/payments')}
              >
                Send Money
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/expenses')}
              >
                Add Expense
              </Button>
              <Button
                variant="outlined"
                startIcon={<Receipt />}
                onClick={() => navigate('/expenses')}
              >
                Split Bill
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <List>
              {dashboardData.recentTransactions.map((transaction) => (
                <ListItem key={transaction.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: transaction.type === 'received' ? 'success.main' : 'error.main' 
                    }}>
                      {transaction.type === 'received' ? '+' : '-'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={transaction.description}
                    secondary={`${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}`}
                  />
                  <Chip
                    label={transaction.type}
                    color={transaction.type === 'received' ? 'success' : 'default'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Pending Expenses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pending Expenses
            </Typography>
            <List>
              {dashboardData.pendingExpenses.map((expense) => (
                <ListItem key={expense.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Receipt />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={expense.title}
                    secondary={`$${expense.amount.toFixed(2)} • ${expense.participants} people`}
                  />
                  <Button size="small" variant="outlined">
                    Settle
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
