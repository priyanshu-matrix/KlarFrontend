// API configuration and services
const API_BASE_URL = 'https://8d826f91fce0.ngrok-free.app';

// Expenses tracking (could be fetched from API in the future)
const getExpensesData = () => {
  // This could be fetched from a real expenses API
  return [
    {
      id: 'exp_001',
      date: '2024-11-01',
      description: 'Office Supplies',
      category: 'Office',
      amount: 245.50,
      vendor: 'OfficeMax',
      type: 'expense'
    },
    {
      id: 'exp_002',
      date: '2024-11-02',
      description: 'Software Subscription',
      category: 'Technology',
      amount: 99.99,
      vendor: 'Adobe',
      type: 'expense'
    },
    {
      id: 'exp_003',
      date: '2024-11-03',
      description: 'Marketing Materials',
      category: 'Marketing',
      amount: 450.00,
      vendor: 'PrintShop',
      type: 'expense'
    }
  ];
};

// Fallback invoice data based on the actual API response structure
export const fallbackInvoiceData = [
  {
    invoice_id: "36652",
    order_id: "CA-2012-AH10030140-41041",
    customer_name: "Aaron Hawkins",
    extracted_vendor_name: "SuperStore",
    canonical_vendor_id: "VEND_0001",
    ship_to_address: "90004, Los Angeles, California, United States",
    date: "2012-05-12",
    ship_mode: "Standard Class",
    product_id: "OFF-PA-4014",
    product_name: "EcoTones Memo Sheets",
    quantity: 2,
    unit_cost: 8,
    currency: "USD",
    sub_total: 16,
    discount: 0,
    shipping_fee: 1.15,
    total_amount_payable: 17.15,
    human_verification_required: false,
    human_verification_reason: null,
    status: "completed",
    pdf_path: "tests/invoice_Aaron Hawkins_36652.pdf",
    task_id: "39e3d29a-a2aa-426c-a217-663a87fd7aab",
    type: 'invoice'
  },
  {
    invoice_id: "48320",
    order_id: "CA-2024-SJ10030141-41042",
    customer_name: "Sarah Johnson",
    extracted_vendor_name: "TechWorld",
    canonical_vendor_id: "VEND_0002",
    ship_to_address: "10001, New York, New York, United States",
    date: "2024-10-15",
    ship_mode: "Express",
    product_id: "TEC-LAP-2040",
    product_name: "Dell Professional Laptop",
    quantity: 1,
    unit_cost: 1200,
    currency: "USD",
    sub_total: 1200,
    discount: 50,
    shipping_fee: 25,
    total_amount_payable: 1175,
    human_verification_required: false,
    human_verification_reason: null,
    status: "completed",
    pdf_path: "tests/invoice_Sarah Johnson_48320.pdf",
    task_id: "2242c697-b9b3-4e53-93c7-96bbb7e87886",
    type: 'invoice'
  },
  {
    invoice_id: "48951",
    order_id: "CA-2024-MB10030142-41043",
    customer_name: "Michael Brown",
    extracted_vendor_name: "GadgetHub",
    canonical_vendor_id: "VEND_0003",
    ship_to_address: "90210, Beverly Hills, California, United States",
    date: "2024-11-01",
    ship_mode: "Standard Class",
    product_id: "TAB-SAM-7890",
    product_name: "Samsung Galaxy Tablet 128GB",
    quantity: 2,
    unit_cost: 499,
    currency: "USD",
    sub_total: 998,
    discount: 0,
    shipping_fee: 15.50,
    total_amount_payable: 1013.50,
    human_verification_required: true,
    human_verification_reason: "Amount verification needed",
    status: "pending",
    pdf_path: "tests/invoice_Michael Brown_48951.pdf",
    task_id: "3353c697-b9b3-4e53-93c7-96bbb7e87887",
    type: 'invoice'
  },
  {
    invoice_id: "49102",
    order_id: "CA-2024-EM10030143-41044",
    customer_name: "Emily Wilson",
    extracted_vendor_name: "OfficeDepot",
    canonical_vendor_id: "VEND_0004",
    ship_to_address: "33101, Miami, Florida, United States",
    date: "2024-11-03",
    ship_mode: "Second Class",
    product_id: "OFF-ST-5510",
    product_name: "Office Supplies Bundle",
    quantity: 5,
    unit_cost: 45.99,
    currency: "USD",
    sub_total: 229.95,
    discount: 15.00,
    shipping_fee: 8.75,
    total_amount_payable: 223.70,
    human_verification_required: false,
    human_verification_reason: null,
    status: "completed",
    pdf_path: "tests/invoice_Emily Wilson_49102.pdf",
    task_id: "4464c697-b9b3-4e53-93c7-96bbb7e87888",
    type: 'invoice'
  },
  {
    invoice_id: "49203",
    order_id: "CA-2024-JD10030144-41045",
    customer_name: "John Davis",
    extracted_vendor_name: "ElectroWorld",
    canonical_vendor_id: "VEND_0005",
    ship_to_address: "60601, Chicago, Illinois, United States",
    date: "2024-11-05",
    ship_mode: "First Class",
    product_id: "ELE-PHO-8901",
    product_name: "iPhone 15 Pro Max",
    quantity: 1,
    unit_cost: 1199,
    currency: "USD",
    sub_total: 1199,
    discount: 0,
    shipping_fee: 0,
    total_amount_payable: 1199,
    human_verification_required: true,
    human_verification_reason: "High value item verification",
    status: "pending",
    pdf_path: "tests/invoice_John Davis_49203.pdf",
    task_id: "5575c697-b9b3-4e53-93c7-96bbb7e87889",
    type: 'invoice'
  }
];

