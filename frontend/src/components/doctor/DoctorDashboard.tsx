import React, { useEffect, useState } from 'react';
import {
  Box,
  GridLegacy as Grid,
  Card,
  CardContent,
  Typography,
  Skeleton,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { scheduleService } from '../../services/scheduleService';
import { DoctorStats } from '../../types';
import { useNotification } from '../../hooks/useNotification';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading }) => (
  <Card sx={{ borderRadius: 3, height: '100%' }}>
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

const monthlyData = [
  { month: 'Jan', completed: 45, scheduled: 12 },
  { month: 'Feb', completed: 52, scheduled: 18 },
  { month: 'Mar', completed: 61, scheduled: 8 },
  { month: 'Apr', completed: 48, scheduled: 22 },
  { month: 'May', completed: 70, scheduled: 15 },
  { month: 'Jun', completed: 55, scheduled: 20 },
];

const CHART_COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f'];

const DoctorDashboard: React.FC = () => {
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const { notify } = useNotification();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await scheduleService.getDoctorStats();
        setStats(response.data);
      } catch {
        notify('Failed to load dashboard statistics', 'error');
        setStats({ totalPatients: 0, vaccinationsDueToday: 0, completedToday: 0, overdueVaccinations: 0 });
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [notify]);

  const coverageData = [
    { name: 'Completed', value: stats?.completedToday || 0 },
    { name: 'Scheduled', value: stats?.vaccinationsDueToday || 0 },
    { name: 'Overdue', value: stats?.overdueVaccinations || 0 },
  ].filter((d) => d.value > 0);

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Doctor Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Overview of your patients and vaccination records
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Patients" value={stats?.totalPatients || 0} icon={<PeopleIcon />} color="#1976d2" loading={statsLoading} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Due Today" value={stats?.vaccinationsDueToday || 0} icon={<CalendarTodayIcon />} color="#ed6c02" loading={statsLoading} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Completed Today" value={stats?.completedToday || 0} icon={<CheckCircleIcon />} color="#2e7d32" loading={statsLoading} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Overdue" value={stats?.overdueVaccinations || 0} icon={<WarningIcon />} color="#d32f2f" loading={statsLoading} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Monthly Vaccination Activity</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" name="Completed" fill="#1976d2" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scheduled" name="Scheduled" fill="#90caf9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, p: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Today&apos;s Status</Typography>
            {coverageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={coverageData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {coverageData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height={200}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDashboard;
