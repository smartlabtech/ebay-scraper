import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Alert,
  Group,
  Button,
  Text,
  ThemeIcon,
  Box
} from '@mantine/core';
import { 
  MdWarning as IconWarning,
  MdEmail as IconEmail,
  MdCheckCircle as IconCheck
} from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  selectUser, 
  selectIsEmailVerified,
  selectVerificationEmailSent,
  resendVerificationEmail,
  clearVerificationEmailSent
} from '../store/slices/authSlice';

const EmailVerificationBanner = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isEmailVerified = useSelector(selectIsEmailVerified);
  const verificationEmailSent = useSelector(selectVerificationEmailSent);
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Don't show if email is verified or no user
  if (!user || isEmailVerified) {
    return null;
  }

  useEffect(() => {
    if (verificationEmailSent) {
      setShowSuccess(true);
      setSending(false);
      
      // Clear success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
        dispatch(clearVerificationEmailSent());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [verificationEmailSent, dispatch]);

  const handleResend = async () => {
    setSending(true);
    try {
      await dispatch(resendVerificationEmail()).unwrap();
    } catch (error) {
      setSending(false);
    }
  };

  return (
    <Box
      style={{
        width: '100%',
        padding: '1rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              icon={
                <ThemeIcon color="green" size="lg" radius="xl">
                  <IconCheck size={20} />
                </ThemeIcon>
              }
              title="Verification Email Sent!"
              color="green"
              variant="filled"
              styles={{
                root: { backgroundColor: 'rgba(40, 167, 69, 0.9)' }
              }}
            >
              <Text size="sm" c="white">
                We've sent a verification email to {user.email}. 
                Please check your inbox and spam folder.
              </Text>
            </Alert>
          </motion.div>
        ) : (
          <motion.div
            key="warning"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              icon={
                <ThemeIcon color="yellow" size="lg" radius="xl">
                  <IconWarning size={20} />
                </ThemeIcon>
              }
              color="yellow"
              variant="filled"
              styles={{
                root: { 
                  backgroundColor: 'rgba(255, 193, 7, 0.9)',
                  border: 'none'
                }
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Box>
                  <Text fw={600} size="md" c="dark" mb={4}>
                    Email Verification Required
                  </Text>
                  <Text size="sm" c="dark.6">
                    Please verify your email address to access all features. 
                    Check your inbox for the verification link.
                  </Text>
                </Box>
                <Button
                  onClick={handleResend}
                  loading={sending}
                  disabled={sending}
                  leftSection={<IconEmail size={18} />}
                  variant="filled"
                  color="dark"
                  size="sm"
                  styles={{
                    root: {
                      minWidth: '140px'
                    }
                  }}
                >
                  {sending ? 'Sending...' : 'Resend Email'}
                </Button>
              </Group>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Additional info for mobile */}
      <Text 
        size="xs" 
        c="white" 
        ta="center" 
        mt="xs"
        style={{ opacity: 0.9 }}
        hiddenFrom="sm"
      >
        Some features may be limited until you verify your email
      </Text>
    </Box>
  );
};

export default EmailVerificationBanner;