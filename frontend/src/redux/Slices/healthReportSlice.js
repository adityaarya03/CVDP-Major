// src/redux/Slices/healthReportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchHealthReport = createAsyncThunk(
  'healthReport/fetch',
  async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/report`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
