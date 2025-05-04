// src/redux/slices/historySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchHistory = createAsyncThunk('history/fetch', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${BASE_URL}/history`, { withCredentials: true });
    return res.data.history; // ✅ Fix here
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
  }
});


const historySlice = createSlice({
  name: 'history',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.error = action.payload;
      });
  },
});

export default historySlice.reducer;