// API service
export const invoiceAPI = {
  async getInvoices() {
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      const userEmail = JSON.parse(localStorage.getItem('user'))?.email;

      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      };

      // Add auth headers if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (userEmail) {
        headers['auth_email'] = userEmail;
      }

      const response = await fetch(`${API_BASE_URL}/getInvoices`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Add type property and ensure it's an array
      const invoicesWithType = Array.isArray(data)
        ? data.map(invoice => ({ ...invoice, type: 'invoice' }))
        : [{ ...data, type: 'invoice' }];

      return invoicesWithType;
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      throw error;
    }
  }
};

// Combined data service
export const dashboardAPI = {
  async getDashboardData() {
    try {
      // Fetch real invoices from API
      const invoices = await invoiceAPI.getInvoices();

      // Get expenses data (could be from API in the future)
      const expenses = getExpensesData();

      return {
        invoices,
        expenses,
        allTransactions: [...invoices, ...expenses]
      };
    } catch (error) {
      console.warn('API failed, using fallback data:', error.message);

      // Use fallback data only when API is unavailable
      const expenses = getExpensesData();

      return {
        invoices: fallbackInvoiceData,
        expenses,
        allTransactions: [...fallbackInvoiceData, ...expenses]
      };
    }
  },

  // Get summary statistics with real metrics
  getSummaryStats(data) {
    const { invoices, expenses } = data;
    const currentDate = new Date();

    // Use first day of current month and first day of last month for more accurate comparison
    const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    // Calculate total amounts
    const totalInvoiceAmount = invoices.reduce((sum, invoice) =>
      sum + (invoice.total_amount_payable || 0), 0
    );

    const totalExpenseAmount = expenses.reduce((sum, expense) =>
      sum + (expense.amount || 0), 0
    );

    // Monthly calculations with better filtering and robust date parsing
    const thisMonthInvoices = invoices.filter(invoice => {
      if (!invoice.date) return false;
      const invoiceDate = new Date(invoice.date);
      // Check if date is valid
      if (isNaN(invoiceDate.getTime())) return false;
      return invoiceDate >= thisMonth && invoiceDate < nextMonth;
    });

    const lastMonthInvoices = invoices.filter(invoice => {
      if (!invoice.date) return false;
      const invoiceDate = new Date(invoice.date);
      // Check if date is valid
      if (isNaN(invoiceDate.getTime())) return false;
      return invoiceDate >= lastMonth && invoiceDate < thisMonth;
    });

    const thisMonthRevenue = thisMonthInvoices.reduce((sum, inv) => sum + (inv.total_amount_payable || 0), 0);
    const lastMonthRevenue = lastMonthInvoices.reduce((sum, inv) => sum + (inv.total_amount_payable || 0), 0);

    // Debug logging
    console.log('Revenue Debug Info:', {
      currentDate: currentDate.toISOString(),
      thisMonth: thisMonth.toISOString(),
      lastMonth: lastMonth.toISOString(),
      nextMonth: nextMonth.toISOString(),
      thisMonthInvoicesCount: thisMonthInvoices.length,
      lastMonthInvoicesCount: lastMonthInvoices.length,
      thisMonthRevenue,
      lastMonthRevenue,
      totalInvoices: invoices.length,
      revenueGrowthCalculation: lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 'N/A',
      sampleInvoiceDates: invoices.slice(0, 5).map(inv => ({ id: inv.invoice_id, date: inv.date, parsed: new Date(inv.date).toISOString() }))
    });

    // Calculate growth percentage
    const revenueGrowth = lastMonthRevenue > 0
      ? parseFloat(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1))
      : thisMonthRevenue > 0 ? 100 : 0;

    // Status calculations
    const pendingInvoices = invoices.filter(invoice =>
      invoice.status === 'pending' || invoice.human_verification_required
    ).length;

    const completedInvoices = invoices.filter(invoice =>
      invoice.status === 'completed' && !invoice.human_verification_required
    ).length;

    const verificationNeeded = invoices.filter(invoice =>
      invoice.human_verification_required
    ).length;

    return {
      totalRevenue: totalInvoiceAmount,
      totalExpenses: totalExpenseAmount,
      netProfit: totalInvoiceAmount - totalExpenseAmount,
      pendingInvoices,
      completedInvoices,
      verificationNeeded,
      totalTransactions: invoices.length,
      thisMonthInvoices: thisMonthInvoices.length,
      lastMonthInvoices: lastMonthInvoices.length,
      thisMonthRevenue,
      lastMonthRevenue,
      revenueGrowth
    };
  },

  // Generate chart data for analytics
  getAnalyticsData(data) {
    const { invoices, expenses } = data;

    // Generate monthly revenue data for the last 6 months
    const monthlyData = this.generateMonthlyData(invoices, expenses);

    // Generate category breakdown for expenses
    const categoryData = this.generateCategoryData(expenses);

    // Generate status distribution
    const statusData = this.generateStatusData(invoices);

    return {
      monthly: monthlyData,
      categories: categoryData,
      status: statusData
    };
  },

  generateMonthlyData(invoices, expenses) {
    const months = [];
    const currentDate = new Date();

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);

      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      // Filter invoices for this month
      const monthInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate.getFullYear() === date.getFullYear() &&
               invoiceDate.getMonth() === date.getMonth();
      });

      // Filter expenses for this month
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === date.getFullYear() &&
               expenseDate.getMonth() === date.getMonth();
      });

      const revenue = monthInvoices.reduce((sum, inv) => sum + (inv.total_amount_payable || 0), 0);
      const totalExpenses = monthExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

      months.push({
        month: `${monthName} ${year}`,
        monthShort: monthName,
        revenue: revenue,
        expenses: totalExpenses,
        profit: revenue - totalExpenses
      });
    }

    return months;
  },

  generateCategoryData(expenses) {
    const categories = {};

    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      if (!categories[category]) {
        categories[category] = {
          name: category,
          value: 0,
          count: 0
        };
      }
      categories[category].value += expense.amount || 0;
      categories[category].count += 1;
    });

    return Object.values(categories).sort((a, b) => b.value - a.value);
  },

  generateStatusData(invoices) {
    const statuses = {
      completed: 0,
      pending: 0,
      verification: 0
    };

    invoices.forEach(invoice => {
      if (invoice.human_verification_required) {
        statuses.verification++;
      } else if (invoice.status === 'completed') {
        statuses.completed++;
      } else if (invoice.status === 'pending') {
        statuses.pending++;
      }
    });

    return [
      { name: 'Completed', value: statuses.completed, color: '#22c55e' },
      { name: 'Pending', value: statuses.pending, color: '#f59e0b' },
      { name: 'Needs Verification', value: statuses.verification, color: '#ef4444' }
    ];
  }
};