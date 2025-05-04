// src/redux/Slices/healthReportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchHealthReport = createAsyncThunk(
  'healthReport/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/report', {
        withCredentials: true,
      });
      return response.data.report;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch report');
    }
  }
);

const healthReportSlice = createSlice({
  name: 'healthReport',
  initialState: {
    report: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReport: (state) => {
      state.report = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchHealthReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReport } = healthReportSlice.actions;
export default healthReportSlice.reducer;
