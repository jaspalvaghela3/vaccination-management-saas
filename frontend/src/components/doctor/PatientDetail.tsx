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

  Button,
  Skeleton,
  Divider,
  GridLegacy as Grid,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { childService } from '../../services/childService';
import { scheduleService } from '../../services/scheduleService';
import { Child, VaccinationRecord } from '../../types';
import { formatDate, getAgeDisplay } from '../../utils/dateUtils';
import { VACCINATION_STATUS_COLORS } from '../../constants';
import { useNotification } from '../../hooks/useNotification';
import VaccinationForm from './VaccinationForm';

interface PatientDetailProps {
  patientId: string;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patientId }) => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [patient, setPatient] = useState<Child | null>(null);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientResponse, vaccinationsResponse] = await Promise.all([
          childService.getChild(patientId),
          scheduleService.getChildVaccinations(patientId),
        ]);
        setPatient(patientResponse.data);
        setVaccinations(vaccinationsResponse.data);
      } catch {
        notify('Failed to load patient details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId, notify]);

  const handleVaccinationSaved = () => {
    setShowVaccinationForm(false);
    notify('Vaccination record saved successfully', 'success');
    scheduleService.getChildVaccinations(patientId).then((r) => setVaccinations(r.data));
  };

  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3, mb: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box textAlign="center" py={6}>
        <Typography color="text.secondary">Patient not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <IconButton onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          Patient Details
        </Typography>
      </Box>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {patient.firstName} {patient.lastName}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Grid container spacing={1}>
                {[
                  { label: 'Date of Birth', value: formatDate(patient.dateOfBirth) },
                  { label: 'Age', value: getAgeDisplay(patient.dateOfBirth) },
                  { label: 'Gender', value: patient.gender, capitalize: true },
                  { label: 'Blood Type', value: patient.bloodType || 'Not recorded' },
                ].map(({ label, value, capitalize }) => (
                  <React.Fragment key={label}>
                    <Grid item xs={5}>
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2" fontWeight={500} sx={capitalize ? { textTransform: 'capitalize' } : {}}>
                        {value}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Medical Information
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Allergies
              </Typography>
              <Typography variant="body2" mb={2}>
                {patient.allergies || 'None recorded'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Medical Notes
              </Typography>
              <Typography variant="body2">{patient.medicalNotes || 'None recorded'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Vaccination Records
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
              onClick={() => setShowVaccinationForm(true)}
            >
              Add Record
            </Button>
          </Box>

          {showVaccinationForm && (
            <Box mb={3}>
              <VaccinationForm
                childId={patientId}
                onSave={handleVaccinationSaved}
                onCancel={() => setShowVaccinationForm(false)}
              />
            </Box>
          )}

          <TableContainer>
            <Table aria-label="Vaccination records table" size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Vaccine</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Dose</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Scheduled</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Administered</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Batch #</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vaccinations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <VaccinesIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1, display: 'block', mx: 'auto' }} />
                      <Typography color="text.secondary" variant="body2">
                        No vaccination records
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  vaccinations.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {record.vaccine?.name || 'Unknown Vaccine'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">Dose {record.doseNumber}</Typography>
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
                          color={(VACCINATION_STATUS_COLORS[record.status] as 'success' | 'info' | 'error' | 'warning') || 'default'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{record.batchNumber || '-'}</Typography>
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

export default PatientDetail;
