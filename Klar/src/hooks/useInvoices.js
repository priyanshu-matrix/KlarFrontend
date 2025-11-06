import { useState, useEffect } from 'react';
import { invoiceAPI, fallbackInvoiceData } from '../Server/api';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceAPI.getInvoices();
      setInvoices(Array.isArray(data) ? data : [data]);
      setIsUsingFallback(false);
    } catch (err) {
      console.warn('Failed to fetch from API, using fallback data:', err.message);
      setError(err.message);
      setInvoices(fallbackInvoiceData);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const refreshInvoices = () => {
    fetchInvoices();
  };

  const createInvoice = async (invoiceData) => {
    try {
      const newInvoice = await invoiceAPI.createInvoice(invoiceData);
      setInvoices(prev => [...prev, newInvoice]);
      return newInvoice;
    } catch (err) {
      console.error('Failed to create invoice:', err);
      throw err;
    }
  };

  const updateInvoice = async (id, invoiceData) => {
    try {
      const updatedInvoice = await invoiceAPI.updateInvoice(id, invoiceData);
      setInvoices(prev =>
        prev.map(invoice =>
          invoice._id === id ? updatedInvoice : invoice
        )
      );
      return updatedInvoice;
    } catch (err) {
      console.error('Failed to update invoice:', err);
      throw err;
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await invoiceAPI.deleteInvoice(id);
      setInvoices(prev => prev.filter(invoice => invoice._id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete invoice:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    isUsingFallback,
    refreshInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
};