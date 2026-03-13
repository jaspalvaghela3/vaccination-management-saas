import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Child } from '../types';
import { childService } from '../services/childService';

interface ChildState {
  children: Child[];
  selectedChild: Child | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChildState = {
  children: [],
  selectedChild: null,
  loading: false,
  error: null,
};

export const fetchChildrenThunk = createAsyncThunk('children/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await childService.getChildren();
    return response.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch children');
  }
});

export const fetchChildThunk = createAsyncThunk('children/fetchOne', async (id: string, { rejectWithValue }) => {
  try {
    const response = await childService.getChild(id);
    return response.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch child');
  }
});

const childSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    setSelectedChild(state, action: PayloadAction<Child | null>) {
      state.selectedChild = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    addChild(state, action: PayloadAction<Child>) {
      state.children.push(action.payload);
    },
    removeChild(state, action: PayloadAction<string>) {
      state.children = state.children.filter((c) => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChildrenThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildrenThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.children = action.payload;
      })
      .addCase(fetchChildrenThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchChildThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedChild = action.payload;
      })
      .addCase(fetchChildThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedChild, clearError, addChild, removeChild } = childSlice.actions;
export default childSlice.reducer;
