import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  GridLegacy as Grid,
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { registerDoctorThunk, registerParentThunk } from '../../store/authSlice';
import { registerDoctorSchema, registerParentSchema } from '../../utils/validationSchemas';
import { RegisterDoctorFormInputs, RegisterParentFormInputs } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { SPECIALIZATIONS } from '../../constants';

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useAuth();
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const doctorForm = useForm<RegisterDoctorFormInputs>({ resolver: yupResolver(registerDoctorSchema) });
  const parentForm = useForm<RegisterParentFormInputs>({ resolver: yupResolver(registerParentSchema) });

  const onDoctorSubmit = (data: RegisterDoctorFormInputs) => { dispatch(registerDoctorThunk(data)); };
  const onParentSubmit = (data: RegisterParentFormInputs) => { dispatch(registerParentThunk(data)); };

  const passwordAdornment = (
    <InputAdornment position="end">
      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" aria-label={showPassword ? 'Hide password' : 'Show password'}>
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', p: 2 }}>
      <Paper elevation={2} sx={{ maxWidth: 560, width: '100%', p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        <Box textAlign="center" mb={3}>
          <LocalHospitalIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" fontWeight={700} gutterBottom>Create an Account</Typography>
          <Typography variant="body2" color="text.secondary">Register as a Doctor or Parent</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 3 }}>
          <Tab label="Parent / Guardian" />
          <Tab label="Doctor" />
        </Tabs>

        {tab === 0 && (
          <Box component="form" onSubmit={parentForm.handleSubmit(onParentSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller name="firstName" control={parentForm.control} render={({ field }) => (
                  <TextField {...field} label="First Name" fullWidth error={!!parentForm.formState.errors.firstName} helperText={parentForm.formState.errors.firstName?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="lastName" control={parentForm.control} render={({ field }) => (
                  <TextField {...field} label="Last Name" fullWidth error={!!parentForm.formState.errors.lastName} helperText={parentForm.formState.errors.lastName?.message} />
                )} />
              </Grid>
            </Grid>
            <Controller name="email" control={parentForm.control} render={({ field }) => (
              <TextField {...field} label="Email Address" type="email" fullWidth margin="normal" error={!!parentForm.formState.errors.email} helperText={parentForm.formState.errors.email?.message} />
            )} />
            <Controller name="phone" control={parentForm.control} render={({ field }) => (
              <TextField {...field} label="Phone Number" fullWidth margin="normal" error={!!parentForm.formState.errors.phone} helperText={parentForm.formState.errors.phone?.message} />
            )} />
            <Controller name="address" control={parentForm.control} render={({ field }) => (
              <TextField {...field} label="Address" fullWidth margin="normal" error={!!parentForm.formState.errors.address} helperText={parentForm.formState.errors.address?.message} />
            )} />
            <Controller name="password" control={parentForm.control} render={({ field }) => (
              <TextField {...field} label="Password" type={showPassword ? 'text' : 'password'} fullWidth margin="normal" error={!!parentForm.formState.errors.password} helperText={parentForm.formState.errors.password?.message} InputProps={{ endAdornment: passwordAdornment }} />
            )} />
            <Controller name="confirmPassword" control={parentForm.control} render={({ field }) => (
              <TextField {...field} label="Confirm Password" type={showPassword ? 'text' : 'password'} fullWidth margin="normal" error={!!parentForm.formState.errors.confirmPassword} helperText={parentForm.formState.errors.confirmPassword?.message} InputProps={{ endAdornment: passwordAdornment }} />
            )} />
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register as Parent'}
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box component="form" onSubmit={doctorForm.handleSubmit(onDoctorSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller name="firstName" control={doctorForm.control} render={({ field }) => (
                  <TextField {...field} label="First Name" fullWidth error={!!doctorForm.formState.errors.firstName} helperText={doctorForm.formState.errors.firstName?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="lastName" control={doctorForm.control} render={({ field }) => (
                  <TextField {...field} label="Last Name" fullWidth error={!!doctorForm.formState.errors.lastName} helperText={doctorForm.formState.errors.lastName?.message} />
                )} />
              </Grid>
            </Grid>
            <Controller name="email" control={doctorForm.control} render={({ field }) => (
              <TextField {...field} label="Email Address" type="email" fullWidth margin="normal" error={!!doctorForm.formState.errors.email} helperText={doctorForm.formState.errors.email?.message} />
            )} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller name="licenseNumber" control={doctorForm.control} render={({ field }) => (
                  <TextField {...field} label="License Number" fullWidth margin="normal" error={!!doctorForm.formState.errors.licenseNumber} helperText={doctorForm.formState.errors.licenseNumber?.message} />
                )} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller name="specialization" control={doctorForm.control} render={({ field }) => (
                  <FormControl fullWidth margin="normal" error={!!doctorForm.formState.errors.specialization}>
                    <InputLabel>Specialization</InputLabel>
                    <Select {...field} label="Specialization">
                      {SPECIALIZATIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                    {doctorForm.formState.errors.specialization && <FormHelperText>{doctorForm.formState.errors.specialization.message}</FormHelperText>}
                  </FormControl>
                )} />
              </Grid>
            </Grid>
            <Controller name="clinicName" control={doctorForm.control} render={({ field }) => (
              <TextField {...field} label="Clinic Name" fullWidth margin="normal" error={!!doctorForm.formState.errors.clinicName} helperText={doctorForm.formState.errors.clinicName?.message} />
            )} />
            <Controller name="clinicAddress" control={doctorForm.control} render={({ field }) => (
              <TextField {...field} label="Clinic Address" fullWidth margin="normal" error={!!doctorForm.formState.errors.clinicAddress} helperText={doctorForm.formState.errors.clinicAddress?.message} />
            )} />
            <Controller name="phone" control={doctorForm.control} render={({ field }) => (
              <TextField {...field} label="Phone Number" fullWidth margin="normal" error={!!doctorForm.formState.errors.phone} helperText={doctorForm.formState.errors.phone?.message} />
            )} />
            <Controller name="password" control={doctorForm.control} render={({ field }) => (
              <TextField {...field} label="Password" type={showPassword ? 'text' : 'password'} fullWidth margin="normal" error={!!doctorForm.formState.errors.password} helperText={doctorForm.formState.errors.password?.message} InputProps={{ endAdornment: passwordAdornment }} />
            )} />
            <Controller name="confirmPassword" control={doctorForm.control} render={({ field }) => (
              <TextField {...field} label="Confirm Password" type={showPassword ? 'text' : 'password'} fullWidth margin="normal" error={!!doctorForm.formState.errors.confirmPassword} helperText={doctorForm.formState.errors.confirmPassword?.message} InputProps={{ endAdornment: passwordAdornment }} />
            )} />
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register as Doctor'}
            </Button>
          </Box>
        )}

        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography component="span" variant="body2" color="primary">Sign in</Typography>
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterForm;
