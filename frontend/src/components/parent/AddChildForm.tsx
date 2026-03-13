import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  GridLegacy as Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addChildSchema } from '../../utils/validationSchemas';
import { AddChildFormInputs, Child } from '../../types';
import { childService } from '../../services/childService';
import { BLOOD_TYPES } from '../../constants';

interface AddChildFormProps {
  onSave: (child: Child) => void;
  onCancel: () => void;
}

const AddChildForm: React.FC<AddChildFormProps> = ({ onSave, onCancel }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddChildFormInputs>({
    resolver: yupResolver(addChildSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      bloodType: undefined,
      allergies: '',
      medicalNotes: '',
    },
  });

  const onSubmit = async (data: AddChildFormInputs) => {
    setSubmitError(null);
    try {
      const response = await childService.createChild(data);
      onSave(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setSubmitError(error.response?.data?.message || 'Failed to add child. Please try again.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ pt: 1 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth?.message}
                inputProps={{ max: new Date().toISOString().split('T')[0], 'aria-label': 'Date of birth' }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.gender}>
                <InputLabel>Gender</InputLabel>
                <Select {...field} label="Gender">
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
                {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="bloodType"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Blood Type (Optional)</InputLabel>
                <Select {...field} label="Blood Type (Optional)" value={field.value ?? ''}>
                  <MenuItem value="">
                    <em>Not known</em>
                  </MenuItem>
                  {BLOOD_TYPES.map((bt) => (
                    <MenuItem key={bt} value={bt}>
                      {bt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="allergies"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Allergies (Optional)"
                fullWidth
                multiline
                rows={2}
                placeholder="List any known allergies..."
                error={!!errors.allergies}
                helperText={errors.allergies?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="medicalNotes"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Medical Notes (Optional)"
                fullWidth
                multiline
                rows={2}
                placeholder="Any relevant medical information..."
                error={!!errors.medicalNotes}
                helperText={errors.medicalNotes?.message}
              />
            )}
          />
        </Grid>
      </Grid>

      <Box display="flex" gap={2} mt={3} justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Add Child'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddChildForm;
