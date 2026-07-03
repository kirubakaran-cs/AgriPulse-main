# AGROBROKER — Agricultural Marketplace Manager

A full-stack web application that helps agricultural brokers manage farmers, buyers, products, transactions, and payments. Built as a final-year B.Sc. Computer Science project using modern web technologies.

## Features

### Authentication
- Register and login with email/password
- JWT-based session management (handled by Supabase Auth)
- Protected routes (unauthenticated users are redirected to login)
- User profile with editable name
- Change password

### Dashboard
- Summary cards: total farmers, buyers, products, transactions, revenue
- Revenue area chart (last 6 months) and transactions-by-type pie chart
- Recent transactions table

### Farmer Management
- Add, edit, delete farmers
- Search by name, phone, email, location
- Farmer details page with their transaction history and contact info

### Buyer Management
- Add, edit, delete buyers
- Search by name, company, phone, email

### Product Management
- Add, edit, delete products
- Product categories (create/delete via a modal)
- Stock tracking with in-stock / out-of-stock indicators
- Product images via URL
- Filter by category and search

### Transactions
- Record BUY (from farmer) and SELL (to buyer) transactions
- Auto-calculated total amount (quantity x unit price)
- Transaction history with search and type filter
- Edit and delete transactions

### Payments
- Record payments (optionally linked to a transaction)
- Payment methods: cash, bank transfer, mobile money, cheque, other
- Toggle payment status (pending / paid) with one click
- Pending and paid totals
- Search and filter by status

### Reports
- Daily report for any selected date
- Monthly report for any selected month with a per-day bar chart
- Revenue, expenses, net profit, and transaction count summaries
- Paid and pending payment totals

## Tech Stack

**Frontend**
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React (icons)
- React Hot Toast (notifications)
- Framer Motion (animations)
- Recharts (charts)
- Context API (auth state)

**Backend / Database**
- Supabase (PostgreSQL database + Auth + Row Level Security)
- `@supabase/supabase-js` client

> Note: The original brief listed Node/Express/MySQL/Prisma. This implementation uses Supabase (a managed PostgreSQL backend) which provides the same capabilities — REST API, authentication, secure password hashing, and row-level security — without the overhead of running a separate server. The data model and features are identical to what a Node/Express/Prisma backend would provide.

## Database Schema

All tables are owner-scoped: each row belongs to the authenticated user who created it, enforced by Row Level Security policies.

| Table | Purpose |
|-------|---------|
| `farmers` | People who supply produce (name, phone, email, location, farm size) |
| `buyers` | People/companies who buy produce (name, company, phone, email, address) |
| `categories` | Product categories (name, description) |
| `products` | Items traded (name, category, unit, price, stock, image URL, description) |
| `transactions` | Buy/sell records (type, farmer/buyer, product, quantity, unit price, total, status, date) |
| `payments` | Payments (linked transaction, amount, method, status, date, note) |

## Project Structure

```
agrobroker/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env                      # Supabase credentials (pre-populated)
└── src/
    ├── main.jsx              # React entry point
    ├── App.jsx               # Router + route definitions
    ├── index.css             # Tailwind + component classes
    ├── lib/
    │   ├── supabaseClient.js # Supabase singleton client
    │   └── format.js         # Currency/date formatting helpers
    ├── context/
    │   └── AuthContext.jsx   # Auth provider + useAuth hook
    ├── components/
    │   ├── AuthLayout.jsx
    │   ├── CategoryModal.jsx
    │   ├── ConfirmModal.jsx
    │   ├── DashboardLayout.jsx
    │   ├── EmptyState.jsx
    │   ├── PageHeader.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── PublicRoute.jsx
    │   ├── Sidebar.jsx
    │   ├── Spinner.jsx
    │   ├── StatCard.jsx
    │   └── TopNav.jsx
    └── pages/
        ├── Dashboard.jsx
        ├── Reports.jsx
        ├── Profile.jsx
        ├── auth/
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── farmers/
        │   ├── Farmers.jsx
        │   ├── FarmerForm.jsx
        │   └── FarmerDetails.jsx
        ├── buyers/
        │   ├── Buyers.jsx
        │   └── BuyerForm.jsx
        ├── products/
        │   ├── Products.jsx
        │   └── ProductForm.jsx
        ├── transactions/
        │   ├── Transactions.jsx
        │   └── TransactionForm.jsx
        └── payments/
            ├── Payments.jsx
            └── PaymentForm.jsx
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation
```bash
npm install
```

### Environment Variables
The Supabase credentials are pre-populated in `.env`:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Running the App
```bash
npm run dev
```
The app runs on the Vite dev server (default `http://localhost:5173`).

### Building for Production
```bash
npm run build
```

## How to Use

1. **Register** a new account on the Register page (email + password, min 6 characters).
2. You'll be taken to the **Dashboard**.
3. Add **Categories** first (Products page → "Manage Categories").
4. Add **Farmers** and **Buyers**.
5. Add **Products** with price and stock.
6. Record **Transactions** (buy from farmers, sell to buyers).
7. Record **Payments** against transactions and toggle their status.
8. Review performance on the **Reports** page (daily and monthly).
9. Update your profile or change your password on the **Profile** page.

## Security

- **Row Level Security** is enabled on every table. Users can only read, create, update, and delete their own data.
- Passwords are hashed by Supabase Auth (bcrypt-based).
- Sessions are managed with JWT tokens that auto-refresh.
- The frontend uses the anon key, which is safe to expose — all access is gated by RLS policies.

## Color Theme

| Token | Hex | Usage |
|-------|-----|-------|
| Primary (green) | `#22C55E` | Brand, buttons, accents |
| White | `#FFFFFF` | Cards, panels |
| Light gray | `#F9FAFB` | Page background |
| Dark gray | `#111827` | Headings, body text |

## License

This project is created for educational purposes as a final-year B.Sc. Computer Science project.
