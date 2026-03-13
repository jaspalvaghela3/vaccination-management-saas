import React, { useEffect, useState } from 'react';
import {
  Box,
  GridLegacy as Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { scheduleService } from '../../services/scheduleService';
import { ParentStats, VaccinationRecord } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { useNotification } from '../../hooks/useNotification';
import { VACCINATION_STATUS_COLORS } from '../../constants';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading }) => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          {loading ? (
            <Skeleton width={60} height={40} />
          ) : (
            <Typography variant="h4" fontWeight={700}>
              {value}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            bgcolor: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const ParentDashboard: React.FC = () => {
  const [stats, setStats] = useState<ParentStats | null>(null);
  const [upcomingVaccinations, setUpcomingVaccinations] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, upcomingResponse] = await Promise.all([
          scheduleService.getParentStats(),
          scheduleService.getUpcomingVaccinations(),
        ]);
        setStats(statsResponse.data);
        setUpcomingVaccinations(upcomingResponse.data.slice(0, 5));
      } catch {
        notify('Failed to load dashboard data', 'error');
        setStats({ totalChildren: 0, upcomingVaccinations: 0, overdueVaccinations: 0, completedVaccinations: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [notify]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Parent Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Track your children&apos;s vaccination schedule
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="My Children"
            value={stats?.totalChildren || 0}
            icon={<ChildCareIcon />}
            color="#1976d2"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Upcoming"
            value={stats?.upcomingVaccinations || 0}
            icon={<CalendarMonthIcon />}
            color="#ed6c02"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Completed"
            value={stats?.completedVaccinations || 0}
            icon={<CheckCircleIcon />}
            color="#2e7d32"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Overdue"
            value={stats?.overdueVaccinations || 0}
            icon={<WarningIcon />}
            color="#d32f2f"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <VaccinesIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Upcoming Vaccinations
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={60} sx={{ mb: 1 }} />)
          ) : upcomingVaccinations.length === 0 ? (
            <Box textAlign="center" py={4}>
              <CheckCircleIcon sx={{ fontSize: 40, color: 'success.light', mb: 1 }} />
              <Typography color="text.secondary">No upcoming vaccinations</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {upcomingVaccinations.map((record, index) => (
                <React.Fragment key={record.id}>
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <VaccinesIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {record.vaccine?.name || 'Vaccination'} - Dose {record.doseNumber}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          Scheduled: {formatDate(record.scheduledDate)}
                        </Typography>
                      }
                    />
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
                  </ListItem>
                  {index < upcomingVaccinations.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ParentDashboard;
