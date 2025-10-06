import React, { useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { useSelector, useDispatch } from 'react-redux';
import { selectToasts, markToastShown } from '../../store/slices/uiSlice';
import { useNotifications } from '../../hooks/useNotifications';
import { 
  MdCheck as IconCheck, 
  MdClose as IconX, 
  MdWarning as IconAlertCircle, 
  MdInfo as IconInfoCircle 
} from 'react-icons/md';

const ToastContainer = () => {
  const toasts = useSelector(selectToasts);
  const dispatch = useDispatch();
  const { removeToast } = useNotifications();

  useEffect(() => {
    toasts.forEach(toast => {
      if (!toast.shown) {
        const icons = {
          success: <IconCheck size={18} />,
          error: <IconX size={18} />,
          warning: <IconAlertCircle size={18} />,
          info: <IconInfoCircle size={18} />
        };

        const colors = {
          success: 'green',
          error: 'red',
          warning: 'yellow',
          info: 'blue'
        };

        notifications.show({
          id: toast.id,
          title: toast.type.charAt(0).toUpperCase() + toast.type.slice(1),
          message: toast.message,
          color: colors[toast.type] || 'blue',
          icon: icons[toast.type],
          autoClose: toast.duration || 4000,
          onClose: () => removeToast(toast.id)
        });

        // Mark as shown to prevent duplicate notifications
        dispatch(markToastShown(toast.id));
      }
    });
  }, [toasts, removeToast, dispatch]);

  return null;
};

export default ToastContainer;