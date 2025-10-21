// store/slices/staticsSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import staticsAPI from "@/api/statics";

interface Content {
  [key: string]: any;
}

interface StaticsState {
  content: Content;
  loading: boolean;
  error: string | null;
}

const initialState: StaticsState = {
  content: {},
  loading: false,
  error: null,
};

// Async Thunks
export const getContentBySlug = createAsyncThunk(
  'statics/getContentBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await staticsAPI.getContentBySlug({ slug });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取内容失败');
    }
  }
);

const staticsSlice = createSlice({
  name: "statics",
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<Content>) => {
      state.content = action.payload;
    },
    clearContent: (state) => {
      state.content = {};
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContentBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContentBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
        state.error = null;
      })
      .addCase(getContentBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { 
  setContent, 
  clearContent, 
  clearError 
} = staticsSlice.actions;
export default staticsSlice.reducer;