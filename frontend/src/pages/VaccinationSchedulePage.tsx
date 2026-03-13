import React from 'react';
import Layout from '../components/common/Layout';
import ChildList from '../components/parent/ChildList';
import PatientList from '../components/doctor/PatientList';
import { useAuth } from '../hooks/useAuth';

const VaccinationSchedulePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {user?.role === 'doctor' ? <PatientList /> : <ChildList />}
    </Layout>
  );
};

export default VaccinationSchedulePage;
