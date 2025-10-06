import api from './api';

// Get active credit packages
export const getCreditPackages = async (params = {}) => {
  const queryParams = new URLSearchParams({
    isActive: true,
    page: 1,
    limit: 20,
    ...params
  });
  
  const response = await api.get(`/credit-packages?${queryParams}`);
  return response.data;
};

// Initiate credit package order
export const initiateCreditPackageOrder = async (packageId, metadata = {}) => {
  const response = await api.post(`/credit-packages/${packageId}/initiate`, {
    metadata
  });
  return response.data;
};

// Get credit package by ID
export const getCreditPackageById = async (packageId) => {
  const response = await api.get(`/credit-packages/${packageId}`);
  return response.data;
};