import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: string;
  temperature: number | null;
  timestamp: number;
}

interface SystemState {
  stats: SystemStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: SystemState = {
  stats: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

export const fetchSystemStats = createAsyncThunk(
  'system/fetchStats',
  async (_, { getState }) => {
    const state = getState() as { system: SystemState };
    
    // Cache for 30 seconds
    if (
      state.system.lastUpdated &&
      Date.now() - state.system.lastUpdated < 30000
    ) {
      return state.system.stats;
    }

    const response = await fetch('/api/system');
    if (!response.ok) {
      throw new Error('Failed to fetch system stats');
    }
    return response.json();
  }
);

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    clearSystemError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSystemStats.fulfilled,
        (state, action: PayloadAction<SystemStats>) => {
          state.isLoading = false;
          state.stats = action.payload;
          state.lastUpdated = Date.now();
        }
      )
      .addCase(fetchSystemStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export const { clearSystemError } = systemSlice.actions;
export default systemSlice.reducer;
