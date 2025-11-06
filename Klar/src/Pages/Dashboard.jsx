import React, { useState, useEffect, useRef } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '../Components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../Components/ui/alert-dialog';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import ThemeToggle from '../Components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI } from '../Server/api';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../Components/ui/chart';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';
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
  X,
  LogOut,
  User,
  RefreshCw,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Calendar,
  BarChart3,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  // Debug log to check theme state
  console.log('Dashboard theme:', theme);
  const [activeView, setActiveView] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardAPI.getDashboardData();
        const summaryStats = dashboardAPI.getSummaryStats(data);
        const analytics = dashboardAPI.getAnalyticsData(data);

        setDashboardData(data);
        setStats(summaryStats);
        setAnalyticsData(analytics);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await dashboardAPI.getDashboardData();
      const summaryStats = dashboardAPI.getSummaryStats(data);
      const analytics = dashboardAPI.getAnalyticsData(data);
      setDashboardData(data);
      setStats(summaryStats);
      setAnalyticsData(analytics);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      const userEmail = JSON.parse(localStorage.getItem('user'))?.email;

      const headers = {
        'ngrok-skip-browser-warning': 'true'
      };

      // Add auth headers if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (userEmail) {
        headers['auth_email'] = userEmail;
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Make actual API call to process invoice endpoint
      const response = await fetch('https://05644f2f1d43.ngrok-free.app/processInvoice', {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          handleRefresh(); // Refresh data after upload
          setError(null);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Upload failed: ${err.message}`);
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        // Simulate file input change event
        const event = {
          target: {
            files: [file]
          }
        };
        handleFileUpload(event);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleUpdateInvoice = async (invoiceData) => {
    setIsUpdating(true);
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

      const response = await fetch('https://05644f2f1d43.ngrok-free.app/updateInvoice', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ data: invoiceData }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);

        // Refresh data after update
        handleRefresh();
        setSelectedInvoice(null);
        setError(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(`Update failed: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    // Navigation will be handled by ProtectedRoute
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || user.email?.split('@')[0] || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFilteredInvoices = () => {
    if (!dashboardData?.invoices) return [];

    let filtered = dashboardData.invoices;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoice_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'needs-verification') {
        filtered = filtered.filter(invoice => invoice.human_verification_required);
      } else {
        filtered = filtered.filter(invoice => invoice.status === statusFilter);
      }
    }

    return filtered;
  };

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
      id: 'samples',
      label: 'Samples',
      icon: Users,
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
      minimumFractionDigits: 2,
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
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'User'}! Here's what's happening with your invoices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
            Upload Invoice
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Uploading invoice...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 dark:bg-blue-800">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.totalRevenue) : '---'}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900">
              <CreditCard className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.totalExpenses) : '---'}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-red-500" />
              +10.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
              <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.netProfit) : '---'}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +15.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
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
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                Latest invoices processed in your system
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setActiveView('invoices')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead className="hidden sm:table-cell">Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.invoices?.slice(0, 5).map((invoice) => (
                    <TableRow key={invoice.task_id || invoice.invoice_id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{invoice.invoice_id}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {invoice.customer_name || invoice.extracted_vendor_name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(invoice.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.total_amount_payable)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status, invoice.human_verification_required)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Invoices</h2>
          <p className="text-muted-foreground">
            Manage all your invoices in one place
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
            disabled={isUploading}
          >
            <Upload className="h-4 w-4" />
            Upload Invoice
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search invoices</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by customer, invoice ID, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="status-filter" className="sr-only">Filter by status</Label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="needs-verification">Needs Verification</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead className="hidden sm:table-cell">Customer/Vendor</TableHead>
                    <TableHead className="hidden md:table-cell">Product</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredInvoices().map((invoice) => (
                    <TableRow key={invoice.task_id || invoice.invoice_id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div>
                          <div>{invoice.invoice_id}</div>
                          <div className="sm:hidden text-xs text-muted-foreground">
                            {invoice.customer_name || invoice.extracted_vendor_name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div>
                          <div className="font-medium">
                            {invoice.customer_name || invoice.extracted_vendor_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {invoice.canonical_vendor_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="max-w-[200px] truncate">
                          {invoice.product_name || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(invoice.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.total_amount_payable)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status, invoice.human_verification_required)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" title="View Invoice">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.pdf_path && (
                            <Button variant="ghost" size="sm" title="Download PDF">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" title="More Options">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {getFilteredInvoices().length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No invoices found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderSamples = () => {
    const needsVerificationInvoices = dashboardData?.invoices?.filter(
      invoice => invoice.human_verification_required
    ) || [];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Samples & Verification</h2>
            <p className="text-muted-foreground">
              Sample invoices and items that need verification
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh Data
          </Button>
        </div>

        {/* Needs Verification Section */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Needs Verification ({needsVerificationInvoices.length})
            </CardTitle>
            <CardDescription>
              Invoices that require manual verification before processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : needsVerificationInvoices.length > 0 ? (
              <div className="space-y-4">
                {needsVerificationInvoices.map((invoice) => (
                  <div
                    key={invoice.task_id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{invoice.invoice_id}</h3>
                          <Badge variant="destructive">Needs Verification</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div>Customer: {invoice.customer_name || invoice.extracted_vendor_name}</div>
                          <div>Amount: {formatCurrency(invoice.total_amount_payable)}</div>
                          <div>Date: {new Date(invoice.date).toLocaleDateString()}</div>
                          <div>Status: {invoice.status}</div>
                        </div>
                        {invoice.human_verification_reason && (
                          <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-950 rounded text-sm">
                            <strong>Reason:</strong> {invoice.human_verification_reason}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            const updatedInvoice = {
                              ...invoice,
                              human_verification_required: false,
                              status: 'completed'
                            };
                            handleUpdateInvoice(updatedInvoice);
                          }}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No invoices need verification at this time</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Detail Modal */}
        {selectedInvoice && (
          <AlertDialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
            <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Invoice Details - {selectedInvoice.invoice_id}</AlertDialogTitle>
                <AlertDialogDescription>
                  Review and verify the extracted invoice information
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Invoice ID</Label>
                    <p className="text-sm">{selectedInvoice.invoice_id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Customer/Vendor</Label>
                    <p className="text-sm">{selectedInvoice.customer_name || selectedInvoice.extracted_vendor_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <p className="text-sm">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Total Amount</Label>
                    <p className="text-sm font-bold">{formatCurrency(selectedInvoice.total_amount_payable)}</p>
                  </div>
                </div>

                {/* Line Items */}
                {selectedInvoice.line_items && selectedInvoice.line_items.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Line Items</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Cost</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedInvoice.line_items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{formatCurrency(item.unit_cost)}</TableCell>
                              <TableCell>{formatCurrency(item.quantity * item.unit_cost)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Verification Reason */}
                {selectedInvoice.human_verification_reason && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <Label className="text-sm font-medium">Verification Required Because:</Label>
                    <p className="text-sm mt-1">{selectedInvoice.human_verification_reason}</p>
                  </div>
                )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const updatedInvoice = {
                      ...selectedInvoice,
                      human_verification_required: false,
                      status: 'completed'
                    };
                    handleUpdateInvoice(updatedInvoice);
                  }}
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Approve & Complete
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'invoices':
        return renderInvoices();
      case 'samples':
        return renderSamples();
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h2>
                <p className="text-muted-foreground">
                  Revenue insights and financial analytics
                </p>
              </div>
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
                Refresh Data
              </Button>
            </div>

            {/* Analytics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Revenue Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+24.5%</div>
                  <p className="text-sm text-muted-foreground">vs last month</p>
                  <div className="mt-4 h-2 bg-muted rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Invoice Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats ? `${stats.completedInvoices + stats.pendingInvoices}` : '---'}
                  </div>
                  <p className="text-sm text-muted-foreground">total processed</p>
                  <div className="mt-4 h-2 bg-muted rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    Efficiency Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">96.2%</div>
                  <p className="text-sm text-muted-foreground">processing accuracy</p>
                  <div className="mt-4 h-2 bg-muted rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{width: '96%'}}></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Trend Chart */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Revenue Trend Analysis
                </CardTitle>
                <CardDescription>Monthly revenue growth over the last 6 months in INR</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : analyticsData?.monthly ? (
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: theme === 'dark' ? '#6366f1' : '#f59e0b',
                      },
                    }}
                    className={cn("h-80 w-full", theme === 'dark' && 'dark')}
                  >
                    <AreaChart
                      data={analyticsData.monthly}
                      margin={{
                        left: 12,
                        right: 12,
                        top: 12,
                        bottom: 12,
                      }}
                    >
                      <defs>
                        <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor={theme === 'dark' ? '#6366f1' : '#f59e0b'}
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="50%"
                            stopColor={theme === 'dark' ? '#6366f1' : '#f59e0b'}
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor={theme === 'dark' ? '#6366f1' : '#f59e0b'}
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ 
                          fontSize: 12, 
                          fill: theme === 'dark' ? '#e5e7eb' : '#374151' 
                        }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ 
                          fontSize: 12, 
                          fill: theme === 'dark' ? '#e5e7eb' : '#374151' 
                        }}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            formatter={(value, name) => [
                              `₹${Number(value).toLocaleString('en-IN')}`,
                              'Revenue'
                            ]}
                            labelFormatter={(label) => `Month: ${label}`}
                          />
                        }
                      />
                      <Area
                        dataKey="revenue"
                        type="natural"
                        fill="url(#fillRevenue)"
                        fillOpacity={0.6}
                        stroke={theme === 'dark' ? '#6366f1' : '#f59e0b'}
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                          r: 6,
                          fill: theme === 'dark' ? '#6366f1' : '#f59e0b',
                          stroke: theme === 'dark' ? '#1f2937' : '#ffffff',
                          strokeWidth: 2,
                          filter: `drop-shadow(0 0 6px ${theme === 'dark' ? '#6366f1' : '#f59e0b'})`,
                        }}
                        animationBegin={0}
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No revenue data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Performance Table */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Detailed breakdown of monthly financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-32 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : analyticsData?.monthly ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead className="text-right">Revenue</TableHead>
                          <TableHead className="text-right">Expenses</TableHead>
                          <TableHead className="text-right">Profit</TableHead>
                          <TableHead className="text-right">Margin</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analyticsData.monthly.map((month, index) => (
                          <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{month.month}</TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {formatCurrency(month.revenue)}
                            </TableCell>
                            <TableCell className="text-right font-medium text-red-600">
                              {formatCurrency(month.expenses)}
                            </TableCell>
                            <TableCell className={cn(
                              "text-right font-medium",
                              month.profit >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {formatCurrency(month.profit)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant={month.profit >= 0 ? "default" : "destructive"}>
                                {month.revenue > 0 ? ((month.profit / month.revenue) * 100).toFixed(1) : "0.0"}%
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No performance data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 'upload':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Upload Invoice</h2>
              <p className="text-muted-foreground">
                Upload PDF invoices for automated processing and data extraction
              </p>
            </div>

            {/* Upload Area */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="pt-6">
                <div
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                    isUploading
                      ? "border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-700"
                      : isDragOver
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-950 dark:border-blue-600"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/25"
                  )}
                >
                  <div className="space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <Upload className={cn(
                        "h-6 w-6",
                        isDragOver ? "text-blue-500" : "text-muted-foreground"
                      )} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        {isUploading
                          ? 'Uploading...'
                          : isDragOver
                          ? 'Drop your PDF here'
                          : 'Drop your PDF here, or click to upload'
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports: PDF files up to 10MB
                      </p>
                    </div>
                    {isUploading && (
                      <div className="w-full max-w-xs mx-auto">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2 dark:bg-blue-800">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Instructions */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Upload Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">PDF Format Only</p>
                      <p className="text-sm text-muted-foreground">Ensure your invoice is in PDF format</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Clear Text</p>
                      <p className="text-sm text-muted-foreground">Text should be selectable, not scanned images</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">File Size Limit</p>
                      <p className="text-sm text-muted-foreground">Maximum file size of 10MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    What Happens Next?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">1</div>
                    <div>
                      <p className="font-medium">Automatic Processing</p>
                      <p className="text-sm text-muted-foreground">AI extracts key information from your invoice</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">2</div>
                    <div>
                      <p className="font-medium">Data Validation</p>
                      <p className="text-sm text-muted-foreground">System validates extracted data for accuracy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">3</div>
                    <div>
                      <p className="font-medium">Ready for Review</p>
                      <p className="text-sm text-muted-foreground">Invoice appears in your dashboard for review</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
      "min-h-screen bg-background transition-colors duration-300",
      theme === 'dark' ? 'dark' : 'light'
    )}>
      <div className="flex h-screen">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "bg-card border-r transition-all duration-300 ease-in-out z-50",
          sidebarOpen ? "w-64" : "w-16",
          "flex flex-col",
          // Mobile positioning
          "fixed lg:relative h-full",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // Ensure theme inheritance
          theme === 'dark' && 'dark'
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
                  onClick={() => {
                    setActiveView(item.id);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
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
          <div className="p-4 border-t space-y-2">
            <button
              onClick={() => {
                fileInputRef.current?.click();
                // Close sidebar on mobile after action
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              disabled={isUploading}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                isUploading && "opacity-50 cursor-not-allowed"
              )}
            >
              <Upload className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>Upload Invoice</span>}
            </button>
          </div>

          {/* User Info & Logout */}
          <div className="p-4 border-t bg-muted/5">
            {sidebarOpen ? (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center gap-3 p-2 rounded-lg bg-background">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.firstName || 'User'} />
                    <AvatarFallback className="text-xs font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.firstName || user?.email?.split('@')[0] || 'User'}
                      {user?.lastName && ` ${user.lastName}`}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-destructive/10 hover:text-destructive text-destructive">
                      <LogOut className="h-4 w-4 shrink-0" />
                      <span>Logout</span>
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will be redirected to the login page and will need to sign in again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Collapsed User Avatar */}
                <div className="flex justify-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.firstName || 'User'} />
                    <AvatarFallback className="text-xs font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Collapsed Logout */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="w-full flex justify-center items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-destructive/10 hover:text-destructive text-destructive">
                      <LogOut className="h-4 w-4 shrink-0" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will be redirected to the login page and will need to sign in again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden",
          // Add margin on mobile when sidebar is collapsed
          "lg:ml-0",
          // Ensure theme inheritance
          theme === 'dark' && 'dark'
        )}>
          {/* Header */}
          <header className={cn(
            "bg-card border-b px-4 sm:px-6 py-4 transition-colors",
            theme === 'dark' && 'dark'
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2"
                >
                  {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold capitalize">
                    {activeView}
                  </h1>
                  <p className="hidden sm:block text-sm text-muted-foreground">
                    {activeView === 'overview' && 'Dashboard overview and recent activity'}
                    {activeView === 'invoices' && 'Manage your invoices'}
                    {activeView === 'samples' && 'Sample invoices and verification'}
                    {activeView === 'analytics' && 'Revenue and expense analytics'}
                    {activeView === 'upload' && 'Upload new invoices'}
                    {activeView === 'settings' && 'Application settings'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {user?.firstName || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar} alt={user?.firstName || 'User'} />
                    <AvatarFallback className="text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />

            {error && (
              <Card className="mb-6 border-destructive bg-destructive/10">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Error: {error}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setError(null)}
                      className="ml-auto"
                    >
                      Dismiss
                    </Button>
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
