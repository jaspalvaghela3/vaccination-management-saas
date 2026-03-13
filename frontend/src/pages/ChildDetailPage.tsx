import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import ChildDetail from '../components/parent/ChildDetail';
import { Box, Typography } from '@mui/material';

const ChildDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <Layout>
        <Box textAlign="center" py={6}>
          <Typography color="text.secondary">Child not found</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <ChildDetail childId={id} />
    </Layout>
  );
};

export default ChildDetailPage;
