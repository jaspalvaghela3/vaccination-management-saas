import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Paper,
  GridLegacy as Grid,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { vaccinationFormSchema } from '../../utils/validationSchemas';
import { VaccinationFormInputs, Vaccine } from '../../types';
import { vaccineService } from '../../services/vaccineService';
import { scheduleService } from '../../services/scheduleService';
import { todayInputFormat } from '../../utils/dateUtils';

interface VaccinationFormProps {
  childId: string;
  onSave: () => void;
  onCancel: () => void;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({ childId, onSave, onCancel }) => {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VaccinationFormInputs>({
    resolver: yupResolver(vaccinationFormSchema) as any,
    defaultValues: {
      childId,
      vaccineId: '',
      scheduledDate: todayInputFormat(),
      administeredDate: todayInputFormat(),
      batchNumber: '',
      notes: '',
      sideEffects: '',
      doseNumber: 1,
    },
  });

  useEffect(() => {
    vaccineService.getVaccines().then((r) => setVaccines(r.data)).catch(() => setVaccines([]));
  }, []);

  const onSubmit = async (data: VaccinationFormInputs) => {
    setSubmitError(null);
    try {
      await scheduleService.createVaccination(data);
      onSave();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setSubmitError(error.response?.data?.message || 'Failed to save vaccination record');
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Add Vaccination Record
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="vaccineId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.vaccineId}>
                  <InputLabel>Vaccine</InputLabel>
                  <Select {...field} label="Vaccine">
                    {vaccines.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.vaccineId && <FormHelperText>{errors.vaccineId.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="doseNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Dose Number"
                  type="number"
                  fullWidth
                  inputProps={{ min: 1, 'aria-label': 'Dose number' }}
                  error={!!errors.doseNumber}
                  helperText={errors.doseNumber?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="scheduledDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Scheduled Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.scheduledDate}
                  helperText={errors.scheduledDate?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="administeredDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Administered Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.administeredDate}
                  helperText={errors.administeredDate?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="batchNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Batch Number"
                  fullWidth
                  placeholder="e.g. LOT-2024-001"
                  error={!!errors.batchNumber}
                  helperText={errors.batchNumber?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="sideEffects"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Side Effects"
                  fullWidth
                  placeholder="Any observed side effects..."
                  error={!!errors.sideEffects}
                  helperText={errors.sideEffects?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Notes"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Additional notes..."
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
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
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Save Record'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default VaccinationForm;
