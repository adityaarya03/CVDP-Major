// src/redux/slices/predictionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch the latest prediction from history (used on HomePage/Dashboard)
export const fetchLatestPrediction = createAsyncThunk(
  'prediction/fetchLatest',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${BASE_URL}/history`, { 
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
       });
      if (!Array.isArray(res.data) || res.data.length === 0) return null;
      return res.data[0]; // latest prediction
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch latest prediction');
    }
  }
);


// Submit a new prediction form
export const submitPrediction = createAsyncThunk(
  'prediction/submit',
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(`${BASE_URL}/predict`, formData, { 
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
       });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Prediction failed');
    }
  }
);

const predictionSlice = createSlice({
  name: 'prediction',
  initialState: {
    result: null,
    loading: false,
    error: null,
  },
  reducers: {
  clearPrediction: (state) => {
    state.result = null;
    state.error = null;
  },
  setLatestPrediction: (state, action) => {
    state.result = action.payload;
    state.error = null;
  },
},

  extraReducers: (builder) => {
    builder
      // Fetching latest
      .addCase(fetchLatestPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(fetchLatestPrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submitting new prediction
      .addCase(submitPrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitPrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(submitPrediction.rejected, (state, action) => {
        state.loading = false;
        state.result = null;
        state.error = action.payload;
      });
  },
});

export const { clearPrediction, setLatestPrediction } = predictionSlice.actions;

export default predictionSlice.reducer;
