import api from './api';

// Track ongoing requests to prevent duplicates
let invoicesPromise = null;

// Get invoices with optional filters
export const getInvoices = async (params = {}) => {
  // Create a cache key based on params
  const cacheKey = JSON.stringify(params);

  // For simplicity, we'll only deduplicate requests with the same params
  // In this case, the default call without params (most common)
  if (Object.keys(params).length === 0 && invoicesPromise) {
    console.log('Invoices already being fetched, reusing existing request');
    return invoicesPromise;
  }

  const queryParams = new URLSearchParams(params);

  // Create the promise
  const promise = api.get(`/invoice${queryParams.toString() ? `?${queryParams}` : ''}`)
    .then(response => response.data)
    .finally(() => {
      // Only clear if this was the cached promise
      if (Object.keys(params).length === 0) {
        invoicesPromise = null;
      }
    });

  // Only cache the default request (no params)
  if (Object.keys(params).length === 0) {
    invoicesPromise = promise;
  }

  return promise;
};

// Get invoice by ID
export const getInvoiceById = async (invoiceId) => {
  const response = await api.get(`/invoice/${invoiceId}`);
  return response.data;
};

// Download invoice PDF
export const downloadInvoicePDF = async (invoiceId) => {
  const response = await api.get(`/invoice/${invoiceId}/download`, {
    responseType: 'blob'
  });
  return response.data;
};

// Get invoice summary/stats
export const getInvoiceSummary = async () => {
  const response = await api.get('/invoice/summary');
  return response.data;
};