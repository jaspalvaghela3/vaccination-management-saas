import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,

  Skeleton,
  Divider,
  GridLegacy as Grid,
  IconButton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WarningIcon from '@mui/icons-material/Warning';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { useNavigate } from 'react-router-dom';
import { childService } from '../../services/childService';
import { scheduleService } from '../../services/scheduleService';
import { Child, VaccinationRecord } from '../../types';
import { formatDate, getAgeDisplay } from '../../utils/dateUtils';
import { VACCINATION_STATUS_COLORS } from '../../constants';
import { useNotification } from '../../hooks/useNotification';

interface ChildDetailProps {
  childId: string;
}

const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  if (status === 'completed') return <CheckCircleIcon color="success" fontSize="small" />;
  if (status === 'overdue') return <WarningIcon color="error" fontSize="small" />;
  return <ScheduleIcon color="info" fontSize="small" />;
};

const ChildDetail: React.FC<ChildDetailProps> = ({ childId }) => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [child, setChild] = useState<Child | null>(null);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [childResponse, vaccinationsResponse] = await Promise.all([
          childService.getChild(childId),
          scheduleService.getChildVaccinations(childId),
        ]);
        setChild(childResponse.data);
        setVaccinations(vaccinationsResponse.data);
      } catch {
        notify('Failed to load child details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [childId, notify]);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3, mb: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (!child) {
    return (
      <Box textAlign="center" py={6}>
        <Typography color="text.secondary">Child not found</Typography>
      </Box>
    );
  }

  const completedCount = vaccinations.filter((v) => v.status === 'completed').length;
  const completionRate = vaccinations.length > 0 ? (completedCount / vaccinations.length) * 100 : 0;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <IconButton onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          {child.firstName}&apos;s Vaccination Record
        </Typography>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {child.firstName} {child.lastName}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={1}>
                {[
                  { label: 'Date of Birth', value: formatDate(child.dateOfBirth) },
                  { label: 'Age', value: getAgeDisplay(child.dateOfBirth) },
                  { label: 'Gender', value: child.gender, capitalize: true },
                  { label: 'Blood Type', value: child.bloodType || 'Not recorded' },
                ].map(({ label, value, capitalize }) => (
                  <React.Fragment key={label}>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={capitalize ? { textTransform: 'capitalize' } : {}}
                      >
                        {value}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
              {child.allergies && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Allergies
                  </Typography>
                  <Typography variant="body2">{child.allergies}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Vaccination Progress
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Completion Rate</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {Math.round(completionRate)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{ height: 8, borderRadius: 4 }}
                  color="success"
                  aria-label={`Vaccination completion rate: ${Math.round(completionRate)}%`}
                />
              </Box>
              <Grid container spacing={2}>
                {[
                  { label: 'Total', value: vaccinations.length, color: 'primary.main' },
                  {
                    label: 'Completed',
                    value: vaccinations.filter((v) => v.status === 'completed').length,
                    color: 'success.main',
                  },
                  {
                    label: 'Upcoming',
                    value: vaccinations.filter((v) => v.status === 'scheduled').length,
                    color: 'info.main',
                  },
                  {
                    label: 'Overdue',
                    value: vaccinations.filter((v) => v.status === 'overdue').length,
                    color: 'error.main',
                  },
                ].map(({ label, value, color }) => (
                  <Grid item xs={6} sm={3} key={label}>
                    <Box textAlign="center">
                      <Typography variant="h5" fontWeight={700} color={color}>
                        {value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <VaccinesIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Vaccination Schedule
            </Typography>
          </Box>
          <TableContainer>
            <Table aria-label="Vaccination schedule table" size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Vaccine</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Dose</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Scheduled Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Administered</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vaccinations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <VaccinesIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography color="text.secondary" variant="body2">
                        No vaccination records yet
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  vaccinations.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>
                        <Tooltip title={record.status} placement="top">
                          <Box display="flex" alignItems="center">
                            <StatusIcon status={record.status} />
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {record.vaccine?.name || 'Unknown Vaccine'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Dose ${record.doseNumber}`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(record.scheduledDate)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.administeredDate ? formatDate(record.administeredDate) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.status}
                          size="small"
                          color={
                            (VACCINATION_STATUS_COLORS[record.status] as
                              | 'success'
                              | 'info'
                              | 'error'
                              | 'warning') || 'default'
                          }
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChildDetail;
