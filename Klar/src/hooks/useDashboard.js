import { useState, useEffect } from 'react';
import { dashboardAPI } from '../Server/api';

export const useDashboard = () => {
  const [data, setData] = useState({
    invoices: [],
    expenses: [],
    allTransactions: []
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingInvoices: 0,
    completedInvoices: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardData = await dashboardAPI.getDashboardData();
      const summaryStats = dashboardAPI.getSummaryStats(dashboardData);

      setData(dashboardData);
      setStats(summaryStats);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    stats,
    loading,
    error,
    refreshData
  };
};