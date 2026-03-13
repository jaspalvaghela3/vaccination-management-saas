import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/parent/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return <RegisterForm />;
};

export default RegisterPage;
