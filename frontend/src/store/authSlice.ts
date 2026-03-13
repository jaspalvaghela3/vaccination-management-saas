import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginFormInputs, RegisterDoctorFormInputs, RegisterParentFormInputs, User } from '../types';
import { authService } from '../services/authService';
import { TOKEN_KEYS } from '../constants';

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: !!localStorage.getItem(TOKEN_KEYS.ACCESS),
  loading: false,
  error: null,
};

export const loginThunk = createAsyncThunk('auth/login', async (data: LoginFormInputs, { rejectWithValue }) => {
  try {
    const response = await authService.login(data);
    return response.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerDoctorThunk = createAsyncThunk(
  'auth/registerDoctor',
  async (data: RegisterDoctorFormInputs, { rejectWithValue }) => {
    try {
      const response = await authService.registerDoctor(data);
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const registerParentThunk = createAsyncThunk(
  'auth/registerParent',
  async (data: RegisterParentFormInputs, { rejectWithValue }) => {
    try {
      const response = await authService.registerParent(data);
      return response.data;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchProfileThunk = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getProfile();
    return response.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authService.logout();
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };
    const handleFulfilled = (state: AuthState, action: PayloadAction<{ user: User; tokens: { accessToken: string; refreshToken: string } }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
    };
    const handleRejected = (state: AuthState, action: PayloadAction<unknown>) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(loginThunk.pending, handlePending)
      .addCase(loginThunk.fulfilled, handleFulfilled)
      .addCase(loginThunk.rejected, handleRejected)
      .addCase(registerDoctorThunk.pending, handlePending)
      .addCase(registerDoctorThunk.fulfilled, handleFulfilled)
      .addCase(registerDoctorThunk.rejected, handleRejected)
      .addCase(registerParentThunk.pending, handlePending)
      .addCase(registerParentThunk.fulfilled, handleFulfilled)
      .addCase(registerParentThunk.rejected, handleRejected)
      .addCase(fetchProfileThunk.pending, handlePending)
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfileThunk.rejected, handleRejected);
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
