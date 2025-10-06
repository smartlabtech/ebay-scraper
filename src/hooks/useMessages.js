import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import {
  fetchMessages,
  fetchMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  generateAIMessage,
  testMessage,
  createVariant,
  setFilters,
  clearCurrentMessage,
  clearAIGeneratedMessage,
  selectMessages,
  selectCurrentMessage,
  selectAIGeneratedMessage,
  selectMessagesLoading,
  selectAILoading,
  selectMessageFilters
} from '../store/slices/messagesSlice';
import { useNotifications } from './useNotifications';

export const useMessages = () => {
  const dispatch = useDispatch();
  const { notifySuccess, notifyError, notifyInfo } = useNotifications();
  
  const messages = useSelector(selectMessages) || [];
  const currentMessage = useSelector(selectCurrentMessage);
  const aiGeneratedMessage = useSelector(selectAIGeneratedMessage);
  const loading = useSelector(selectMessagesLoading);
  const aiLoading = useSelector(selectAILoading);
  const filters = useSelector(selectMessageFilters);

  const [testingMessageId, setTestingMessageId] = useState(null);

  // Fetch messages
  const loadMessages = useCallback(async (customFilters = {}) => {
    try {
      const result = await dispatch(fetchMessages({ ...filters, ...customFilters })).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load messages');
      throw error;
    }
  }, [dispatch, filters, notifyError]);

  // Fetch single message
  const loadMessage = useCallback(async (messageId) => {
    try {
      const result = await dispatch(fetchMessageById(messageId)).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load message');
      throw error;
    }
  }, [dispatch, notifyError]);

  // Create new message
  const createNewMessage = useCallback(async (messageData) => {
    try {
      const result = await dispatch(createMessage(messageData)).unwrap();
      notifySuccess('Message created successfully');
      return result;
    } catch (error) {
      notifyError('Failed to create message');
      throw error;
    }
  }, [dispatch, notifySuccess, notifyError]);

  // Update existing message
  const updateExistingMessage = useCallback(async (messageId, updates) => {
    try {
      const result = await dispatch(updateMessage({ messageId, updates })).unwrap();
      notifySuccess('Message updated successfully');
      return result;
    } catch (error) {
      notifyError('Failed to update message');
      throw error;
    }
  }, [dispatch, notifySuccess, notifyError]);

  // Delete message
  const removeMessage = useCallback(async (messageId) => {
    try {
      await dispatch(deleteMessage(messageId)).unwrap();
      notifySuccess('Message deleted successfully');
    } catch (error) {
      notifyError('Failed to delete message');
      throw error;
    }
  }, [dispatch, notifySuccess, notifyError]);

  // Generate AI message
  const generateMessage = useCallback(async (params) => {
    try {
      notifyInfo('Generating AI message...');
      const result = await dispatch(generateAIMessage(params)).unwrap();
      notifySuccess('AI message generated successfully');
      return result;
    } catch (error) {
      notifyError('Failed to generate AI message');
      throw error;
    }
  }, [dispatch, notifySuccess, notifyError, notifyInfo]);

  // Test message
  const testMessagePerformance = useCallback(async (messageId) => {
    try {
      setTestingMessageId(messageId);
      notifyInfo('Running performance test...');
      const result = await dispatch(testMessage(messageId)).unwrap();
      notifySuccess('Test completed successfully');
      setTestingMessageId(null);
      return result;
    } catch (error) {
      notifyError('Failed to test message');
      setTestingMessageId(null);
      throw error;
    }
  }, [dispatch, notifySuccess, notifyError, notifyInfo]);

  // Create message variant
  const createMessageVariant = useCallback(async (messageId, variantData) => {
    try {
      const result = await dispatch(createVariant({ messageId, variant: variantData })).unwrap();
      notifySuccess('Variant created successfully');
      return result;
    } catch (error) {
      notifyError('Failed to create variant');
      throw error;
    }
  }, [dispatch, notifySuccess, notifyError]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  // Clear current message
  const clearMessage = useCallback(() => {
    dispatch(clearCurrentMessage());
  }, [dispatch]);

  // Clear AI generated message
  const clearAIMessage = useCallback(() => {
    dispatch(clearAIGeneratedMessage());
  }, [dispatch]);

  // Get messages by project
  const getMessagesByProject = useCallback((projectId) => {
    return messages.filter(m => m.projectId === projectId);
  }, [messages]);

  // Get messages by type
  const getMessagesByType = useCallback((type) => {
    return messages.filter(m => m.type === type);
  }, [messages]);

  // Get messages by status
  const getMessagesByStatus = useCallback((status) => {
    return messages.filter(m => m.status === status);
  }, [messages]);

  // Get message stats
  const getMessageStats = useCallback(() => {
    const total = messages.length;
    const draft = messages.filter(m => m.status === 'draft').length;
    const published = messages.filter(m => m.status === 'published').length;
    const testing = messages.filter(m => m.status === 'testing').length;
    const archived = messages.filter(m => m.status === 'archived').length;
    
    const avgScore = messages.length > 0 
      ? messages.reduce((sum, m) => sum + m.score, 0) / messages.length 
      : 0;

    return {
      total,
      draft,
      published,
      testing,
      archived,
      avgScore: avgScore.toFixed(1)
    };
  }, [messages]);

  return {
    messages,
    currentMessage,
    aiGeneratedMessage,
    loading,
    aiLoading,
    filters,
    testingMessageId,
    loadMessages,
    loadMessage,
    createNewMessage,
    updateExistingMessage,
    removeMessage,
    generateMessage,
    testMessagePerformance,
    createMessageVariant,
    updateFilters,
    clearMessage,
    clearAIMessage,
    getMessagesByProject,
    getMessagesByType,
    getMessagesByStatus,
    getMessageStats
  };
};