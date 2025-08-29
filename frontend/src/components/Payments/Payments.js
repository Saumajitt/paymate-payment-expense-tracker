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
  MenuItem
} from '@mui/material';
import {
  Add,
  Send,
  AccountBalance,
  CreditCard,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key');

const PaymentForm = ({ onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    receiverId: '',
    description: '',
    type: 'payment'
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    
    try {
      // Create payment intent
      const response = await axios.post('/api/payments/create-payment-intent', {
        amount: parseFloat(paymentData.amount),
        receiverId: paymentData.receiverId || null,
        description: paymentData.description
      });

      const { clientSecret } = response.data;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success('Payment successful!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error('Payment failed: ' + error.response?.data?.message);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={paymentData.amount}
            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={paymentData.description}
            onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Payment Method
          </Typography>
          <Box sx={{ border: '1px solid #ccc', borderRadius: 1, p: 2 }}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
      
      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : 'Send Payment'}
        </Button>
      </DialogActions>
    </form>
  );
};

const Payments = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [paymentType, setPaymentType] = useState('send');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Simulate transaction data
      setTransactions([
        {
          id: 1,
          description: 'Coffee payment to Sarah',
          amount: -15.50,
          status: 'completed',
          date: '2024-01-15',
          type: 'payment'
        },
        {
          id: 2,
          description: 'Received from John',
          amount: 25.00,
          status: 'completed',
          date: '2024-01-14',
          type: 'received'
        },
        {
          id: 3,
          description: 'Grocery split payment',
          amount: -42.30,
          status: 'pending',
          date: '2024-01-13',
          type: 'payment'
        }
      ]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handlePaymentSuccess = () => {
    fetchTransactions();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Payments</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          New Payment
        </Button>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Send sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Send Money
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Send money to friends and family instantly
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setPaymentType('send');
                setOpenDialog(true);
              }}
            >
              Send Payment
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <AccountBalance sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Add Money
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Top up your PayMate balance
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setPaymentType('topup');
                setOpenDialog(true);
              }}
            >
              Add Funds
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <CreditCard sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Payment Methods
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Manage your cards and bank accounts
            </Typography>
            <Button variant="outlined">
              Manage Methods
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Transaction History */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Transactions
        </Typography>
        <List>
          {transactions.map((transaction) => (
            <ListItem key={transaction.id} divider>
              <ListItemAvatar>
                <Avatar sx={{
                  bgcolor: transaction.amount > 0 ? 'success.main' : 'primary.main'
                }}>
                  <PaymentIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={transaction.description}
                secondary={transaction.date}
              />
              <Box textAlign="right">
                <Typography
                  variant="body1"
                  color={transaction.amount > 0 ? 'success.main' : 'text.primary'}
                  fontWeight="bold"
                >
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Typography>
                <Chip
                  label={transaction.status}
                  color={getStatusColor(transaction.status)}
                  size="small"
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Payment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {paymentType === 'send' ? 'Send Payment' : 'Add Money'}
        </DialogTitle>
        <DialogContent>
          <Elements stripe={stripePromise}>
            <PaymentForm
              onClose={() => setOpenDialog(false)}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Payments;
