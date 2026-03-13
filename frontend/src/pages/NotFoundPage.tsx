import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../hooks/useAuth';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated && user) {
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/parent/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      p={3}
    >
      <Typography variant="h1" fontWeight={700} color="primary" sx={{ fontSize: { xs: '6rem', md: '10rem' } }}>
        404
      </Typography>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4} maxWidth={400}>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button variant="contained" startIcon={<HomeIcon />} onClick={handleGoHome} size="large">
        Go Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
