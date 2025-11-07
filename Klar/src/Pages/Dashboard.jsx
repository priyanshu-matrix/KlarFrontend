import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../Components/ui/tooltip';
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
  Check,
  Edit,
  Save,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState(null);
  const [invoiceViewerOpen, setInvoiceViewerOpen] = useState(false);
  const [viewerInvoice, setViewerInvoice] = useState(null);
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
      const response = await fetch('https://8d826f91fce0.ngrok-free.app/processInvoice', {
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
        // Also add to the invoice data
        invoiceData.auth_email = userEmail;
      }

      const response = await fetch('https://8d826f91fce0.ngrok-free.app/updateInvoice', {
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
        setIsEditing(false);
        setEditedInvoice(null);
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

  const handleStartEditing = (invoice) => {
    setIsEditing(true);
    setEditedInvoice({ ...invoice });
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedInvoice(null);
  };

  const handleSaveEditing = () => {
    if (editedInvoice) {
      // Include auth_email in the edited invoice
      const updatedInvoice = {
        ...editedInvoice,
        auth_email: JSON.parse(localStorage.getItem('user'))?.email
      };
      handleUpdateInvoice(updatedInvoice);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedInvoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    setEditedInvoice(prev => ({
      ...prev,
      line_items: prev.line_items.map((item, i) =>
        i === index ? { ...item, [field]: field === 'quantity' || field === 'unit_cost' ? parseFloat(value) || 0 : value } : item
      )
    }));
  };

  const addLineItem = () => {
    setEditedInvoice(prev => ({
      ...prev,
      line_items: [
        ...(prev.line_items || []),
        { product_name: '', quantity: 1, unit_cost: 0 }
      ]
    }));
  };

  const removeLineItem = (index) => {
    setEditedInvoice(prev => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index)
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
      label: 'Review & Verification',
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
              <TrendingUp className={cn(
                "h-3 w-3",
                stats?.revenueGrowth >= 0 ? "text-green-500" : "text-red-500"
              )} />
              {stats?.revenueGrowth !== undefined ?
                `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}% from last month` :
                'No previous month data'
              }
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
              Monthly expenses tracking
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
              {stats?.netProfit >= 0 ? 'Positive margin' : 'Review expenses'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Queue</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.verificationNeeded : '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats ? `${stats.completedInvoices} completed this month` : '---'}
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
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Invoice"
                            onClick={() => {
                              setViewerInvoice(invoice);
                              setInvoiceViewerOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.file_link && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Download PDF"
                              onClick={() => {
                                window.open(invoice.file_link, '_blank');
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit Invoice"
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsEditing(true);
                              setEditedInvoice({ ...invoice });
                            }}
                          >
                            <Edit className="h-4 w-4" />
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

  // Invoice Viewer Modal Component
  const InvoiceViewer = () => (
    <AlertDialog open={invoiceViewerOpen} onOpenChange={setInvoiceViewerOpen}>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-between">
            <span>Invoice Viewer - {viewerInvoice?.invoice_id}</span>
            <div className="flex gap-2">
              {viewerInvoice?.file_link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(viewerInvoice.file_link, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedInvoice(viewerInvoice);
                  setIsEditing(true);
                  setEditedInvoice({ ...viewerInvoice });
                  setInvoiceViewerOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setInvoiceViewerOpen(false)}
                      className="h-8 w-8 p-0"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close (Esc)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Complete invoice information and details. Press Esc or click the X button to close.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {viewerInvoice && (
          <div className="space-y-6">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Invoice ID</Label>
                <p className="text-lg font-semibold">{viewerInvoice.invoice_id}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <div className="mt-1">
                  {getStatusBadge(viewerInvoice.status, viewerInvoice.human_verification_required)}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(viewerInvoice.total_amount_payable)}
                </p>
              </div>
            </div>

            {/* Customer & Order Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Customer & Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer Name</Label>
                  <p className="text-sm mt-1">{viewerInvoice.customer_name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vendor Name</Label>
                  <p className="text-sm mt-1">{viewerInvoice.extracted_vendor_name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Order ID</Label>
                  <p className="text-sm mt-1">{viewerInvoice.order_id || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vendor ID</Label>
                  <p className="text-sm mt-1">{viewerInvoice.canonical_vendor_id || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm mt-1">{new Date(viewerInvoice.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Ship Mode</Label>
                  <p className="text-sm mt-1">{viewerInvoice.ship_mode || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {viewerInvoice.ship_to_address && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                <p className="text-sm p-3 bg-muted/50 rounded-lg">{viewerInvoice.ship_to_address}</p>
              </div>
            )}

            {/* Line Items */}
            {viewerInvoice.line_items && viewerInvoice.line_items.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Line Items</h3>
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
                      {viewerInvoice.line_items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.product_name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.unit_cost)}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(item.quantity * item.unit_cost)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Subtotal:</Label>
                    <span className="text-sm font-medium">{formatCurrency(viewerInvoice.sub_total || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <Label className="text-sm">Discount:</Label>
                    <span className="text-sm font-medium">-{formatCurrency(viewerInvoice.discount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <Label className="text-sm">Shipping:</Label>
                    <span className="text-sm font-medium">{formatCurrency(viewerInvoice.shipping_fee || 0)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <Label className="text-base font-semibold">Total:</Label>
                    <span className="text-base font-bold text-green-600">
                      {formatCurrency(viewerInvoice.total_amount_payable)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm">Currency:</Label>
                    <p className="text-sm mt-1">{viewerInvoice.currency} ({viewerInvoice.extracted_currency})</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div>
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  🔧 Technical Details
                </summary>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-sm font-medium">Task ID</Label>
                    <p className="text-xs font-mono mt-1 break-all">{viewerInvoice.task_id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">PDF Path</Label>
                    <p className="text-xs font-mono mt-1 break-all">{viewerInvoice.pdf_path}</p>
                  </div>
                  {viewerInvoice.file_link && (
                    <div>
                      <Label className="text-sm font-medium">File Link</Label>
                      <p className="text-xs font-mono mt-1 break-all">
                        <a
                          href={viewerInvoice.file_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {viewerInvoice.file_link}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </details>
            </div>

            {/* Description */}
            {viewerInvoice.description && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-sm p-3 bg-muted/50 rounded-lg">{viewerInvoice.description}</p>
              </div>
            )}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const renderSamples = () => {
    const needsVerificationInvoices = dashboardData?.invoices?.filter(
      invoice => invoice.human_verification_required
    ) || [];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Review & Verification</h2>
            <p className="text-muted-foreground">
              Invoices and items that need verification
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh Data
          </Button>
        </div>

        {/* Bulk Actions */}
        {needsVerificationInvoices.length > 0 && (
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <FileText className="h-5 w-5" />
                Bulk Actions
              </CardTitle>
              <CardDescription>
                Apply actions to multiple invoices at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Approve all verification required invoices
                    needsVerificationInvoices.forEach(invoice => {
                      const updatedInvoice = {
                        ...invoice,
                        human_verification_required: false,
                        status: 'completed',
                        auth_email: JSON.parse(localStorage.getItem('user'))?.email
                      };
                      handleUpdateInvoice(updatedInvoice);
                    });
                  }}
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Approve All ({needsVerificationInvoices.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Mark all as pending for further review
                    needsVerificationInvoices.forEach(invoice => {
                      const updatedInvoice = {
                        ...invoice,
                        status: 'pending',
                        auth_email: JSON.parse(localStorage.getItem('user'))?.email
                      };
                      handleUpdateInvoice(updatedInvoice);
                    });
                  }}
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Mark All as Pending
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                          Review & Edit
                        </Button>
                        {invoice.file_link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(invoice.file_link, '_blank')}
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            // Quick approve - set verification to false and status to completed
                            const updatedInvoice = {
                              ...invoice,
                              human_verification_required: false,
                              status: 'completed',
                              auth_email: JSON.parse(localStorage.getItem('user'))?.email
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
                          Quick Approve
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
          <AlertDialog open={!!selectedInvoice} onOpenChange={() => {
            setSelectedInvoice(null);
            setIsEditing(false);
            setEditedInvoice(null);
          }}>
            <AlertDialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center justify-between">
                  <span>Invoice Details - {selectedInvoice.invoice_id}</span>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEditing}
                        className="flex items-center gap-1"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to View
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStartEditing(selectedInvoice)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(null);
                              setIsEditing(false);
                              setEditedInvoice(null);
                            }}
                            className="h-8 w-8 p-0"
                            aria-label="Close"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Close Modal (Esc)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isEditing ? 'Edit invoice information and save changes. Click "Back to View" to cancel changes.' : 'Review and verify the extracted invoice information. Press Esc or click X to close.'}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Invoice ID *</Label>
                      {isEditing ? (
                        <Input
                          value={editedInvoice?.invoice_id || ''}
                          onChange={(e) => handleFieldChange('invoice_id', e.target.value)}
                          className="mt-1"
                          placeholder="e.g., PPP/0001/25-26"
                        />
                      ) : (
                        <p className="text-sm mt-1">{selectedInvoice.invoice_id}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Order ID</Label>
                      {isEditing ? (
                        <Input
                          value={editedInvoice?.order_id || ''}
                          onChange={(e) => handleFieldChange('order_id', e.target.value)}
                          className="mt-1"
                          placeholder="e.g., order101"
                        />
                      ) : (
                        <p className="text-sm mt-1">{selectedInvoice.order_id || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Task ID</Label>
                      {isEditing ? (
                        <Input
                          value={editedInvoice?.task_id || ''}
                          onChange={(e) => handleFieldChange('task_id', e.target.value)}
                          className="mt-1"
                          placeholder="UUID"
                        />
                      ) : (
                        <p className="text-xs mt-1 font-mono">{selectedInvoice.task_id || 'N/A'}</p>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold border-b pb-2 mt-6">Customer & Vendor Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Customer Name</Label>
                      {isEditing ? (
                        <Input
                          value={editedInvoice?.customer_name || ''}
                          onChange={(e) => handleFieldChange('customer_name', e.target.value)}
                          className="mt-1"
                          placeholder="Customer name"
                        />
                      ) : (
                        <p className="text-sm mt-1">{selectedInvoice.customer_name || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Extracted Vendor Name</Label>
                      {isEditing ? (
                        <Input
                          value={editedInvoice?.extracted_vendor_name || ''}
                          onChange={(e) => handleFieldChange('extracted_vendor_name', e.target.value)}
                          className="mt-1"
                          placeholder="e.g., Add Company Name"
                        />
                      ) : (
                        <p className="text-sm mt-1">{selectedInvoice.extracted_vendor_name || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Canonical Vendor ID</Label>
                      {isEditing ? (
                        <Input
                          value={editedInvoice?.canonical_vendor_id || ''}
                          onChange={(e) => handleFieldChange('canonical_vendor_id', e.target.value)}
                          className="mt-1"
                          placeholder="e.g., VEND_0006"
                        />
                      ) : (
                        <p className="text-sm mt-1">{selectedInvoice.canonical_vendor_id || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Ship to Address</Label>
                      {isEditing ? (
                        <textarea
                          value={editedInvoice?.ship_to_address || ''}
                          onChange={(e) => handleFieldChange('ship_to_address', e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={3}
                          placeholder="Shipping address"
                        />
                      ) : (
                        <p className="text-sm mt-1">{selectedInvoice.ship_to_address || 'N/A'}</p>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold border-b pb-2 mt-6">Date & Shipping</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Date *</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedInvoice?.date || ''}
                          onChange={(e) => handleFieldChange('date', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm mt-1">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Ship Mode</Label>
                      {isEditing ? (
                        <Input
                          value={editedInvoice?.ship_mode || ''}
                          onChange={(e) => handleFieldChange('ship_mode', e.target.value)}
                          className="mt-1"
                          placeholder="e.g., Sanjay Transportation"
                        />
                      ) : (
                        <p className="text-sm mt-1">{selectedInvoice.ship_mode || 'N/A'}</p>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold border-b pb-2 mt-6">Description</h3>
                  <div>
                    <Label className="text-sm font-medium">Invoice Description</Label>
                    {isEditing ? (
                      <textarea
                        value={editedInvoice?.description || ''}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        rows={3}
                        placeholder="Invoice description..."
                      />
                    ) : (
                      <p className="text-sm mt-1 p-2 bg-muted/50 rounded">{selectedInvoice.description || 'N/A'}</p>
                    )}
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b pb-2">Financial Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Currency</Label>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={editedInvoice?.currency || ''}
                            onChange={(e) => handleFieldChange('currency', e.target.value)}
                            className="mt-1"
                            placeholder="INR"
                          />
                          <Input
                            value={editedInvoice?.extracted_currency || ''}
                            onChange={(e) => handleFieldChange('extracted_currency', e.target.value)}
                            className="mt-1"
                            placeholder="₹"
                          />
                        </div>
                      ) : (
                        <p className="text-sm mt-1">{selectedInvoice.currency} ({selectedInvoice.extracted_currency})</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Subtotal</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedInvoice?.sub_total || 0}
                          onChange={(e) => handleFieldChange('sub_total', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                          step="0.01"
                        />
                      ) : (
                        <p className="text-sm mt-1">{formatCurrency(selectedInvoice.sub_total || 0)}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Discount</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedInvoice?.discount || 0}
                          onChange={(e) => handleFieldChange('discount', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                          step="0.01"
                        />
                      ) : (
                        <p className="text-sm mt-1">{formatCurrency(selectedInvoice.discount || 0)}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Shipping Fee</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedInvoice?.shipping_fee || 0}
                          onChange={(e) => handleFieldChange('shipping_fee', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                          step="0.01"
                        />
                      ) : (
                        <p className="text-sm mt-1">{formatCurrency(selectedInvoice.shipping_fee || 0)}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Total Amount *</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedInvoice?.total_amount_payable || 0}
                          onChange={(e) => handleFieldChange('total_amount_payable', parseFloat(e.target.value) || 0)}
                          className="mt-1"
                          step="0.01"
                        />
                      ) : (
                        <p className="text-sm font-bold mt-1">{formatCurrency(selectedInvoice.total_amount_payable)}</p>
                      )}
                    </div>
                  </div>

                  {/* File Information */}
                  <h3 className="text-lg font-semibold border-b pb-2 mt-6">File & Technical Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">PDF Path</Label>
                      {isEditing ? (
                        <Input
                          value={editedInvoice?.pdf_path || ''}
                          onChange={(e) => handleFieldChange('pdf_path', e.target.value)}
                          className="mt-1"
                          placeholder="tests/file.pdf"
                        />
                      ) : (
                        <p className="text-xs mt-1 font-mono">{selectedInvoice.pdf_path || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium">File Link</Label>
                      {isEditing ? (
                        <Input
                          value={editedInvoice?.file_link || ''}
                          onChange={(e) => handleFieldChange('file_link', e.target.value)}
                          className="mt-1"
                          placeholder="https://domain.com/files/file.pdf"
                        />
                      ) : (
                        <p className="text-xs mt-1 font-mono break-all">{selectedInvoice.file_link || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                {(selectedInvoice.line_items && selectedInvoice.line_items.length > 0) || (isEditing && editedInvoice?.line_items) && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Line Items</Label>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addLineItem}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Unit Cost</TableHead>
                            <TableHead>Total</TableHead>
                            {isEditing && <TableHead>Actions</TableHead>}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(isEditing ? editedInvoice.line_items : selectedInvoice.line_items)?.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {isEditing ? (
                                  <Input
                                    value={item.product_name || ''}
                                    onChange={(e) => handleLineItemChange(index, 'product_name', e.target.value)}
                                    className="w-full"
                                    placeholder="Product name"
                                  />
                                ) : (
                                  item.product_name
                                )}
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    value={item.quantity || 0}
                                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                                    className="w-20"
                                    min="0"
                                  />
                                ) : (
                                  item.quantity
                                )}
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <Input
                                    type="number"
                                    value={item.unit_cost || 0}
                                    onChange={(e) => handleLineItemChange(index, 'unit_cost', e.target.value)}
                                    className="w-24"
                                    min="0"
                                    step="0.01"
                                  />
                                ) : (
                                  formatCurrency(item.unit_cost)
                                )}
                              </TableCell>
                              <TableCell>{formatCurrency((item.quantity || 0) * (item.unit_cost || 0))}</TableCell>
                              {isEditing && (
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeLineItem(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Status and Verification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    {isEditing ? (
                      <select
                        value={editedInvoice?.status || ''}
                        onChange={(e) => handleFieldChange('status', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <p className="text-sm mt-1 capitalize">{selectedInvoice.status}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Human Verification Required</Label>
                    {isEditing ? (
                      <div className="mt-1 flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editedInvoice?.human_verification_required || false}
                          onChange={(e) => handleFieldChange('human_verification_required', e.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">Requires verification</span>
                      </div>
                    ) : (
                      <p className="text-sm mt-1">{selectedInvoice.human_verification_required ? 'Yes' : 'No'}</p>
                    )}
                  </div>
                </div>

                {/* Verification Reason */}
                {(selectedInvoice.human_verification_reason || (isEditing && editedInvoice?.human_verification_required)) && (
                  <div>
                    <Label className="text-sm font-medium">Verification Reason</Label>
                    {isEditing ? (
                      <textarea
                        value={editedInvoice?.human_verification_reason || ''}
                        onChange={(e) => handleFieldChange('human_verification_reason', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        rows={3}
                        placeholder="Enter reason for verification if required"
                      />
                    ) : (
                      <div className="mt-1 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                        <p className="text-sm">{selectedInvoice.human_verification_reason}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* API Preview for Developers */}
                {isEditing && (
                  <div className="border-t pt-4">
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                        🔧 Developer Preview - API Payload
                      </summary>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-2">This is the data that will be sent to the updateInvoice endpoint:</p>
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(
                            {
                              data: {
                                ...editedInvoice,
                                auth_email: JSON.parse(localStorage.getItem('user'))?.email
                              }
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}
              </div>

              <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEditing} className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to View
                    </Button>
                    <Button
                      onClick={handleSaveEditing}
                      disabled={isUpdating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isUpdating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <Button
                      onClick={() => handleStartEditing(selectedInvoice)}
                      variant="outline"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Invoice
                    </Button>
                    <AlertDialogAction
                      onClick={() => {
                        const updatedInvoice = {
                          ...selectedInvoice,
                          human_verification_required: false,
                          status: 'completed',
                          auth_email: JSON.parse(localStorage.getItem('user'))?.email
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
                  </>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Invoice Template */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Invoice Template & API Example
            </CardTitle>
            <CardDescription>
              Invoice structure for testing the updateInvoice endpoint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium mb-2">Example Invoice JSON Structure</h4>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-muted-foreground">
{`{
  "data": {
    "invoice_id": "PPP/0001/25-26",
    "order_id": "order101",
    "customer_name": null,
    "extracted_vendor_name": "Add Company Name",
    "canonical_vendor_id": "VEND_0006",
    "ship_to_address": null,
    "date": "2025-10-22",
    "ship_mode": "Sanjay Transportation",
    "description": "Invoice PPP/0001/25-26 from Add Company Name for 116800.00 ₹.",
    "line_items": [
      {
        "product_name": "Item Description I",
        "quantity": 1,
        "unit_cost": 100000.0
      }
    ],
    "extracted_currency": "₹",
    "currency": "INR",
    "sub_total": 100000.0,
    "discount": 1200.0,
    "shipping_fee": 0.0,
    "total_amount_payable": 116800.0,
    "human_verification_required": false,
    "human_verification_reason": null,
    "status": "completed",
    "pdf_path": "tests/4b09e9bd-ed58-4502-bb8a-a316063425ce.pdf",
    "task_id": "b476337a-b9b8-46ff-bbf5-c6b353ce81af",
    "file_link": "https://8d826f91fce0.ngrok-free.app/files/4b09e9bd-ed58-4502-bb8a-a316063425ce.pdf",
    "auth_email": "techzorg48@gmail.com"
  }
}`}
                </pre>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Required Headers:</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Content-Type: application/json</li>
                    <li>• auth_email: {JSON.parse(localStorage.getItem('user'))?.email || 'user@example.com'}</li>
                    <li>• Authorization: Bearer [token]</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Key Fields to Update:</h5>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• human_verification_required: boolean</li>
                    <li>• status: "pending" | "completed"</li>
                    <li>• total_amount_payable: number</li>
                    <li>• line_items: array of products</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
            {/* Key Insights Summary */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Important metrics and trends from your invoice data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Average Invoice Value</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {stats && stats.totalTransactions > 0
                        ? formatCurrency(stats.totalRevenue / stats.totalTransactions)
                        : formatCurrency(0)
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Based on {stats?.totalTransactions || 0} total invoices
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Monthly Velocity</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {stats?.thisMonthInvoices || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Invoices processed this month
                    </p>
                  </div>
                  {stats?.verificationNeeded > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm font-medium">Action Required</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">
                        {stats.verificationNeeded}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Invoices need verification
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium">Efficiency Score</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats && stats.totalTransactions > 0
                        ? `${((stats.completedInvoices / stats.totalTransactions) * 100).toFixed(0)}%`
                        : '100%'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Invoices completed without issues
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Performance Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats ? stats.thisMonthInvoices : '---'}
                  </div>
                  <p className="text-sm text-muted-foreground">invoices processed</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Revenue: {stats ? formatCurrency(stats.thisMonthRevenue) : '---'}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Growth Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={cn(
                    "text-2xl font-bold",
                    stats?.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {stats?.revenueGrowth !== undefined ? `${stats.revenueGrowth > 0 ? '+' : ''}${stats.revenueGrowth}%` : '---'}
                  </div>
                  <p className="text-sm text-muted-foreground">vs last month</p>
                  <div className="text-xs text-muted-foreground mt-1 space-y-1">
                    <p>This month: {stats ? formatCurrency(stats.thisMonthRevenue || 0) : '---'}</p>
                    <p>Last month: {stats ? formatCurrency(stats.lastMonthRevenue || 0) : '---'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Processing Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats && stats.totalTransactions > 0
                      ? `${((stats.completedInvoices / stats.totalTransactions) * 100).toFixed(1)}%`
                      : '---'
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">completion rate</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats ? `${stats.completedInvoices}/${stats.totalTransactions}` : '---'} processed
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-5 w-5 text-orange-500" />
                    Queue Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats ? (stats.verificationNeeded + stats.pendingInvoices) : '---'}
                  </div>
                  <p className="text-sm text-muted-foreground">items in queue</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats ? stats.verificationNeeded : '---'} need verification
                  </p>
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
                    {activeView === 'samples' && 'Review and verification center'}
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

      {/* Invoice Viewer Modal */}
      <InvoiceViewer />
    </div>
  );
};

export default Dashboard;
