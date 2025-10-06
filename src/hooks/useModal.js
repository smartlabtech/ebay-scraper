import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  openModal,
  closeModal,
  closeAllModals,
  selectModalOpen
} from '../store/slices/uiSlice';

export const useModal = (modalName) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectModalOpen(modalName));

  const open = useCallback(() => {
    dispatch(openModal(modalName));
  }, [dispatch, modalName]);

  const close = useCallback(() => {
    dispatch(closeModal(modalName));
  }, [dispatch, modalName]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

// Hook for managing all modals
export const useModals = () => {
  const dispatch = useDispatch();

  const openModalByName = useCallback((modalName) => {
    dispatch(openModal(modalName));
  }, [dispatch]);

  const closeModalByName = useCallback((modalName) => {
    dispatch(closeModal(modalName));
  }, [dispatch]);

  const closeAll = useCallback(() => {
    dispatch(closeAllModals());
  }, [dispatch]);

  return {
    openModal: openModalByName,
    closeModal: closeModalByName,
    closeAllModals: closeAll
  };
};