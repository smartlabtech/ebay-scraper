import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Navigation from './Navigation';
import ToastContainer from '../common/Toast';
import EmailVerificationBanner from '../EmailVerificationBanner';
import { AppShell, Box } from '@mantine/core';
import { selectIsEmailVerified } from '../../store/slices/authSlice';

const DashboardLayout = () => {
  const isEmailVerified = useSelector(selectIsEmailVerified);

  return (
    <>
      <AppShell
        header={{ height: 100 }}
        padding="md"
      >
        <AppShell.Header>
          <Navigation />
        </AppShell.Header>

        <AppShell.Main>
          {/* Email Verification Banner */}
          {!isEmailVerified && (
            <Box mb="md">
              <EmailVerificationBanner />
            </Box>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </AppShell.Main>
      </AppShell>

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
};

export default DashboardLayout;