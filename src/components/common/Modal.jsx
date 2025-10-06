import React from 'react';
import { Modal as MantineModal, Stack, Group, Button, Text, ThemeIcon } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose as IconX, MdInfo as IconInfo, MdWarning as IconWarning, MdError as IconError, MdCheckCircle as IconSuccess } from 'react-icons/md';

// Enhanced Modal component with animations and variants
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  centered = true,
  overlayProps = { opacity: 0.55, blur: 3 },
  withCloseButton = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  trapFocus = true,
  returnFocus = true,
  padding = 'xl',
  radius = 'md',
  shadow = 'xl',
  withBorder = false,
  zIndex = 200,
  fullScreen = false,
  target,
  transitionProps = {
    transition: 'fade',
    duration: 200,
    timingFunction: 'ease'
  },
  ...props 
}) => {
  // Size mapping for more options
  const getSizeValue = () => {
    const sizeMap = {
      'xs': 320,
      'sm': 380,
      'md': 440,
      'lg': 620,
      'xl': 780,
      'full': '100%',
      'auto': 'auto'
    };
    return sizeMap[size] || size;
  };

  return (
    <MantineModal
      opened={isOpen}
      onClose={onClose}
      title={title}
      size={getSizeValue()}
      centered={centered}
      overlayProps={overlayProps}
      withCloseButton={withCloseButton}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      trapFocus={trapFocus}
      returnFocus={returnFocus}
      padding={padding}
      radius={radius}
      shadow={shadow}
      withBorder={withBorder}
      zIndex={zIndex}
      fullScreen={fullScreen}
      target={target}
      transitionProps={transitionProps}
      {...props}
    >
      {children}
    </MantineModal>
  );
};

// Confirmation Modal variant
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'red',
  icon,
  loading = false,
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      {...props}
    >
      <Stack>
        {icon && (
          <ThemeIcon size="xl" radius="xl" color={confirmColor} variant="light" style={{ alignSelf: 'center' }}>
            {icon}
          </ThemeIcon>
        )}
        <Text ta="center">{message}</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button 
            color={confirmColor} 
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

// Alert Modal variant
export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  buttonText = 'OK',
  ...props
}) => {
  const typeConfig = {
    info: { icon: <IconInfo size={24} />, color: 'blue' },
    warning: { icon: <IconWarning size={24} />, color: 'yellow' },
    error: { icon: <IconError size={24} />, color: 'red' },
    success: { icon: <IconSuccess size={24} />, color: 'green' }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      {...props}
    >
      <Stack align="center" spacing="md">
        <ThemeIcon size="xl" radius="xl" color={config.color} variant="light">
          {config.icon}
        </ThemeIcon>
        <Text ta="center">{message}</Text>
        <Button fullWidth onClick={onClose} color={config.color}>
          {buttonText}
        </Button>
      </Stack>
    </Modal>
  );
};

// Drawer Modal variant (slides from side)
export const DrawerModal = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'sm',
  ...props
}) => {
  const positionStyles = {
    right: { right: 0, top: 0, height: '100vh' },
    left: { left: 0, top: 0, height: '100vh' },
    top: { top: 0, left: 0, width: '100vw' },
    bottom: { bottom: 0, left: 0, width: '100vw' }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      centered={false}
      styles={{
        content: {
          ...positionStyles[position],
          position: 'fixed',
          borderRadius: 0
        },
        header: {
          borderBottom: '1px solid var(--mantine-color-gray-3)'
        }
      }}
      transitionProps={{
        transition: position === 'right' ? 'slide-left' : 
                    position === 'left' ? 'slide-right' :
                    position === 'top' ? 'slide-down' :
                    'slide-up',
        duration: 250
      }}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default Modal;