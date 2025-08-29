# PayMate - Payment & Expense Splitting App

A comprehensive payment application built with Java Spring Boot backend and React frontend, featuring Stripe/PayPal integration and Splitwise-like expense splitting capabilities.

## Features

### 🔐 Authentication & Security
- JWT-based authentication
- User registration and login
- Role-based access control
- Secure password encryption

### 💳 Payment Processing
- Stripe integration for card payments
- PayPal support
- Multiple payment methods
- Secure payment intent creation
- Webhook handling for payment status updates

### 📊 Expense Management
- Create and manage expenses
- Multiple split types:
  - Equal split
  - Percentage-based split
  - Exact amount split
  - Share-based split
- Expense settlement tracking
- Group expense management

### 👥 Group Management
- Create expense groups
- Add/remove group members
- Track group expenses
- Group-based expense splitting

### 📱 Modern UI
- Material-UI components
- Responsive design
- Real-time notifications
- Interactive dashboards

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.1.5**
- **Spring Security** (JWT authentication)
- **Spring Data JPA** (Database operations)
- **MySQL** (Database)
- **Stripe Java SDK** (Payment processing)
- **PayPal SDK** (Payment processing)

### Frontend
- **React 18**
- **Material-UI (MUI)**
- **React Router** (Navigation)
- **Axios** (HTTP client)
- **Stripe Elements** (Payment forms)
- **React Hot Toast** (Notifications)

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd paymate-app/backend
   ```

2. **Configure MySQL Database**
   - Create a MySQL database named `paymate_db`
   - Update database credentials in `src/main/resources/application.yml`

3. **Configure Payment Gateways**
   - Get your Stripe API keys from [Stripe Dashboard](https://dashboard.stripe.com/)
   - Get your PayPal credentials from [PayPal Developer](https://developer.paypal.com/)
   - Update the keys in `application.yml` or set environment variables:
     ```bash
     export STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
     export STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
     export PAYPAL_CLIENT_ID=your_paypal_client_id
     export PAYPAL_CLIENT_SECRET=your_paypal_client_secret
     ```

4. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update Stripe configuration**
   - Update the Stripe publishable key in `src/components/Payments/Payments.js`

4. **Start the frontend**
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Payments
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/webhook/stripe` - Stripe webhook handler

### Expenses
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/my-expenses` - Get user expenses
- `GET /api/expenses/group/{groupId}` - Get group expenses
- `POST /api/expenses/{expenseId}/settle` - Settle expense

### Groups
- `POST /api/groups` - Create new group
- `GET /api/groups/my-groups` - Get user groups
- `POST /api/groups/{groupId}/members` - Add group member

## Database Schema

The application uses the following main entities:
- **User** - User accounts and authentication
- **Role** - User roles (USER, ADMIN, MERCHANT)
- **Transaction** - Payment transactions
- **Expense** - Expense records
- **ExpenseParticipant** - Expense split details
- **ExpenseGroup** - Group management
- **PaymentMethod** - Stored payment methods

## Security Features

- JWT token-based authentication
- Password encryption using BCrypt
- CORS configuration for cross-origin requests
- Input validation and sanitization
- Secure payment processing with Stripe/PayPal

## Development

### Running Tests
```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
mvn clean package

# Frontend
cd frontend
npm run build
```

## Environment Variables

### Backend
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### Frontend
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@paymate.com or create an issue in the repository.
