import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../Components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Components/ui/table';
import { Badge } from '../Components/ui/badge';
import { Button } from '../Components/ui/button';
import ThemeToggle from '../Components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { dashboardAPI } from '../Server/api';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Users,
  Settings,
  Upload,
  DollarSign,
  CreditCard,
  Activity,
  AlertCircle,
  Eye,
  Download,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getDashboardData();
        const summaryStats = dashboardAPI.getSummaryStats(data);

        setDashboardData(data);
        setStats(summaryStats);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const sidebarItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: FileText,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
    },
    {
      id: 'upload',
      label: 'Upload Invoice',
      icon: Upload,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getStatusBadge = (status, verificationRequired) => {
    if (verificationRequired) {
      return <Badge variant="destructive">Needs Verification</Badge>;
    }
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
    }
    if (status === 'pending') {
      return <Badge variant="secondary">Pending</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.totalRevenue) : '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.totalExpenses) : '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              +10.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.netProfit) : '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.pendingInvoices : '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.completedInvoices} completed` : '---'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
          <CardDescription>
            Latest invoices processed in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.invoices?.slice(0, 5).map((invoice) => (
                  <TableRow key={invoice.task_id || invoice.invoice_id}>
                    <TableCell className="font-medium">{invoice.invoice_id}</TableCell>
                    <TableCell>{invoice.customer_name || invoice.extracted_vendor_name}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(invoice.total_amount_payable)}</TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status, invoice.human_verification_required)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.pdf_path && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">
            Manage all your invoices in one place
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Invoice
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer/Vendor</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardData?.invoices?.map((invoice) => (
                  <TableRow key={invoice.task_id || invoice.invoice_id}>
                    <TableCell className="font-medium">{invoice.invoice_id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {invoice.customer_name || invoice.extracted_vendor_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.canonical_vendor_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {invoice.product_name || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(invoice.total_amount_payable)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status, invoice.human_verification_required)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.pdf_path && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'invoices':
        return renderInvoices();
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Coming soon...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Analytics dashboard will be available soon
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'customers':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>Coming soon...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Customer management will be available soon
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Configure your application preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Theme</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred theme
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-background",
      theme === 'dark' ? 'dark' : ''
    )}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className={cn(
          "bg-card border-r transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16",
          "flex flex-col"
        )}>
          {/* Sidebar Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-4 w-4" />
              </div>
              {sidebarOpen && (
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Klar Invoice</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Management System
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    activeView === item.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t">
            <button className={cn(
              "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            )}>
              <Upload className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>Upload Invoice</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-card border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
                <h1 className="text-xl font-semibold capitalize">
                  {activeView}
                </h1>
              </div>
              <ThemeToggle />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {error && (
              <Card className="mb-6 border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Error: {error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
