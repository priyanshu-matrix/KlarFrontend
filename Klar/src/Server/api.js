// API configuration and services
const API_BASE_URL = 'https://7ed55a06fc93.ngrok-free.app';

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
      const response = await fetch(`${API_BASE_URL}/getInvoices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
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
      // Fetch invoices from API
      const invoices = await invoiceAPI.getInvoices();

      // Generate fake expenses
      const expenses = generateFakeExpenses();

      // Combine and return
      return {
        invoices,
        expenses,
        allTransactions: [...invoices, ...expenses]
      };
    } catch (error) {
      console.warn('API failed, using fallback data:', error.message);

      // Use fallback data
      const expenses = generateFakeExpenses();
      return {
        invoices: fallbackInvoiceData,
        expenses,
        allTransactions: [...fallbackInvoiceData, ...expenses]
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
  }
};