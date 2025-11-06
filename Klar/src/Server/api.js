// API configuration and services
const API_BASE_URL = 'https://05644f2f1d43.ngrok-free.app';

// Fake expense data to complement invoice data
const generateFakeExpenses = () => [
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
    description: 'Team Lunch',
    category: 'Meals',
    amount: 125.75,
    vendor: 'Local Restaurant',
    type: 'expense'
  },
  {
    id: 'exp_003',
    date: '2024-11-03',
    description: 'Software Subscription',
    category: 'Technology',
    amount: 99.99,
    vendor: 'Adobe',
    type: 'expense'
  },
  {
    id: 'exp_004',
    date: '2024-11-04',
    description: 'Marketing Materials',
    category: 'Marketing',
    amount: 450.00,
    vendor: 'PrintShop',
    type: 'expense'
  },
  {
    id: 'exp_005',
    date: '2024-11-05',
    description: 'Travel Expenses',
    category: 'Travel',
    amount: 1250.30,
    vendor: 'Airlines',
    type: 'expense'
  }
];

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

// Function to generate artificial revenue data (80% more than actual)
const generateArtificialRevenue = (actualInvoices) => {
  const artificialInvoices = [];
  const currentDate = new Date();

  // Calculate total actual revenue
  const actualRevenue = actualInvoices.reduce((sum, invoice) =>
    sum + (invoice.total_amount_payable || 0), 0
  );

  // Generate 80% more revenue through artificial invoices
  const additionalRevenue = actualRevenue * 0.8;
  const baseRevenue = additionalRevenue / 5; // Spread across 5 artificial invoices

  const artificialCustomers = [
    'TechCorp Solutions', 'Digital Innovations Inc', 'Cloud Systems Ltd',
    'Enterprise Software Co', 'Data Analytics Group'
  ];

  const artificialProducts = [
    'Enterprise Software License', 'Cloud Infrastructure Services',
    'Data Analytics Platform', 'Digital Transformation Suite', 'AI Integration Services'
  ];

  for (let i = 0; i < 5; i++) {
    const variance = (Math.random() - 0.5) * 0.3; // ±15% variance
    const amount = baseRevenue * (1 + variance);

    // Generate dates within the last 30 days
    const daysBack = Math.floor(Math.random() * 30);
    const invoiceDate = new Date(currentDate);
    invoiceDate.setDate(invoiceDate.getDate() - daysBack);

    artificialInvoices.push({
      invoice_id: `ART_${50000 + i}`,
      order_id: `ART-2024-${String(10000 + i).padStart(5, '0')}`,
      customer_name: artificialCustomers[i],
      extracted_vendor_name: "Klar Business Solutions",
      canonical_vendor_id: `ART_VEND_${i + 1}`,
      ship_to_address: `${10001 + i * 1000}, Business District, NY, United States`,
      date: invoiceDate.toISOString().split('T')[0],
      ship_mode: "Digital Delivery",
      product_id: `ART-PROD-${1000 + i}`,
      product_name: artificialProducts[i],
      quantity: 1,
      unit_cost: amount,
      currency: "USD",
      sub_total: amount,
      discount: 0,
      shipping_fee: 0,
      total_amount_payable: amount,
      human_verification_required: false,
      human_verification_reason: null,
      status: "completed",
      pdf_path: `artificial/invoice_${artificialCustomers[i].replace(/\s+/g, '_')}_ART_${50000 + i}.pdf`,
      task_id: `art-${Date.now()}-${i}`,
      type: 'invoice',
      is_artificial: true
    });
  }

  return artificialInvoices;
};

// Combined data service
export const dashboardAPI = {
  async getDashboardData() {
    try {
      // Fetch invoices from API
      const actualInvoices = await invoiceAPI.getInvoices();

      // Generate artificial revenue (80% more)
      const artificialInvoices = generateArtificialRevenue(actualInvoices);

      // Combine actual and artificial invoices
      const allInvoices = [...actualInvoices, ...artificialInvoices];

      // Generate fake expenses
      const expenses = generateFakeExpenses();

      // Combine and return
      return {
        invoices: allInvoices,
        actualInvoices,
        artificialInvoices,
        expenses,
        allTransactions: [...allInvoices, ...expenses]
      };
    } catch (error) {
      console.warn('API failed, using fallback data:', error.message);

      // Use fallback data
      const actualInvoices = fallbackInvoiceData;
      const artificialInvoices = generateArtificialRevenue(actualInvoices);
      const allInvoices = [...actualInvoices, ...artificialInvoices];
      const expenses = generateFakeExpenses();

      return {
        invoices: allInvoices,
        actualInvoices,
        artificialInvoices,
        expenses,
        allTransactions: [...allInvoices, ...expenses]
      };
    }
  },

  // Get summary statistics
  getSummaryStats(data) {
    const { invoices, expenses } = data;

    const totalInvoiceAmount = invoices.reduce((sum, invoice) =>
      sum + (invoice.total_amount_payable || 0), 0
    );

    const totalExpenseAmount = expenses.reduce((sum, expense) =>
      sum + (expense.amount || 0), 0
    );

    const pendingInvoices = invoices.filter(invoice =>
      invoice.status === 'pending' || invoice.human_verification_required
    ).length;

    const completedInvoices = invoices.filter(invoice =>
      invoice.status === 'completed' && !invoice.human_verification_required
    ).length;

    return {
      totalRevenue: totalInvoiceAmount,
      totalExpenses: totalExpenseAmount,
      netProfit: totalInvoiceAmount - totalExpenseAmount,
      pendingInvoices,
      completedInvoices,
      totalTransactions: invoices.length + expenses.length
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