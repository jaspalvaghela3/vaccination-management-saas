import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { store, RootState, AppDispatch } from './store';
import { hideSnackbar } from './store/notificationSlice';
import { fetchProfileThunk } from './store/authSlice';
import { TOKEN_KEYS } from './constants';
import { UserRole } from './types';
import { useParams } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import ParentDashboardPage from './pages/ParentDashboardPage';
import ChildDetailPage from './pages/ChildDetailPage';
import VaccinationSchedulePage from './pages/VaccinationSchedulePage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/common/Layout';
import PatientList from './components/doctor/PatientList';
import PatientDetail from './components/doctor/PatientDetail';
import ChildList from './components/parent/ChildList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0',
      light: '#5e92f3',
      dark: '#003c8f',
    },
    secondary: {
      main: '#7b1fa2',
      light: '#ae52d4',
      dark: '#4a0072',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
      },
    },
  },
});

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/parent/dashboard'} replace />;
  }
  return <>{children}</>;
};

const PatientDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <Layout><PatientDetail patientId={id} /></Layout>;
};

const SnackbarNotification: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { snackbar } = useSelector((state: RootState) => state.notifications);
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={() => dispatch(hideSnackbar())}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={() => dispatch(hideSnackbar())} severity={snackbar.severity} variant="filled" elevation={6} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS);
    if (token && isAuthenticated && !user) {
      dispatch(fetchProfileThunk());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboardPage /></ProtectedRoute>} />
        <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={['doctor']}><Layout><PatientList /></Layout></ProtectedRoute>} />
        <Route path="/doctor/patients/:id" element={<ProtectedRoute allowedRoles={['doctor']}><PatientDetailWrapper /></ProtectedRoute>} />
        <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboardPage /></ProtectedRoute>} />
        <Route path="/parent/children" element={<ProtectedRoute allowedRoles={['parent']}><Layout><ChildList /></Layout></ProtectedRoute>} />
        <Route path="/parent/children/:id" element={<ProtectedRoute allowedRoles={['parent']}><ChildDetailPage /></ProtectedRoute>} />
        <Route path="/vaccination-schedule" element={<ProtectedRoute><VaccinationSchedulePage /></ProtectedRoute>} />
        <Route path="/" element={isAuthenticated && user ? <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/parent/dashboard'} replace /> : <Navigate to="/login" replace />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SnackbarNotification />
    </BrowserRouter>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  </Provider>
);

export default App;
