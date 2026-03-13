import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  IconButton,
  Pagination,
  Skeleton,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { useNavigate } from 'react-router-dom';
import { childService } from '../../services/childService';
import { Child } from '../../types';
import { getAgeDisplay } from '../../utils/dateUtils';
import { useNotification } from '../../hooks/useNotification';

const ITEMS_PER_PAGE = 10;

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [patients, setPatients] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await childService.getDoctorPatients(page, ITEMS_PER_PAGE, search || undefined);
      setPatients(response.data);
      setTotalPages(response.totalPages);
    } catch {
      notify('Failed to load patients', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, notify]);

  useEffect(() => {
    const timeout = setTimeout(fetchPatients, 300);
    return () => clearTimeout(timeout);
  }, [fetchPatients]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Patients
      </Typography>

      <Box mb={3}>
        <TextField
          placeholder="Search patients by name..."
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
          size="small"
          fullWidth
          inputProps={{ 'aria-label': 'Search patients' }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table aria-label="Patients table">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Blood Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Vaccinations</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : patients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
                          <ChildCareIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {patient.firstName} {patient.lastName}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{getAgeDisplay(patient.dateOfBirth)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={patient.gender}
                        size="small"
                        color={patient.gender === 'male' ? 'info' : 'secondary'}
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{patient.bloodType || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {patient.vaccinationRecords?.length || 0} records
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/doctor/patients/${patient.id}`);
                        }}
                        aria-label={`View patient ${patient.firstName} ${patient.lastName}`}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && patients.length === 0 && (
        <Box textAlign="center" py={6}>
          <ChildCareIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">No patients found</Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default PatientList;
