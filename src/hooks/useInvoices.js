import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import * as invoiceService from '../services/invoices';
import { useAuth } from './useAuth';

export const useInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState({});

  // Load invoices
  const loadInvoices = useCallback(async (params = {}) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await invoiceService.getInvoices(params);
      setInvoices(data);
      return data;
    } catch (err) {
      console.error('Failed to load invoices:', err);
      setError(err.message || 'Failed to load invoices');
      notifications.show({
        title: 'Error',
        message: 'Failed to load invoices. Please try again.',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Download invoice PDF
  const downloadInvoice = useCallback(async (invoice) => {
    if (!invoice._id) return;
    
    setDownloading(prev => ({ ...prev, [invoice._id]: true }));
    
    try {
      const blob = await invoiceService.downloadInvoicePDF(invoice._id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber || `invoice-${invoice._id}`}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      notifications.show({
        title: 'Success',
        message: 'Invoice downloaded successfully',
        color: 'green'
      });
    } catch (err) {
      console.error('Failed to download invoice:', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to download invoice. Please try again.',
        color: 'red'
      });
    } finally {
      setDownloading(prev => {
        const newState = { ...prev };
        delete newState[invoice._id];
        return newState;
      });
    }
  }, []);

  // Format invoice data for display
  const formatInvoice = useCallback((invoice) => {
    const isSubscription = invoice.metadata?.type === 'subscription' || 
                          invoice.items?.[0]?.metadata?.type === 'subscription';
    const isCreditRecharge = invoice.metadata?.type === 'credit_recharge' || 
                            invoice.items?.[0]?.metadata?.type === 'credit_recharge';
    
    let description = '';
    let credits = 0;
    
    if (isCreditRecharge) {
      description = invoice.items?.[0]?.description || invoice.metadata?.packageName || 'Credit Purchase';
      credits = invoice.metadata?.credits || invoice.items?.[0]?.metadata?.credits || 0;
    } else if (isSubscription) {
      description = invoice.items?.[0]?.description || 'Subscription';
      credits = invoice.items?.[0]?.metadata?.credits || 0;
    } else {
      description = invoice.items?.[0]?.description || 'Invoice';
      credits = invoice.items?.[0]?.metadata?.credits || 0;
    }
    
    return {
      id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      date: new Date(invoice.createdAt),
      description,
      amount: invoice.total,
      subtotal: invoice.subtotal,
      tax: invoice.tax,
      status: invoice.status,
      credits,
      type: isCreditRecharge ? 'credit_recharge' : isSubscription ? 'subscription' : 'other',
      paidAt: invoice.paidAt ? new Date(invoice.paidAt) : null,
      dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null,
      currency: invoice.currency || 'USD'
    };
  }, []);

  // Load invoices on mount
  useEffect(() => {
    if (user) {
      loadInvoices();
    }
  }, [user, loadInvoices]);

  return {
    invoices: invoices.map(formatInvoice),
    loading,
    error,
    downloading,
    loadInvoices,
    downloadInvoice,
    formatInvoice
  };
};