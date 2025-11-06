# Klar Dashboard

A clean, modern dashboard for managing invoices and tracking expenses built with React, Vite, and Tailwind CSS.

## Features

### 📊 Financial Overview
- **Revenue Tracking**: Monitor total revenue from invoices
- **Expense Management**: Track business expenses across categories
- **Net Profit Calculation**: Real-time profit/loss overview
- **Pending Reviews**: Track invoices requiring attention

### 📈 Interactive Charts
- **Financial Timeline**: Area chart showing revenue vs expenses over time
- **Time Range Filters**: View data for 7 days, 30 days, or 90 days
- **Responsive Design**: Mobile-optimized chart interactions

### 📋 Data Management
- **Invoice Management**: Complete invoice tracking with status monitoring
- **Expense Categorization**: Organized expense tracking by category
- **Advanced Search**: Search across all transactions, invoices, and expenses
- **Data Tables**: Sortable, filterable tables with pagination

### 🔌 API Integration
- **Live Data**: Fetches invoices from `https://7ed55a06fc93.ngrok-free.app/getInvoices`
- **Fallback Data**: Graceful fallback to demo data when API is unavailable
- **Fake Expenses**: Generated sample expense data for demonstration

## Dashboard Sections

### Summary Cards
1. **Total Revenue** - Sum of all completed invoices
2. **Total Expenses** - Sum of all expense records
3. **Net Profit** - Revenue minus expenses
4. **Pending Reviews** - Invoices requiring human verification

### Financial Chart
- Interactive area chart showing revenue and expenses over time
- Toggle between different time ranges
- Hover tooltips with detailed information
- Mobile-responsive design

### Data Tables
1. **All Transactions** - Combined view of invoices and expenses
2. **Invoices** - Detailed invoice management
3. **Expenses** - Expense tracking and categorization

## API Data Structure

The dashboard expects invoice data in the following format:

```json
{
  "pdf_path": "tests/invoice_Aaron_Hawkins_47905.pdf",
  "status": "completed",
  "task_id": "1131c697-b9b3-4e53-93c7-96bbb7e87885",
  "canonical_vendor_id": "VEND_0001",
  "currency": "USD",
  "customer_name": "Aaron Hawkins",
  "date": "2012-09-13",
  "discount": 0,
  "extracted_vendor_name": "SuperStore",
  "human_verification_reason": null,
  "human_verification_required": false,
  "invoice_id": "47905",
  "order_id": "CG-2012-AH1003033-41165",
  "product_id": "TEC-PH-3148",
  "product_name": "Apple Smart Phone, Full Size",
  "quantity": 6,
  "ship_mode": "First Class",
  "ship_to_address": "Kamina, Katanga, Democratic Republic of the Congo",
  "shipping_fee": 678.15,
  "sub_total": 22903.56,
  "total_amount_payable": 23581.71,
  "unit_cost": 3817.26
}
```

## Fake Expense Data

The dashboard includes generated expense data to demonstrate functionality:

- **Office Supplies** - Office category expenses
- **Team Meals** - Meal & entertainment expenses
- **Software Subscriptions** - Technology expenses
- **Marketing Materials** - Marketing category expenses
- **Travel Expenses** - Travel & transportation expenses

## Getting Started

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the dashboard**:
   ```
   http://localhost:5184/dashboard
   ```

3. **API Configuration**:
   - The dashboard will attempt to fetch data from the configured API endpoint
   - If the API is unavailable, it will use fallback demo data
   - No additional configuration needed for demo purposes

## Technology Stack

- **React 19** - Frontend framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Recharts** - Chart library for data visualization
- **React Router** - Client-side routing

## File Structure

```
src/
├── Pages/
│   └── Dashboard.jsx          # Main dashboard component
├── hooks/
│   ├── useDashboard.js        # Dashboard data management hook
│   └── useInvoices.js         # Invoice-specific data hook (legacy)
├── Server/
│   └── api.js                 # API service and mock data
└── Components/
    ├── chart-area-interactive.tsx  # Financial chart component
    └── ui/                    # Shared UI components
```

## Customization

### Adding New Expense Categories
Edit the `generateFakeExpenses()` function in `src/Server/api.js` to add new expense categories.

### Modifying API Endpoint
Update the `API_BASE_URL` constant in `src/Server/api.js` to point to your API endpoint.

### Styling
The dashboard uses Tailwind CSS. Modify classes in the components to customize the appearance.

## Status Indicators

- 🟢 **Completed** - Invoice processed successfully
- 🟡 **Pending** - Invoice awaiting processing
- 🔴 **Needs Review** - Invoice requires human verification
- 🔵 **Expense** - Expense record

## Features in Detail

### Responsive Design
- Mobile-first approach
- Collapsible navigation
- Touch-friendly interactions
- Optimized for tablets and desktops

### Data Refresh
- Manual refresh button in header
- Real-time data updates
- Error handling with retry mechanisms
- Loading states for better UX

### Search & Filter
- Global search across all data
- Column-specific filtering
- Case-insensitive search
- Real-time results

This dashboard provides a comprehensive solution for invoice and expense management with a modern, clean interface that works seamlessly across all devices.