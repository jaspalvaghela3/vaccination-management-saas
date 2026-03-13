import React, { useEffect, useState } from 'react';
import {
  Box,
  GridLegacy as Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Button,
  Chip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchChildrenThunk, addChild } from '../../store/childSlice';
import { getAgeDisplay, formatDate } from '../../utils/dateUtils';
import AddChildForm from './AddChildForm';
import { Child } from '../../types';

const ChildList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { children, loading } = useSelector((state: RootState) => state.children);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchChildrenThunk());
  }, [dispatch]);

  const handleChildAdded = (child: Child) => {
    dispatch(addChild(child));
    setAddDialogOpen(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>
          My Children
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
          aria-label="Add child"
        >
          Add Child
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          : children.map((child) => (
              <Grid item xs={12} sm={6} md={4} key={child.id}>
                <Card sx={{ borderRadius: 3, height: '100%' }}>
                  <CardActionArea
                    onClick={() => navigate(`/parent/children/${child.id}`)}
                    sx={{ height: '100%' }}
                    aria-label={`View details for ${child.firstName} ${child.lastName}`}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            bgcolor: child.gender === 'male' ? 'info.light' : 'secondary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          <ChildCareIcon />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {child.firstName} {child.lastName}
                          </Typography>
                          <Chip
                            label={child.gender}
                            size="small"
                            color={child.gender === 'male' ? 'info' : 'secondary'}
                            variant="outlined"
                            sx={{ textTransform: 'capitalize', height: 20, fontSize: '0.7rem' }}
                          />
                        </Box>
                      </Box>

                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Date of Birth
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDate(child.dateOfBirth)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Age
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {getAgeDisplay(child.dateOfBirth)}
                        </Typography>
                      </Box>
                      {child.bloodType && (
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Blood Type
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {child.bloodType}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
      </Grid>

      {!loading && children.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 3,
            mt: 2,
          }}
        >
          <ChildCareIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No children registered yet
          </Typography>
          <Typography variant="body2" color="text.disabled" mb={3}>
            Add your children to track their vaccination schedule
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
            Add Your First Child
          </Button>
        </Box>
      )}

      {children.length > 0 && (
        <Fab
          color="primary"
          aria-label="Add child"
          sx={{ position: 'fixed', bottom: 24, right: 24, display: { md: 'none' } }}
          onClick={() => setAddDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}

      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-child-dialog-title"
      >
        <DialogTitle id="add-child-dialog-title" sx={{ fontWeight: 600 }}>
          Add New Child
        </DialogTitle>
        <DialogContent>
          <AddChildForm onSave={handleChildAdded} onCancel={() => setAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ChildList;
